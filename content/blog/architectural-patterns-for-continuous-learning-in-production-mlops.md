---
title: "Architectural Patterns for Continuous Learning in Production MLOps"
slug: "architectural-patterns-for-continuous-learning-in-production-mlops"
date: "2026-09-19"
description: "Patterns for production models that learn from streams without catastrophic forgetting, while keeping deploys stable and backward compatible."
keywords:
  - continuous learning
  - MLOps architecture
  - catastrophic forgetting
  - online learning
  - model deployment
  - software architecture
  - Lahore
  - Pakistan
author: "Anber Aziz"
cover: "/blog/architectural-patterns-for-continuous-learning-in-production-mlops.webp"
coverAlt: "Orange accent cover for continuous learning architecture in production MLOps"
faq:
  - question: "What is continuous learning in production MLOps?"
    answer: "The model or its adapters update on a schedule or a stream while the serving contract stays stable. It is an architecture: data contracts, training jobs, evaluation gates, and rollout—not a flag that turns gradient steps on in the API process."
  - question: "How do you avoid catastrophic forgetting?"
    answer: "Replay a curated buffer of old tasks, regularize toward previous weights, or isolate new skills in adapters and merge only after evals. Measure old-task metrics on every candidate, not only the new stream's loss."
  - question: "Should the serving replica train on live traffic?"
    answer: "Almost never. Train in a job with pinned data snapshots. Serve immutable artifacts. Online learning in the request path couples availability to GPU instability and makes rollbacks philosophical."
  - question: "How do you keep backward compatibility while models change?"
    answer: "Version the input schema, output schema, and decision policy separately. Shadow, canary, and freeze a champion. Downstream systems bind to a schema version, not to 'whatever the latest notebook exported.'"
  - question: "What pattern fits teams in Lahore with limited GPU?"
    answer: "Scheduled fine-tunes of adapters on a replay mix, CPU or small-GPU eval, and canary in the region you actually serve. Full continual-learning research stacks are optional. A weekly champion-challenger loop with forgetting checks is not."
---

Production ML that never learns after launch dies of drift. Production ML that learns in the request path dies of a bad batch. Continuous learning is the software-architecture problem in between: how to ingest streams, update weights or adapters, prove you did not forget yesterday’s task, and ship an artifact that old clients can still call.

Catastrophic forgetting is the empirical fact that gradient updates for a new distribution overwrite skills you still need. MLOps that ignores it will look great on last week’s dashboard and fail on last year’s customers.

## Who this is for

I wrote this for ML platform engineers, for product teams with recommendation or fraud models that must move weekly, and for architects who have to keep a mobile app working when the score’s meaning changes. Teams in Lahore, across Pakistan, and remote-from-Pakistan often train in one region and serve in another. Compatibility and cost are not academic. A forgotten class that only appears in South Asian traffic will not show up in a US-only eval set.

If you are a founder, “the model improves itself” is not a roadmap. If you are an SRE, you need rollbacks of **models** as first-class as rollbacks of binaries. If you are a researcher, your method needs a serving pattern or it will stay in a notebook.

## What architectural pattern should you start from?

**Champion–challenger with immutable artifacts.**

```text
stream → feature log + labels
      → snapshot (time-bounded)
      → train job (replay mix + new data)
      → eval (new + old slices + schema tests)
      → registry (model@version + card)
      → shadow → canary → champion
      → freeze previous champion for rollback
```

The serving replica loads a hashed artifact. It does not `loss.backward()`. That split is the difference between MLOps and a science fair.

### Pattern A: Scheduled replay fine-tune

Best default. Buffer labeled events. Mix 30–70% replay from a stratified store of old tasks. Fine-tune adapters (LoRA) rather than full weights when you can. Evaluate. Promote.

### Pattern B: Adapter per concept

New season, new fraud ring, new language: train an adapter. Route with a stable policy. Merge or distill only after a forgetting suite passes. This is how you avoid one global update smashing a rare class.

### Pattern C: Constrained online updates

Bandits or calibrated logistic models with bounded steps, not a 7B LLM in the hot path. If you truly need per-minute updates, restrict the hypothesis class and cap the learning rate in code, not in a comment.

### Pattern D: Teacher–student distillation on a delay

A large teacher trained offline; a small student updated for latency. Students can forget too. Distill on a mix, not only on the latest teacher outputs.

## How do you engineer against forgetting?

Forgetting is a test, not a hope.

