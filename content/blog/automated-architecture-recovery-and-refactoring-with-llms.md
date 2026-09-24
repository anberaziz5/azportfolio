---
title: "Automated Architecture Recovery and Refactoring with Large Language Models"
slug: "automated-architecture-recovery-and-refactoring-with-llms"
date: "2026-09-24"
description: "Recover architecture from legacy monoliths with LLMs, score microservice cuts, and ship migrations you can evaluate—not just generate."
keywords:
  - architecture recovery
  - LLM refactoring
  - microservices migration
  - software engineering
  - AI engineering
  - legacy modernization
  - Lahore
  - Pakistan
author: "Anber Aziz"
cover: "/blog/automated-architecture-recovery-and-refactoring-with-llms.webp"
coverAlt: "Orange accent cover for LLM-based architecture recovery and microservices refactoring"
faq:
  - question: "Can an LLM recover the architecture of a legacy monolith on its own?"
    answer: "No. An LLM can propose a candidate architecture from code, call graphs, and logs, but recovery is only real when you ground it in static analysis, runtime traces, and a fitness function you can score. Treat the model as a synthesizer of hypotheses, not as the source of truth."
  - question: "How do I evaluate a generated microservices split?"
    answer: "Score coupling, cohesion, data ownership, deployability, and failure isolation on the same rubric for every candidate. If two services share a write path to one table, the cut is not a service—it is a distributed monolith. Run the rubric before you generate Dockerfiles."
  - question: "What is the biggest risk of LLM-driven refactoring?"
    answer: "Fluent but untrue coupling maps. Models invent module names, skip hidden shared state, and under-count cross-cutting concerns like auth and jobs. Always overlay static deps and production traces on the LLM output before you move a package."
  - question: "Should startups in Pakistan migrate to microservices with AI tools?"
    answer: "Only when deploy cadence, team boundaries, or scaling axes actually hurt. LLM-assisted recovery is cheapest as a map of the current system. A small team in Lahore shipping one product often needs a modular monolith more than a mesh."
  - question: "What pipeline should I run first?"
    answer: "Extract a dependency graph, recover bounded contexts with an LLM constrained by that graph, score cuts with an explicit fitness function, then generate a strangler-fig plan. Do not let the model rewrite production until the plan survives review and a canary."
---

Architecture recovery is the act of reconstructing the intended and the actual structure of a system from the artifacts it left behind: packages, call graphs, schema, and production traces. Refactoring toward microservices is a different job. It is a design decision about deployability, failure isolation, and team ownership. Large language models are useful for both, but only if you treat them as hypothesis engines sitting on top of measurements you already trust.

Every few months a team shows me a generated “target architecture” that looks like a conference talk. The boxes have good names. The arrows are tidy. Then we open the database and find four bounded contexts writing the same table. The model did not fail at English. It failed at evidence.

## Who this is for

I wrote this for staff engineers sitting on a Java or .NET monolith that still pays the bills, for platform teams that have to justify a migration without a two-year rewrite, and for AI-engineering groups that want to put LLMs on code without shipping a distributed mess. Teams in Lahore, across Pakistan, and working remote-from-Pakistan into US or EU regions have an extra constraint: you cannot afford a migration that doubles cloud spend and on-call pages at the same time.

If you are a founder, you need a sequence that produces a map before it produces Kubernetes YAML. If you are an architect, you need a fitness function you can argue in a design review. If you are an ML engineer wrapping a codebase in prompts, you need to know where the model is guessing.

## What is automated architecture recovery?

Recovery answers: what are the real modules, the real data owners, and the real runtime coupling? Classic software-engineering work used clustering on dependency graphs, concept analysis, and dynamic traces. Those methods still matter. LLMs add a semantic layer. They can name a cluster “billing” instead of “module_14,” summarize why two packages change together, and draft an interface for a cut you already scored.

The pipeline I use has four stages:

1. **Measure.** Static imports, build graph, database foreign keys, message topics, and production traces.
2. **Hypothesize.** Prompt an LLM with those graphs, not with the entire repo dumped into context.
3. **Evaluate.** Score every candidate cut against coupling, cohesion, data ownership, and operational cost.
4. **Plan.** Emit a strangler-fig sequence: extract, dual-run, cut over, delete.

Skip step one and you are doing creative writing on a call graph.

## How should an LLM read a monolith?

Do not paste the repository. Recover structure first, then ask the model to interpret it.

```ts
type ModuleFacts = {
  name: string;
  loc: number;
  imports: string[];
  tablesWritten: string[];
  endpoints: string[];
  changeCoupling: string[];
};

function recoveryPrompt(facts: ModuleFacts[]) {
  return [
    "You are recovering bounded contexts from measured facts.",
    "Do not invent modules that are not in the fact list.",
    "Group modules only when they share write ownership or a single change axis.",
    "Return JSON: contexts[], sharedKernels[], openQuestions[].",
    JSON.stringify(facts),
  ].join("\n");
}
```

The JSON contract matters. Free-form architecture essays are hard to score. Structured output can be diffed against the last recovery run, checked for invented names, and fed into a fitness function.

### What facts must be in the prompt?

