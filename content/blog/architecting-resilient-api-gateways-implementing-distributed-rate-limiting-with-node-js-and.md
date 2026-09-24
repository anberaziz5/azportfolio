---
title: "Architecting Resilient API Gateways: Implementing Distributed Rate Limiting with Node.js and Redis"
slug: "architecting-resilient-api-gateways-implementing-distributed-rate-limiting-with-node-js-and"
date: "2026-07-28"
description: "How to move rate limiting out of process memory and into Redis so horizontally scaled Node.js gateways enforce one shared traffic contract."
keywords:
  - Node.js
  - Redis
  - API Gateway
  - Rate Limiting
  - Backend
author: "Anber Aziz"
cover: "/blog/architecting-resilient-api-gateways-implementing-distributed-rate-limiting-with-node-js-and.webp"
coverAlt: "Cover for distributed API rate limiting"
---

In modern distributed architectures, the API gateway is the single point of entry for client traffic. It handles routing, authentication, and analytics. Exposing backend endpoints without guardrails, though, is a stability risk. A traffic spike, a denial-of-service flood, or a runaway client loop can exhaust threads and take down databases.

## The limits of single-server memory throttling

The simplest Express limiter stores IP timestamps in local memory. That works on one instance and fails as soon as you scale horizontally. Sequential requests from the same client land on different containers, each with its own isolated counter, so the real limit becomes `allowed requests × replica count`.

Accurate enforcement needs the rate-limit state in a shared, ultra-low-latency cache.

## Designing a Redis token-bucket middleware

Redis is a strong fit because it is in-memory and supports atomic operations. Atomic scripts mean check-and-update happens as one isolated step, which prevents race conditions under concurrent load.

```js
import Redis from "ioredis";

const redisClient = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

export const distributedRateLimiter = async (req, res, next) => {
  const clientIp = req.ip || req.headers["x-forwarded-for"];
  const trackingKey = `rate_limit:${clientIp}`;
  const REQUEST_WINDOW_SECONDS = 60;
  const MAXIMUM_ALLOWED_REQUESTS = 100;

  try {
    const currentRequestCount = await redisClient.incr(trackingKey);

    if (currentRequestCount === 1) {
      await redisClient.expire(trackingKey, REQUEST_WINDOW_SECONDS);
    }

    res.setHeader("X-RateLimit-Limit", MAXIMUM_ALLOWED_REQUESTS);
    res.setHeader(
      "X-RateLimit-Remaining",
      Math.max(0, MAXIMUM_ALLOWED_REQUESTS - currentRequestCount)
    );

    if (currentRequestCount > MAXIMUM_ALLOWED_REQUESTS) {
      return res.status(429).json({
        status: "error",
        message: "Too many requests. Please ease up on the endpoint traffic loops.",
        retryAfterSeconds: await redisClient.ttl(trackingKey),
      });
    }

    next();
  } catch (error) {
    console.error("[API GATEWAY WARNING] Rate limiting check bypassed:", error.message);
    next();
  }
};
```

### Strategic protections

- **Atomic `INCR`:** native Redis operations avoid miscounts during spikes.
- **Fail-open:** if Redis drops, user traffic still flows instead of locking the product.
- **Informative headers:** clients can back off before they hit 429s.

## Sliding window logs

Fixed windows are cheap. Strict systems often move to a sliding window log with Redis sorted sets. Each request timestamp is stored, old records are trimmed, and the remaining count is the true window occupancy. That removes the classic burst at the window boundary.

Intelligent, auditable perimeter controls keep full-stack platforms stable under volatile enterprise load.
