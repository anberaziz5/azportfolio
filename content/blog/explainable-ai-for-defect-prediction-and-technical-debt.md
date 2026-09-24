---
title: "Explainable AI for Software Defect Prediction and Technical Debt Management"
slug: "explainable-ai-for-defect-prediction-and-technical-debt"
date: "2026-09-21"
description: "Move defect prediction past black-box scores. Give developers causal, code-level explanations for smells and debt so they can choose what to fix."
keywords:
  - explainable AI
  - defect prediction
  - technical debt
  - code smells
  - software maintainability
  - XAI
  - Lahore
  - Pakistan
author: "Anber Aziz"
cover: "/blog/explainable-ai-for-defect-prediction-and-technical-debt.webp"
coverAlt: "Orange accent cover for explainable AI in defect prediction and technical debt"
faq:
  - question: "Why is black-box bug prediction not enough for developers?"
    answer: "A probability without a cause does not change a backlog. Developers need to know which files, smells, and change patterns drove the score, and whether those drivers are causal enough to justify a refactor this sprint. Unexplained rankings get ignored."
  - question: "What is the difference between correlation and a useful explanation?"
    answer: "File size and churn correlate with bugs in almost every dataset. Telling a team 'this file is large' is not a decision. A useful explanation names a maintainability mechanism—tangled responsibilities, missing tests, unstable API—and points at evidence in the diff."
  - question: "Can SHAP values explain technical debt?"
    answer: "SHAP can attribute a model score to features. It cannot tell you the debt is worth paying. Pair attributions with static analysis findings and a cost-of-delay estimate. Otherwise you will 'explain' a random forest that mostly learned 'this module is old.'"
  - question: "How should a team in Lahore use defect prediction?"
    answer: "Use it to prioritize review and tests on the next change, not to rank people. Keep the model on process and code metrics, publish explanations in the PR, and never use the score in performance reviews. Small teams need trust more than a leaderboard."
  - question: "What evaluation should XAI-for-SE papers report?"
    answer: "Developer action rate, time-to-understand, false-cause rate versus expert labels, and whether predicted hotspots actually fail in the next window. Fidelity of the explainer to the model is necessary but not sufficient."
---

Defect prediction is a mature software-engineering research line: given history, guess where the next faults will land. Technical debt management is a product problem: given limited time, choose which smells to pay down. Black-box classifiers can rank files. They rarely change what a developer does on a Tuesday, because a score of 0.81 does not say **why** or **what to do**.

Explainable AI for this setting is not a saliency overlay on a neural net for its own sake. It is a decision-support system: an explanation that is faithful to the model, causally plausible in the codebase, and cheap enough to read in a pull request.

## Who this is for

I wrote this for engineering managers who bought a “quality AI” dashboard that nobody opens, for researchers who need developer-centered evaluation, and for staff engineers who already know which module is on fire and want the tool to stop lying about it. Teams in Lahore, across Pakistan, and remote-from-Pakistan often inherit outsourced modules with uneven tests. You cannot pay down all debt. You need a reason to pick.

If you are a founder, unexplained defect scores will not survive the first argument with a senior engineer. If you are a data scientist, Git logs are not i.i.d. images. If you are a developer, you should demand an explanation that cites your code, not a feature named `CountVec__xyz`.

## What should an explanation contain?

Four layers, or it is incomplete:

1. **Prediction.** File, commit, or change-set risk in a calibrated probability or rank.
2. **Attribution.** Which features moved the score (SHAP, LIME, attention on tokens—pick one and measure fidelity).
3. **Mechanism.** A software-engineering story: God class, shotgun surgery, missing characterization tests, tangled feature flags.
4. **Action.** A bounded next step: split this type, add tests on this branch, freeze this API.

```text
Hotspot: payments/ledger.py (p=0.64 next-30d defect)
Drivers: 12-month churn, 4 owners, cyclomatic hot spots in post()
Mechanism: shotgun surgery — ledger changes co-occur with tax and FX
Action: characterization tests on post() before the FX refactor
Not a driver: file length alone (controlled for churn)
```

The last line matters. Developers have been told “your file is too long” since 1999. An XAI system that rediscovers LOC has failed the mechanism layer.

## How do you avoid fake causality?

Most public defect datasets leak process metrics that are proxies for “this code is important and old.” Models learn that. Explanations then say “high churn,” which is circular: we change it because it is important, it is predicted buggy because we change it.

Practices that keep me honest:

- **Confounder control.** Report models with and without size/churn. If the interesting smells vanish, you do not have a smell model.
- **Time-respecting splits.** Train on past, test on future. Random file splits leak.
- **Counterfactuals that compile.** “If this method were split, score would drop” is only useful if the split is a real refactor, not a feature toggle in a spreadsheet.
- **Human labels of causes**, not only of bugs. A bug can have a cause the model never saw (an infra timeout).