- **Static coupling:** who imports whom, including reflection and generated clients if you can see them.
- **Data ownership:** which packages issue INSERT/UPDATE against which tables.
- **Change coupling:** files that land in the same pull requests over six to twelve months.
- **Runtime coupling:** traces that show A always waits on B under load.
- **Team ownership:** CODEOWNERS or deploy permissions, because Conway’s law is not optional.

An LLM that only sees folder names will cluster by vocabulary, not by write paths. That is how “UserService” and “AuthService” become two boxes that still share `users`.

## How do you score a microservices proposal?

A cut is a hypothesis. Score it.

| Criterion | Question | Fail if |
| --- | --- | --- |
| Write ownership | Does one service own each table? | Two services update the same rows |
| Cohesion | Do the extracted types change for one reason? | “Utils” and “Common” become a service |
| Failure isolation | Can this service die without taking checkout down? | Hard RPC on the hot path with no timeout |
| Deployability | Can this team ship daily without a monolith freeze? | Shared library still requires a lockstep release |
| Cost | Does the split add hops you cannot afford? | Extra p95 from Pakistan to `us-east-1` for a chatty call |

I keep the rubric in code, not in a slide. When the model proposes a split, a script computes the same numbers on the recovered graph. If cohesion drops, the proposal is rejected even if the names sound enterprise-grade.

## What does a strangler-fig plan look like in practice?

LLM output that jumps to “rewrite in Go with gRPC” is not a plan. A plan names the first seam.

Typical first seams in a commerce monolith: PDF generation, search indexing, notification dispatch. They have asynchronous boundaries you can dual-run. Typical last seams: pricing and inventory, because they own the write path.

```yaml
migration:
  - extract: notifications
    dual_run_days: 14
    success: "error_rate < 0.5% vs monolith"
  - extract: search_indexer
    dual_run_days: 21
    success: "index lag < 60s"
  - defer: checkout
    reason: "shared writes to orders"
```

The model can draft this YAML. A human still owns the success metrics. Teams in Lahore shipping to US customers should put latency budgets on every new hop. A “clean” service map that adds three serial calls across the Atlantic is a regression.

## Where do LLMs fail at architecture work?

- **Hidden shared state.** Caches, feature flags, and outbox tables that do not appear in import graphs.
- **Cross-cutting jobs.** Cron that touches every context at 02:00.
- **Authn/z.** A generated “identity service” that still calls back into the monolith for every permission.
- **Over-splitting.** Twenty services for a five-person team. You traded a compile-time boundary for a distributed monolith and a Grafana bill.
- **Under-citing.** The model describes a module that used to exist. Recovery must be re-run when the graph changes, not once per year.

Guardrails I treat as non-negotiable: no invented module names, no proposed writes to tables the facts say are owned elsewhere, and a hard refuse when the graph is incomplete.

## How should research teams evaluate this?

If you are treating this as a research program, not a weekend refactor, you need more than “the diagram looked right.”

- **Recovery fidelity:** precision/recall of recovered components against an expert-labeled architecture.
- **Cut quality:** modularity quality (MQ), turboMQ, or a custom write-ownership score vs a human baseline.
- **Migration risk:** number of dual-run defects per extracted seam.
- **Human time:** hours of architect review saved, not lines of YAML generated.

Publish the graph and the prompt. If a paper only shows ChatGPT screenshots of boxes, it is not architecture recovery. It is rendering.

## What should you ship this quarter?

Recover the current architecture with measurements. Ask an LLM to name and explain clusters, not to invent a target platform. Score one candidate split. If the split fails write ownership, stop. If it passes, extract one asynchronous seam behind a dual-run. That is the whole loop.

I build production AI and full-stack systems from Lahore. The architecture conversations that go well start with a graph, not with a model vendor. If you want a second pair of eyes on a monolith you cannot freeze, [services](https://www.anber.me/services) is how I work with teams, and [contact](https://www.anber.me/contact) is the shortest path to a review.

## FAQ

### Can an LLM recover the architecture of a legacy monolith on its own?

No. An LLM can propose a candidate architecture from code, call graphs, and logs, but recovery is only real when you ground it in static analysis, runtime traces, and a fitness function you can score. Treat the model as a synthesizer of hypotheses, not as the source of truth.

### How do I evaluate a generated microservices split?

Score coupling, cohesion, data ownership, deployability, and failure isolation on the same rubric for every candidate. If two services share a write path to one table, the cut is not a service—it is a distributed monolith. Run the rubric before you generate Dockerfiles.

### What is the biggest risk of LLM-driven refactoring?

Fluent but untrue coupling maps. Models invent module names, skip hidden shared state, and under-count cross-cutting concerns like auth and jobs. Always overlay static deps and production traces on the LLM output before you move a package.

### Should startups in Pakistan migrate to microservices with AI tools?

Only when deploy cadence, team boundaries, or scaling axes actually hurt. LLM-assisted recovery is cheapest as a map of the current system. A small team in Lahore shipping one product often needs a modular monolith more than a mesh.

### What pipeline should I run first?

Extract a dependency graph, recover bounded contexts with an LLM constrained by that graph, score cuts with an explicit fitness function, then generate a strangler-fig plan. Do not let the model rewrite production until the plan survives review and a canary.
