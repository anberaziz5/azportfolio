---
title: "Automated Requirements Engineering: From Natural Language to Formal Specs"
slug: "automated-requirements-engineering-from-nl-to-formal-specs"
date: "2026-09-17"
description: "NLP pipelines that turn informal stakeholder language into verifiable specifications and tests—without pretending ambiguity disappeared."
keywords:
  - requirements engineering
  - NLP
  - formal specifications
  - automated testing
  - software specification
  - AI engineering
  - Lahore
  - Pakistan
author: "Anber Aziz"
cover: "/blog/automated-requirements-engineering-from-nl-to-formal-specs.webp"
coverAlt: "Orange accent cover for automated requirements engineering from natural language to specs"
faq:
  - question: "Can NLP turn stakeholder emails into a complete specification?"
    answer: "It can extract candidate shall-statements, entities, and conflicts, then emit a draft spec and tests. Completeness is a human sign-off. Ambiguity is a feature of stakeholders, not a bug the model is allowed to silently resolve."
  - question: "What formalisms are practical for generated specs?"
    answer: "Start with structured shalls, Gherkin, and design-by-contract pre/postconditions. Use TLA+, Alloy, or temporal logic only when the domain has concurrency or safety properties you will actually check. A formal artifact nobody runs is documentation with extra symbols."
  - question: "How do you keep generated tests honest?"
    answer: "Trace each test to a requirement ID. Generate both positive and forbidden cases. Run mutation on the spec-to-test compiler so a tautology suite cannot pass. If the requirement was ambiguous, the test must fail closed and ask."
  - question: "Where do LLMs fail in requirements work?"
    answer: "They invent acceptance criteria, drop non-functional constraints, and merge two stakeholders' opposite rules into a polite average. Force citations back to spans in the source documents and list open questions instead of guessing."
  - question: "How should product teams in Pakistan use this?"
    answer: "Use it to structure bilingual and multi-timezone requirement dumps into a reviewable spec faster. Keep legal, payments, and safety clauses in a human loop. A Lahore team serving US buyers still needs a person to own the shall."
---

Requirements engineering is the discipline of turning messy human intent into something a system can be wrong against. Natural language is how stakeholders speak. Formal specifications and tests are how engineers refuse to guess. Automated pipelines sit in the middle: parse, structure, detect conflict, emit artifacts, and **stop** when the source does not decide.

I have seen demos where a model writes a beautiful SRS from a paragraph. Then the product owner says “that is not what I meant,” which is the entire field. The research goal is not zero humans. It is fewer silent inventions.

## Who this is for

I wrote this for product-minded engineers drowning in Slack requirements, for BA/QA pairs who already write Gherkin by hand, and for researchers stitching NLP to verification. Teams in Lahore, across Pakistan, and remote-from-Pakistan often receive intent in English from US clients and operational constraints in local context (payments, language, latency). A pipeline that only speaks Silicon Valley English will “complete” the wrong system.

If you are a founder, a generated spec is a conversation starter. If you are a tech lead, traceability is the feature. If you are a tester, tests without requirement IDs are folklore.

## What does a serious pipeline look like?

1. **Ingest.** Docs, tickets, call transcripts, with provenance.
2. **Segment and normalize.** Detect requirements vs narrative vs example.
3. **Extract.** Actors, objects, modalities (shall/should/may), conditions, NFRs.
4. **Reconcile.** Conflict and duplication detection across sources.
5. **Formalize.** Controlled language or contracts, not free prose.
6. **Generate tests.** Acceptance and negative cases with traces.
7. **Review gate.** Human owns unresolved items. CI fails if `openQuestions` is non-empty for a release-blocking epic.

```ts
type Shall = {
  id: string;
  text: string;
  sourceSpans: { doc: string; start: number; end: number }[];
  modality: "shall" | "should" | "may";
  nfr?: "latency" | "security" | "privacy" | "i18n";
  conflictsWith: string[];
  openQuestions: string[];
};
```

If `sourceSpans` is empty, the model made it up. Drop it or mark it as invention.

## How do you handle ambiguity on purpose?

Ambiguity is data. Classic RE techniques (inspection, quality attributes, goal models) still apply. NLP should **label** underspecification:

- Missing actor (“the system will notify” — notify whom, on what channel?)
- Unbounded quantifiers (“fast”, “secure”, “all users”)
- Conflicting modalities (legal shall vs growth should)
- Implicit platform assumptions (always-online, US-only time zones)

```gherkin
Feature: Transfer notification
  # REQ-104 from ticket 8821 span "notify the sender"
  Scenario: Sender is notified when transfer completes
    Given a PKR transfer has cleared
    When the ledger marks the transfer complete
    Then the sender receives an SMS within 30 seconds
  # OPEN: WhatsApp vs SMS not decided in source
```

The OPEN comment is the product. Generating a WhatsApp step because the model likes WhatsApp is a defect.

