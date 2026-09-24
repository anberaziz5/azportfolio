---
title: "Architecting Resilient API Gateways: Implementing Distributed Rate Limiting with Node.js and Redis"
slug: "architecting-resilient-api-gateways-implementing-distributed-rate-limiting-with-node-js-and"
date: "2026-07-28"
description: "Move Node.js API rate limiting out of process memory into Redis so every gateway replica enforces one shared traffic contract under live load."
keywords:
  - distributed rate limiting
  - Node.js
  - Redis
  - API Gateway
  - Express middleware
  - Backend architecture
  - Lahore
  - Pakistan
author: "Anber Aziz"
cover: "/blog/architecting-resilient-api-gateways-implementing-distributed-rate-limiting-with-node-js-and.webp"
coverAlt: "Node.js API gateway replicas sharing a Redis rate-limit counter"
faq:
  - question: "Why does in-memory rate limiting fail when I scale Node.js horizontally?"
    answer: "Each replica keeps its own counter. A client that round-robins across n instances can send n times the intended traffic. The limit you configured in Express is no longer the limit the cluster enforces. Shared state in Redis (or an equivalent) is what makes the contract real."
  - question: "Should an API gateway fail open or fail closed if Redis is down?"
    answer: "Product APIs usually fail open so a cache outage does not become a total outage. High-risk endpoints—login, OTP, payment intents—should fail closed or fall back to a tighter local limit. The choice is a risk decision, not a Redis default."
  - question: "What is the difference between a fixed window and a sliding window log?"
    answer: "A fixed window counts requests inside a clock bucket, which is cheap and allows a burst at the boundary. A sliding window log stores timestamps and counts only those inside the last N seconds, which is stricter and uses more memory. Most public APIs start fixed and move sliding on abuse-prone routes."
  - question: "How should I identify clients behind a load balancer?"
    answer: "Do not trust X-Forwarded-For unless the proxy is in your control and you take the rightmost or configured hop. Prefer the identity your gateway already authenticated—API key, tenant id, or session—over raw IP. IP limits are a backstop, not a billing plan."
  - question: "What rate-limit design fits startups and teams in Pakistan?"
    answer: "Start with Redis INCR plus TTL on the public edge, publish Limit and Remaining headers, and fail open on the read path. Product teams in Lahore and remote-from-Pakistan setups often run a few Node replicas on modest VMs; shared Redis is the piece that keeps those replicas honest without a service mesh."
---

In-memory Express throttles lie as soon as you add a second Node.js process. Distributed rate limiting belongs in Redis (or another shared, atomic store) so every API gateway replica reads the same counter. Use a cheap fixed window for most routes, a sliding window on abuse-prone ones, and decide fail-open versus fail-closed per endpoint instead of globally.

In modern distributed architectures, the API gateway is the single point of entry for client traffic. It handles routing, authentication, and analytics. Exposing backend endpoints without guardrails, though, is a stability risk. A traffic spike, a denial-of-service flood, or a runaway client loop can exhaust threads and take down databases.

Rate limiting is not a nice-to-have header. It is the contract that says a tenant, a key, or an IP may not consume the whole fleet. The rest of this article is how I implement that contract when the gateway is no longer one process.

## Who this is for

This is for product teams who have outgrown a single Node instance, for startups about to put a load balancer in front of the API, and for engineering teams in Lahore, across Pakistan, and working remote-from-Pakistan who run small replica counts and still need a correct global limit.

If you are a product manager, 429s are a product surface: retries, client SDKs, and support tickets. If you are a founder, Redis is cheaper than a weekend incident caused by a looped webhook. If you are an engineer, this is about atomic increments, identity keys, and not trusting the first forwarding header you see.

## Why does single-server memory throttling break?

The simplest Express limiter stores IP timestamps in local memory. That works on one instance and fails as soon as you scale horizontally. Sequential requests from the same client land on different containers, each with its own isolated counter, so the real limit becomes `allowed requests × replica count`.

Accurate enforcement needs the rate-limit state in a shared, ultra-low-latency cache.

This is not theoretical. Two pm2 workers on one VM already double the effective quota. Kubernetes with three pods triples it. Teams sometimes "fix" this by dividing the limit by replica count, which then under-serves traffic when a pod dies and the remaining processes become too strict. Shared state is the design that survives autoscaling.

Process memory also evaporates on deploy. A rolling restart resets every counter. Attackers love that cadence. Redis TTL windows survive the Node process; they should not survive forever, which is why every key still carries an expiry.

## How do I design Redis token-bucket style middleware in Node.js?

Redis is a strong fit because it is in-memory and supports atomic operations. Atomic scripts mean check-and-update happens as one isolated step, which prevents race conditions under concurrent load.

The snippet below is a fixed-window counter. I still call the idea a token bucket in reviews because product language maps to "you have N tokens per minute." Strictly, this is `INCR` plus `EXPIRE` on first hit. It is the right default for most JSON APIs.

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

