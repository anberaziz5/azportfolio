---
title: "Testing and Formal Verification of Non-Deterministic Machine Learning Components"
slug: "testing-and-formal-verification-of-nondeterministic-ml-components"
date: "2026-09-22"
description: "Use metamorphic testing, mutation testing, and bounded verification to argue safety, robustness, and fairness when ML outputs are not unique."
keywords:
  - metamorphic testing
  - ML verification
  - mutation testing
  - AI safety
  - software testing
  - fairness
  - Lahore
  - Pakistan
author: "Anber Aziz"
cover: "/blog/testing-and-formal-verification-of-nondeterministic-ml-components.webp"
coverAlt: "Orange accent cover for testing and verifying non-deterministic machine learning systems"
faq:
  - question: "Why do standard unit tests fail for deep learning models?"
    answer: "They assume a single correct output for a given input. Models are stochastic, versioned by data, and judged on distributions. A test that asserts exact equality either flakes or overfits a snapshot. You need oracles that survive legitimate variation."
  - question: "What is metamorphic testing for ML?"
    answer: "You specify relations that must hold when the input changes in a known way. Rotate an image and the class should stay the same. Swap two irrelevant features and the ranking should not flip. The relation is the oracle when the true label is expensive or undefined."
  - question: "Can we formally verify a neural network in production?"
    answer: "You can verify properties of a frozen, bounded model: local robustness in an L-infinity ball, absence of a forbidden output on a finite input domain, or monotonicity of a score. You cannot verify 'the model is always fair' over an open world. Scope the property or you will get a false sense of safety."
  - question: "How do I test fairness without a huge labeled set?"
    answer: "Define protected attributes and a metric (demographic parity, equalized odds, or calibration by group) on a holdout that matches production mix. Pair it with metamorphic checks that perturb sensitive attributes only where legally and ethically allowed. Fairness is a test suite plus a data contract, not a slogan."
  - question: "What should safety-critical teams in Pakistan adopt first?"
    answer: "Deterministic seeds in CI, a metamorphic suite on the actual serving graph, mutation testing of preprocessing, and a rollback gate on metric regressions. Formal tools come after the property is written in one sentence. Startups in Lahore shipping health or lending features should not skip the oracle work."
---

Software testing grew up on deterministic functions. Given `f` and `x`, there is a `y` you can hash. Deployed deep learning breaks that contract. The same image can yield different labels across dropout, batch-norm in train mode, or a quantized graph. Two “correct” answers can exist. The label itself may be a distribution. If your test suite still asserts `predict(x) == 3`, you are either testing a stub or you are lying to CI.

The research problem is not “how do we make ML deterministic.” Some systems should be. The problem is: **how do we specify oracles, mutations, and proofs that remain meaningful when outputs are allowed to move?**

## Who this is for

I wrote this for ML engineers shipping models into products where a silent regression is a safety or fairness incident, for QA leads who were told “just raise the accuracy threshold,” and for software engineers who own the serving path. Teams in Lahore, across Pakistan, and remote-from-Pakistan building for healthtech, fintech, or public-sector clients will be asked for evidence, not vibes. US and EU buyers already treat model evaluation as part of vendor due diligence.

If you are a founder, you need a story that survives an audit. If you are a researcher, you need properties that can be falsified. If you are an SRE, you need a gate that blocks a model the way a test blocks a binary.

## What is the oracle problem in ML?

The oracle problem is older than neural nets: you cannot always know the correct output. ML makes it the default. Metamorphic testing (Chen and others; applied to ML by Xie, Segura, and follow-on work) replaces “this output is right” with “this transformation of the input should transform the output in a known way.”

Examples that I actually put in suites:

- **Vision:** small rotations, JPEG recompression, or brightness shifts should not change a coarse class if the model claims invariance.
- **Ranking:** swapping two documents that the product treats as equivalent should not invert their order beyond a bound.
- **RAG:** paraphrasing a question without changing entities should retrieve overlapping citations.
- **Speech:** speed perturbation within a documented range should not flip a command class.

```python
def metamorphic_invariance(model, x, transform, max_drift=0.05):
    y0 = model.predict_proba(x)
    y1 = model.predict_proba(transform(x))
    assert total_variation(y0, y1) <= max_drift
```

That test can fail honestly. An equality test on `argmax` will flake on the decision boundary and teach the team to skip it.

## How does mutation testing apply to ML pipelines?

Mutation testing asks whether your tests notice a fault you injected. For ML, mutate the **pipeline**, not only the weights.

High-value mutants:

- Disable a required feature or swap a column.
- Skip a normalization step.
- Train-mode dropout left on at serve.
- Label shuffle in 1% of the fine-tune set.
- Off-by-one in windowing for time series.

