---
title: "Fine-Tuning vs Prompting vs RAG: A Practical Decision Guide for ML Engineers"
slug: "fine-tuning-vs-prompting-vs-rag"
date: "2026-06-07"
description: "A practical guide to when to fine-tune, prompt, or build a RAG pipeline, with architecture diagrams, code, and a decision framework."
keywords:
  - RAG
  - Fine-Tuning
  - Prompt Engineering
  - Machine Learning
  - LLM
author: "Anber Aziz"
cover: "/blog/fine-tuning-vs-prompting-vs-rag.webp"
coverAlt: "Cover for Fine-Tuning vs Prompting vs RAG"
heroComponent: "FineTuningVsPromptingVsRAGDiagram"
---

Every few weeks, someone on a team asks the same question in a different costume: "Should we just fine-tune it?" Usually the real problem is a handful of bad prompts or a missing retrieval layer, and fine-tuning is the most expensive way to find that out.

This decision matters more than most teams admit. Pick prompting when you needed RAG, and you'll spend months patching hallucinations with longer and longer system prompts. Pick fine-tuning when you needed RAG, and you'll burn GPU hours retraining a model every time your knowledge base changes. Pick RAG when a fine-tuned model would have done the job for a fraction of the latency, and you've added a retrieval system, a vector database, and an entire new failure surface to a problem that didn't need one.

The three approaches solve genuinely different problems:

- **Prompting** steers a model's existing behavior at inference time, using nothing but the input you send it.
- **RAG** gives a model access to information it doesn't have, by retrieving relevant context and injecting it before generation.
- **Fine-tuning** changes the model itself, adjusting its weights so a behavior, style, or task becomes baked in rather than instructed.

None of them is "better." Each one optimizes for a different constraint: cost, latency, accuracy, or how often your data changes.

## How prompting actually works

Prompting works because large language models are trained on enough data that a huge range of tasks already live somewhere inside their weights. You're not teaching the model anything new. You're activating a capability that already exists by giving it instructions, examples, and context inside the input window, all at inference time, with zero changes to the underlying weights.

This is why it's called in-context learning. The model conditions its output on everything in the context window: your system prompt, few-shot examples, the user's query, and any intermediate reasoning you've asked for. Nothing persists once the call ends.

### When it works well

- You're prototyping and need to validate an idea before investing in infrastructure.
- The task is general enough that the base model has likely seen similar patterns during pretraining.
- You can fully describe the task and edge cases in a reasonable number of tokens.
- Requirements change often, and retraining a model every time would be unworkable.

### Limitations

- Context window ceiling. Larger prompts mean higher latency and higher per-call cost.
- Brittleness. Small rewordings of the prompt can shift outputs in ways that are hard to test.
- No persistence. Every piece of context has to be resent every time.
- No real knowledge injection. If the information isn't in the model or the prompt, you'll get a fluent, confident, wrong answer.

### Example: a prompting call

```python
import anthropic

client = anthropic.Anthropic()
system_prompt = """You are a support ticket classifier for a SaaS company.
Classify each ticket into exactly one category: Billing, Bug, Feature Request, or Account Access.
Respond with only the category name, nothing else."""

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=20,
    system=system_prompt,
    messages=[{
        "role": "user",
        "content": "I was charged twice for my subscription this month and need a refund."
    }]
)
print(response.content[0].text)  # Billing
```

> Quick takeaway: prompting answers "can I steer the model with instructions?" It does not answer "does the model actually know this?" That second question is what RAG and fine-tuning exist for.

## RAG architecture overview

RAG solves the knowledge problem, not the behavior problem. Instead of hoping the model already knows something, you retrieve the relevant information from an external source and hand it to the model right before generation.

A typical RAG pipeline looks like this:

```text
User Query
  -> Embedding Model
  -> Vector Database Search
  -> Top-K Retrieved Chunks
  -> Optional Reranker
  -> Context + Original Query
  -> LLM
  -> Response
```

### Core components

- **Chunking strategy:** Fixed-size, recursive/semantic, or sliding window with overlap.
- **Embeddings:** Domain mismatch here silently degrades every downstream retrieval.
- **Vector databases:** Pinecone, Weaviate, Qdrant, and pgvector make different infra tradeoffs.
- **Retrieval and reranking:** Hybrid search plus a cross-encoder reranker often beats raw similarity.

### A simplified RAG pipeline

```python
def rag_query(user_query: str) -> str:
    query_vector = embedding_model.encode(user_query)
    candidates = vector_db.search(query_vector, top_k=20)
    reranked = reranker.rank(user_query, candidates)
    top_chunks = reranked[:5]
    context = "\n\n".join(chunk.text for chunk in top_chunks)
    prompt = f"""Answer the question using only the context below.
If the answer isn't in the context, say you don't know.

Context:
{context}

Question: {user_query}"""
    return llm.generate(prompt)
```

### Failure cases

- Chunking destroys context, especially tables and multi-step procedures.
- Confident hallucination on bad retrieval. The failure looks like a model bug, but the root cause is upstream.
- Stale indexes that no longer match the source of truth.
- Context dilution from retrieving too many weakly related chunks.

## Fine-tuning: what actually changes

Fine-tuning updates the model's weights based on a curated dataset, so a behavior becomes part of the model rather than something you instruct every time. This is the right tool when the problem is **how the model behaves**, not **what it knows**.

Full fine-tuning updates every parameter. LoRA freezes the base model and trains small adapter matrices. QLoRA quantizes the frozen base model to 4-bit first, which is what makes large-model fine-tuning feasible on a single high-memory GPU.

### When it's necessary versus overkill

Necessary when you need consistent style or format at scale, domain-specific reasoning patterns, or latency-critical narrow tasks with enough labeled data.

Overkill when the problem is a knowledge gap, a handful of few-shot examples would do, data changes frequently, or you still don't have an evaluation pipeline.

## Comparison

| Method | Cost | Latency | Accuracy | Best use case |
| --- | --- | --- | --- | --- |
| Prompting | Low | Low to medium | Medium, prompt-dependent | Prototyping and general tasks |
| RAG | Medium | Medium to high | High if retrieval is good | Knowledge that changes often |
| Fine-tuning | High upfront | Low | High for narrow tasks | Style, format, latency-critical work |

## Decision framework

- If you need information that changes often, use **RAG**, not fine-tuning.
- If you need consistent tone or output format at scale, **fine-tune**.
- If you're prototyping, start with **prompting**.
- If latency is critical and the task is narrow and stable, **fine-tune**.
- If hallucination on private documents is the main problem, use **RAG**.
- If you need both grounding and tightly controlled behavior, combine RAG and fine-tuning.

## Common mistakes

- Using RAG as a search-engine substitute.
- Fine-tuning to teach facts that belong in a document store.
- Chunking on a fixed token count with no validation.
- Shipping without an evaluation pipeline.

If you're building or scaling production AI systems and want a second pair of eyes on the architecture, you can check out my work and projects here: [anber.me](https://www.anber.me).
