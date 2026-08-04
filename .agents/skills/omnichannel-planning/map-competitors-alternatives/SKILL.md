---
name: map-competitors-alternatives
description: Map the real competitors, substitutes, manual workarounds, free options, and do-nothing choice around an Atumerce customer decision. Use after evidence-led audience research and before canonical strategy or campaign positioning when Commercial needs an evidence-backed choice-gap, trust, proof, or response doctrine; do not create unverified battlecards or attack copy.
---

# Map Competitors And Alternatives

## Role

Operate as a leaf of **Omnichannel Planning**, Team01's single Planning mega-skill under ADR-0017. Convert approved evidence into a customer-choice map. Do not run primary research, invent product truth, write competitor attack copy, or authorize publication.

## Required Inputs

Require:

- the decision, job-to-be-done, primary persona, journey stage, geography, and language;
- `research_brief` and evidence-pack IDs with dates, confidence, contradictions, and expiry;
- verified Atumerce product boundaries and approved claim IDs;
- one named owner, review deadline, and the planning decision this map must support.

Mark an item `unknown` when evidence is missing. A search result, vendor claim, review count, or price snapshot is a lead until its provenance, date, scope, and limitation are recorded.

## Comparison Set

Build the smallest set that represents what the customer can actually choose:

1. direct competitors serving the same job;
2. adjacent tools or services solving part of the job;
3. generic MQL5 products, templates, scripts, or infrastructure when relevant;
4. manual workflows and self-built solutions;
5. free education, communities, or public information;
6. deferral, inertia, or doing nothing.

Do not force every category into every plan. Record why each included alternative is decision-relevant.

## Workflow

1. Freeze state A, target state B, decision moment, causal hypothesis, counter-hypothesis, and expiry.
2. Normalize evidence by comparable unit, market, date, currency, product tier, and customer job. Keep observation separate from interpretation.
3. Create a comparison matrix with: alternative, category, customer job, target user, mechanism, proof offered, trust mechanism, price/effort/switching cost, strengths, weaknesses, limitations, evidence IDs, confidence, and unknowns.
4. Audit message and content behaviour: primary promise, proof pattern, CTA, objection handling, discovery surfaces, and trust risks. Treat competitor wording as evidence about positioning, not permission to copy it.
5. Identify the **customer choice gap**: underserved decision criteria, unresolved anxiety, missing proof, over-served noise, and why the customer may still choose an alternative or do nothing.
6. Derive an Atumerce response doctrine with three fields only: `match` where parity is necessary, `differentiate` where verified Product Truth supports it, and `decline` where Brand DNA or evidence does not support a claim.
7. State the implication for the canonical narrative, campaign plan, on-page contract, measurement contract, and next falsification test. Route unresolved product claims to Product Vault and legal/privacy questions to Ledger.

## Output Contract

Return a versioned `competitor_alternative_map` with:

- scope, state A/B, persona, decision moment, owner, review date, and expiry;
- comparison set and evidence-linked matrix;
- customer choice gap and counter-hypotheses;
- `match / differentiate / decline` response doctrine;
- risks, unknowns, contradictions, and facts requiring revalidation;
- implications for message, proof, channel, CTA, and measurement;
- verdict: `proceed`, `reframe`, `escalate`, or `reject`.

Preserve evidence IDs in downstream handoffs. Do not reduce the output to a feature checklist or a winner/loser ranking.

## Hard Boundaries

- Compare verified capabilities and observed claims; never imply access to a competitor's private data, intent, or performance.
- No defamation, fabricated weaknesses, cherry-picked pricing, dark-pattern recommendations, or unsupported superiority claims.
- Protect Atumerce's No-Guru position: premium trading infrastructure, not signals, managed trading, guaranteed outcomes, or urgency theatre.
- This skill plans positioning. Deep Copywriting owns final copy; Paid Media owns governed advertising execution.