Causal discovery on software metrics is still research. In production I treat explanations as **hypotheses** that static analysis and tests must corroborate.

## Where do code smells meet the model?

Static analyzers already name smells. The XAI job is to say which smells, in this repo, actually associate with later defects **after** you control for size. That is a different ranking than “Sonar opened 4,000 issues.”

I like a two-stage system:

- Stage A: cheap static and process features for ranking changes at review time.
- Stage B: on the top-k, generate a narrative from the actual diff plus smell detectors, constrained by a template so the LLM cannot invent a CVE.

Do not let a generative model be the only explainer. It will produce a beautiful cause that is not the model’s cause. Hybrid: symbolic attribution first, language model second, for readability.

## How should this show up in the workflow?

If it is a weekly PDF, it is dead. Put risk and the mechanism in the PR, next to coverage.

```ts
type DebtNote = {
  path: string;
  risk: number;
  smells: string[];
  why: string;
  suggestedTest: string;
  ignoreUntil?: string;
};
```

Allow `ignoreUntil` with a reason. Technical debt without a deferral mechanism trains people to mute the bot. Teams in Pakistan working with US product managers need that deferral to be visible: the debt is acknowledged, not forgotten.

Never attach defect scores to individuals. That is how you get gamed metrics and quieter incident reports.

## What should researchers measure?

- **Fidelity:** does the explanation match the model’s true sensitivity?
- **Necessity/sufficiency:** do counterfactual edits change the prediction as claimed?
- **Usefulness:** do developers accept, override, or act? Track action, not thumbs-up.
- **Downstream quality:** defects in explained hotspots vs control modules in the next release window.
- **Time cost:** seconds to understand. A correct 800-word essay loses to a three-line mechanism.

Paper-only SHAP plots on NASA MDP datasets will not convince a Lahore product team. Use at least one live repo and a developer study, even a small one.

## What does a causal-enough workflow look like in a sprint?

Week 1: freeze a time-split dataset. Train a simple model (logistic or gradient boosting) with and without size/churn. If smell features die, stop and collect better static facts.

Week 2: for the top 20 files, have two engineers independently write a one-sentence mechanism. Measure agreement with the explainer. Disagreement is a dataset, not a failure to automate.

Week 3: put notes on PRs that touch those files. Count: extra tests added, extra bugs found in review, mutes of the bot.

That is closer to a PhD evaluation than another AUC on Promise datasets from 2007. Those datasets taught the field that size predicts defects. Production teams already knew.

## What should you not automate?

Do not auto-open Jira tickets for every smell the model likes. Ticket floods destroy trust. Do not auto-assign debt to the last committer; that is a proximity heuristic, not ownership. Do not hide the model. If the score cannot be explained in the PR, it should not be in the PR.

## What should you ship this quarter?

Calibrate a simple, time-split model on your own history. Publish drivers that survive a size/churn control. Map those drivers to smells you can point at in the editor. Put three-line notes on PRs for the top 10% of changes. Measure whether review finds more real defects, not whether the ROC looks pretty.

I work on production AI and maintainable codebases from Lahore. If your quality dashboard is a black box, [services](https://www.anber.me/services) is how I work with teams, and [contact](https://www.anber.me/contact) is the shortest path to a design that developers will not mute.

## FAQ

### Why is black-box bug prediction not enough for developers?

A probability without a cause does not change a backlog. Developers need to know which files, smells, and change patterns drove the score, and whether those drivers are causal enough to justify a refactor this sprint. Unexplained rankings get ignored.

### What is the difference between correlation and a useful explanation?

File size and churn correlate with bugs in almost every dataset. Telling a team "this file is large" is not a decision. A useful explanation names a maintainability mechanism—tangled responsibilities, missing tests, unstable API—and points at evidence in the diff.

### Can SHAP values explain technical debt?

SHAP can attribute a model score to features. It cannot tell you the debt is worth paying. Pair attributions with static analysis findings and a cost-of-delay estimate. Otherwise you will "explain" a random forest that mostly learned "this module is old."

### How should a team in Lahore use defect prediction?

Use it to prioritize review and tests on the next change, not to rank people. Keep the model on process and code metrics, publish explanations in the PR, and never use the score in performance reviews. Small teams need trust more than a leaderboard.

### What evaluation should XAI-for-SE papers report?

Developer action rate, time-to-understand, false-cause rate versus expert labels, and whether predicted hotspots actually fail in the next window. Fidelity of the explainer to the model is necessary but not sufficient.