## Which formal targets are worth it?

**Tier 0:** Numbered shalls in a template, with NFRs as measurable statements (`p95 < 300ms from Lahore to api.example.com`).

**Tier 1:** Gherkin or Given/When/Then bound to APIs.

**Tier 2:** Pre/postconditions and invariants in code (`requires`, `ensures`) generated as tests.

**Tier 3:** Model checkers for protocols (idempotent payments, at-least-once delivery). Only if someone will run the checker in CI.

Jumping to temporal logic because the paper looks stronger is how you get unmaintained LaTeX. Pick the weakest formalism that can fail a build.

## How do tests get generated without tautologies?

A test suite that only restates the happy path will pass a wrong system.

- Emit **forbidden** behaviors from “must not” and from inferred hazards (double charge, leak of PII).
- Bind oracles to measurable outputs, not to “the user is happy.”
- Mutation: flip a shall to its negation and require at least one test to fail.
- Keep a **glossary** so “customer” and “user” are not two actors by accident.

For bilingual inputs, do not translate away legal meaning. Extract in the source language, then align. Teams in Pakistan dealing with Urdu or mixed tickets should store both spans.

## Where do models need guardrails?

- **Prompt injection** in customer-supplied requirement docs.
- **Scope creep** via helpful extra features.
- **Non-functional amnesia.** Models love features and forget rate limits.
- **Stakeholder mixing.** Average of two opposite rules is not a spec.

Guardrail: every generated clause cites a span or is listed under `inventions[]` and cannot ship.

## How do you evaluate an RE pipeline like software?

If this is a research program, leaderboard BLEU against an SRS is the wrong metric. Stakeholders do not speak in BLEU.

Measure:

- **Span precision.** Fraction of generated shalls whose `sourceSpans` a human accepts as supporting text.
- **Invention rate.** Clauses with empty spans. This should fall as you tighten the schema, not as you write longer prompts.
- **Conflict recall.** Seed two contradictory tickets. The pipeline must surface a `conflictsWith` edge, not a blended shall.
- **NFR survival.** Inject “p95 under 400ms from Lahore” and “logs must not contain PAN.” Both must appear as measurable statements or as open questions—never disappear.
- **Test usefulness.** Mutation score of the generated suite against a deliberately wrong implementation.

A Lahore vendor team can use the same pack as an acceptance harness before a US client workshop. Show the open-question list first. That is how you prove the bot is not completing their product in secret.

## What does a worked example look like?

Stakeholder message: “Users should get notified quickly when money moves, and it has to be secure, also some people are on WhatsApp.”

Bad automation emits three shalls, picks WhatsApp, and invents OTP rules.

Good automation emits:

- `SHALL` notify the **sender** (cited) on transfer complete.
- `OPEN` channel: SMS vs WhatsApp vs both.
- `OPEN` bound for “quickly” — propose 30s as a question, not as a fact.
- `SHALL` not log full account numbers (only if a security source exists; otherwise `OPEN` with a pointer to the missing policy).
- Tests paused on OPEN items.

That draft is shorter and more honest. Honesty is the requirement.

## What should you ship this quarter?

Take one epic’s tickets. Extract shalls with citations. List conflicts and open questions. Generate Gherkin for the decided subset only. Wire those tests into CI. Measure how many review comments are “the bot invented this” versus “this is right.” Iterate the schema, not the prose length.

I work with production AI and product engineering from Lahore. If your requirements live in chat and your tests live in hope, [services](https://www.anber.me/services) is how I work with teams, and [contact](https://www.anber.me/contact) is the shortest path to a pipeline with a real gate.

## FAQ

### Can NLP turn stakeholder emails into a complete specification?

It can extract candidate shall-statements, entities, and conflicts, then emit a draft spec and tests. Completeness is a human sign-off. Ambiguity is a feature of stakeholders, not a bug the model is allowed to silently resolve.

### What formalisms are practical for generated specs?

Start with structured shalls, Gherkin, and design-by-contract pre/postconditions. Use TLA+, Alloy, or temporal logic only when the domain has concurrency or safety properties you will actually check. A formal artifact nobody runs is documentation with extra symbols.

### How do you keep generated tests honest?

Trace each test to a requirement ID. Generate both positive and forbidden cases. Run mutation on the spec-to-test compiler so a tautology suite cannot pass. If the requirement was ambiguous, the test must fail closed and ask.

### Where do LLMs fail in requirements work?

They invent acceptance criteria, drop non-functional constraints, and merge two stakeholders' opposite rules into a polite average. Force citations back to spans in the source documents and list open questions instead of guessing.

### How should product teams in Pakistan use this?

Use it to structure bilingual and multi-timezone requirement dumps into a reviewable spec faster. Keep legal, payments, and safety clauses in a human loop. A Lahore team serving US buyers still needs a person to own the shall.