Two production nits belong next to this code. First, `INCR` then `EXPIRE` is two round trips. If the process dies between them, a key can live without TTL. I prefer a Lua script or `SET key 1 EX 60 NX` paired with `INCR` in a single eval so expiry cannot be lost. Second, `x-forwarded-for` can be a comma list. Taking it raw lets a client spoof the identity. In Express, `trust proxy` plus `req.ip` is the minimum; authenticated `tenantId` or `apiKey` is better as the Redis suffix.

Fail-open is correct for a public read API. It is wrong for `/auth/login`. I mount a stricter limiter there and, if Redis is gone, reject or apply a tiny in-process ceiling so credential stuffing cannot ride an outage.

## When should I use a sliding window log?

Fixed windows are cheap. Strict systems often move to a sliding window log with Redis sorted sets. Each request timestamp is stored, old records are trimmed, and the remaining count is the true window occupancy. That removes the classic burst at the window boundary.

A client that waits until `00:00:59` and then dumps 100 requests, then dumps 100 more at `00:01:00`, has sent 200 in two seconds against a "100 per minute" fixed window. If that burst can knock over a downstream database, the sorted-set log is worth the extra memory.

```js
export async function slidingWindowAllow(redis, key, max, windowMs) {
  const now = Date.now();
  const min = now - windowMs;
  const pipeline = redis.multi();
  pipeline.zremrangebyscore(key, 0, min);
  pipeline.zadd(key, now, `${now}:${Math.random()}`);
  pipeline.zcard(key);
  pipeline.expire(key, Math.ceil(windowMs / 1000));
  const results = await pipeline.exec();
  const count = results[2][1];
  return count <= max;
}
```

`ZADD` members must be unique, which is why the member is a timestamp plus jitter. Under extreme concurrency, a Lua script is still the safer atomic boundary than a `MULTI` pipeline, because pipelines are not transactional in the way people assume. For most product APIs I ship, fixed windows on Redis plus a sliding log on login and password-reset is the split that stays operable.

## How do I compare limiter designs?

| Design | Accuracy at boundary | Redis cost | Typical use |
| --- | --- | --- | --- |
| In-process memory | Fine on one replica; wrong on n | None | Local dev only |
| Fixed window `INCR` | Burst possible at edges | One integer key | Default public API |
| Sliding window log | Strict last-N-seconds | Sorted set of events | Auth, OTP, webhooks |
| Token bucket (Lua) | Smooth refill | Hash or string + script | Paid APIs with bursting |

Intelligent, auditable perimeter controls keep full-stack platforms stable under volatile enterprise load. Publish `Retry-After` as well as remaining counts. SDKs and mobile clients can sleep. Browsers can show a real message. Silent 429s create retry storms, which is the failure mode you were trying to prevent.

## What else belongs in a resilient gateway besides the counter?

Rate limiting is one control. I still put it next to:

- **Per-route and per-tenant ceilings.** A marketplace seller and a mobile client should not share one global 100/minute.
- **Idempotency keys** on POSTs that clients retry.
- **Timeouts and bulkheads** so a slow dependency cannot hold every Node thread.
- **Structured 429 bodies** your frontend already knows how to render.

Do not put the limiter after an expensive handler. Middleware order is the architecture. Authenticate enough to know the tenant, then limit, then run the query.

I build production AI and full-stack systems from Lahore, and the gateway work I trust is boring on purpose: Redis, atomic increments, honest headers, and a written policy for outages. Anber Aziz is the name on this post because I have had to explain to a product team why their "100 requests per minute" was 400 once Kubernetes scaled.

If you are hardening an API edge or designing tenant-aware limits, [services](https://www.anber.me/services) describes how I work with product and engineering teams, and [contact](https://www.anber.me/contact) is the right next step.

## FAQ

### Why does in-memory rate limiting fail when I scale Node.js horizontally?

Each replica keeps its own counter. A client that round-robins across n instances can send n times the intended traffic. The limit you configured in Express is no longer the limit the cluster enforces. Shared state in Redis (or an equivalent) is what makes the contract real.

### Should an API gateway fail open or fail closed if Redis is down?

Product APIs usually fail open so a cache outage does not become a total outage. High-risk endpoints—login, OTP, payment intents—should fail closed or fall back to a tighter local limit. The choice is a risk decision, not a Redis default.

### What is the difference between a fixed window and a sliding window log?

A fixed window counts requests inside a clock bucket, which is cheap and allows a burst at the boundary. A sliding window log stores timestamps and counts only those inside the last N seconds, which is stricter and uses more memory. Most public APIs start fixed and move sliding on abuse-prone routes.

### How should I identify clients behind a load balancer?

Do not trust X-Forwarded-For unless the proxy is in your control and you take the rightmost or configured hop. Prefer the identity your gateway already authenticated—API key, tenant id, or session—over raw IP. IP limits are a backstop, not a billing plan.

### What rate-limit design fits startups and teams in Pakistan?

Start with Redis INCR plus TTL on the public edge, publish Limit and Remaining headers, and fail open on the read path. Product teams in Lahore and remote-from-Pakistan setups often run a few Node replicas on modest VMs; shared Redis is the piece that keeps those replicas honest without a service mesh.