- **Replay buffer** with class, region, and time strata. If 8% of users are in Pakistan, 8% of replay should not collapse to zero because US events dominate the stream.
- **Regularization** (EWC-style or simpler L2-to-previous) when replay is incomplete.
- **Holdout “museum” sets** that never enter training. Run them on every candidate.
- **Behavioral diffs.** Top-k decisions that flipped vs champion, reviewed like an API changelog.

```python
def promote(cand, champ, museum, max_forget=0.02):
    new_ok = cand.metric("stream") >= champ.metric("stream") - 0.005
    old_ok = champ.metric("museum") - cand.metric("museum") <= max_forget
    return new_ok and old_ok
```

If you cannot express promotion in ten lines, you do not have a gate.

## What must stay backward compatible?

Three contracts:

1. **Input schema.** Feature names, types, defaults, and delay. A new feature that is 90% missing in mobile clients is a silent train/serve skew.
2. **Output schema.** Score ranges, class names, abstain codes. Do not reuse `score` for a differently calibrated model without a version field.
3. **Policy.** Thresholds and business rules live outside the network when you can. Then you can roll back a threshold without a GPU job.

Mobile apps distributed in Pakistan do not update on your registry’s schedule. Keep a translation layer: `v3` models can still fill a `v2` response until the app floor moves.

## How should the data plane be designed?

Continuous learning dies in the pipes, not in the optimizer. You need a feature log that is **joinable** to delayed labels, with the same version the serving path used.

- **Point-in-time correctness.** If a user feature is “last 7 day spend,” store the value as of inference time, not as of training time a week later.
- **Label delay windows.** Fraud and churn labels arrive late. Training jobs must freeze a watermark: no label newer than T minus delay.
- **Idempotent events.** Streams retry. Duplicate clicks must not become duplicate positives.
- **Tenant and region keys.** A global replay buffer that under-samples Pakistan traffic will “forget” that slice even if the algorithm is textbook EWC.

I keep a simple contract: every inference writes `(request_id, model_version, feature_hash, scores)`. Labels land in a second table. The train job is a join, not a hope that Kafka still has the payload.

## How do you test the architecture?

Treat the learning loop like a distributed system.

- **Replay a day** of production features in staging against champion and candidate. Scores should be bit-stable for a frozen artifact.
- **Inject forgetting:** train a candidate with replay disabled and confirm the museum gate rejects it.
- **Schema fuzz:** drop a feature, delay a feature, send an extra field. Serving must default in a documented way; training must not silently fill with zeros that never appear online.
- **Rollback drill:** pin traffic to the previous champion in one region. Teams serving the US from Lahore should drill this during overlap hours, not during a solo night shift.

If these tests are missing, you do not have continuous learning. You have a cron job.

## Where do teams fail?

- Training on the serving box “to be real-time.”
- Updating on unlabeled clicks as if they were labels.
- Eval on the new stream only.
- One global model for all tenants with no museum set per tenant.
- No budget for data delay: labels that arrive in 14 days trained as if they arrived in 14 minutes.
- Shipping a new class name without a mapping layer for old mobile clients.
- Measuring only loss, never flipped decisions versus the champion.

## What should you ship this quarter?

Log features and delayed labels with versions. Stand up a replay-mix job weekly. Add a museum set that includes the slices you cannot afford to forget. Serve from a registry with one-click rollback. Put the promotion rule in CI. That is continuous learning as software engineering.

I design production AI systems from Lahore. If your model is drifting and the only update path is a laptop, [services](https://www.anber.me/services) is how I work with teams, and [contact](https://www.anber.me/contact) is the shortest path to an architecture review.

## FAQ

### What is continuous learning in production MLOps?

The model or its adapters update on a schedule or a stream while the serving contract stays stable. It is an architecture: data contracts, training jobs, evaluation gates, and rollout—not a flag that turns gradient steps on in the API process.

### How do you avoid catastrophic forgetting?

Replay a curated buffer of old tasks, regularize toward previous weights, or isolate new skills in adapters and merge only after evals. Measure old-task metrics on every candidate, not only the new stream's loss.

### Should the serving replica train on live traffic?

Almost never. Train in a job with pinned data snapshots. Serve immutable artifacts. Online learning in the request path couples availability to GPU instability and makes rollbacks philosophical.

### How do you keep backward compatibility while models change?

Version the input schema, output schema, and decision policy separately. Shadow, canary, and freeze a champion. Downstream systems bind to a schema version, not to "whatever the latest notebook exported."

### What pattern fits teams in Lahore with limited GPU?

Scheduled fine-tunes of adapters on a replay mix, CPU or small-GPU eval, and canary in the region you actually serve. Full continual-learning research stacks are optional. A weekly champion-challenger loop with forgetting checks is not.