If your eval still passes, the eval is theater. I have seen accuracy stay flat while a preprocessing mutant inverted a protected attribute. Accuracy was the wrong oracle.

Score the suite by **mutation score on pipeline mutants**, not by how many pytest files you have.

## What can formal verification actually say?

Neural network verification (Reluplex, α,β-CROWN, and related tools) can prove local robustness: within an ε-ball of x, the class does not change. It can sometimes prove that a score is monotonic in a feature, or that an output never enters a forbidden region for a quantized network.

It cannot prove:

- The training data was representative of Lahore traffic next year.
- The model is fair for a group that is 0.4% of the set.
- The LLM will not leak a prompt.

So you write a **property**, bound the domain, freeze the artifact (ONNX/TFLite with a hash), and verify that artifact. When you retrain, you re-verify. Treat verification like a type check on a compiled model, not like a moral certificate.

```text
Property R1: For all x in the calibrated set S,
  if ||x' - x||_inf <= 1/255, then class(x') = class(x).
Artifact: model.onnx@sha256:…
Tool: bound-propagation, timeout 30m, fail closed.
```

Fail closed. A timeout is not a pass.

## How do you test fairness as an engineering property?

Fairness is a family of metrics. Pick one that matches the decision:

- **Demographic parity** if the product forbids using group membership as a proxy for allocation.
- **Equalized odds** if you have ground-truth outcomes and care about error rates by group.
- **Calibration by group** if the score is shown to a human.

Then freeze a **data contract**: how groups are labeled, how missingness is handled, minimum counts before a metric is reported. A fairness dashboard that silently drops small groups is how disparities hide.

Metamorphic fairness checks are delicate. You do not casually flip a protected attribute in a medical record and call it science. Where perturbation is valid (for example, names in a resume classifier under a documented protocol), it belongs in CI. Where it is not, use holdout slices and human review.

## What does a production gate look like?

1. Seeded inference in CI (or a documented stochastic budget: N samples, median metric).
2. Metamorphic pack on serving preprocessing + model.
3. Pipeline mutation score threshold.
4. Slice metrics for robustness and fairness vs last production hash.
5. Optional: robustness certificates on a core set for the safety-critical path.

Teams in Pakistan often serve models from cheaper GPU regions. Quantization and batching change numerics. **The gate must run on the artifact you serve**, not on a research checkpoint in float32.

## How do you keep the suite from rotting?

ML tests rot when the product changes the input space and nobody updates relations.

- Own the pack like product code. A named reviewer for oracle changes.
- Version metamorphic relations with the model card.
- When a relation is retired, record why. Silent deletion is how you lose the safety case.
- Separate **flake budget** from **property failures**. A stochastic check that fails 1/20 times needs more samples or a looser bound, not a skip.

For a PhD-style evaluation, report the number of mutants caught, the number of relations that fired on real regressions, and time-to-run the gate. A verification tool that cannot finish before the deploy window is not a control.

## What should you ship this quarter?

Write five metamorphic relations for the actual product. Add two pipeline mutants that must be caught. Hash the serving graph. Block deploys on slice regressions. If you have a safety-critical output, pick one local robustness property and try to prove it on a frozen model. That sequence is software engineering. Accuracy-only eval is not.

I build and review production AI systems from Lahore. If your model is in the hot path and the only test is a notebook, [services](https://www.anber.me/services) is how I work with teams, and [contact](https://www.anber.me/contact) is the shortest path to a verification plan.

## FAQ

### Why do standard unit tests fail for deep learning models?

They assume a single correct output for a given input. Models are stochastic, versioned by data, and judged on distributions. A test that asserts exact equality either flakes or overfits a snapshot. You need oracles that survive legitimate variation.

### What is metamorphic testing for ML?

You specify relations that must hold when the input changes in a known way. Rotate an image and the class should stay the same. Swap two irrelevant features and the ranking should not flip. The relation is the oracle when the true label is expensive or undefined.

### Can we formally verify a neural network in production?

You can verify properties of a frozen, bounded model: local robustness in an L-infinity ball, absence of a forbidden output on a finite input domain, or monotonicity of a score. You cannot verify "the model is always fair" over an open world. Scope the property or you will get a false sense of safety.

### How do I test fairness without a huge labeled set?

Define protected attributes and a metric (demographic parity, equalized odds, or calibration by group) on a holdout that matches production mix. Pair it with metamorphic checks that perturb sensitive attributes only where legally and ethically allowed. Fairness is a test suite plus a data contract, not a slogan.

### What should safety-critical teams in Pakistan adopt first?

Deterministic seeds in CI, a metamorphic suite on the actual serving graph, mutation testing of preprocessing, and a rollback gate on metric regressions. Formal tools come after the property is written in one sentence. Startups in Lahore shipping health or lending features should not skip the oracle work.
