---
name: forge-content-campaign-plan
description: "Turn one approved Atumerce founder-source route or canonical asset into an evidence-linked campaign system: SWOT and constraints, master plan, campaign content guideline, on-page contract, channel matrix, calendar brief, readiness decision, and specialist handoffs. Use when Commercial needs governed campaign or workbook planning without losing evidence, lineage, capacity, or review gates; do not write canonical copy, build the detailed calendar, or create image/video foundation briefs."
---

# Forge Content Campaign Plan

## Role

Operate inside **Omnichannel Planning**, Team01's single Planning mega-skill under ADR-0017. Synthesize approved inputs into one governed campaign record. Do not repeat audience research, invent founder meaning or Product Truth, write final copy, build the detailed calendar, grant budget, or authorize publishing.

## Inputs

Require:

- `insight_id`, `canonical_id`, canonical version, approved claim map, evidence-pack IDs, and product-truth boundary;
- primary persona, market/language, journey bottleneck, state A, target state B, objective, and decision moment;
- approved `competitor_alternative_map` when positioning, comparative proof, trust, or customer choice is material;
- campaign period, owner, review state, capacity and cash ceilings, allowed CTA, measurement contract, and stop condition.

Use `unknown` with an owner and resolution date instead of generic agency filler. Stop when missing evidence, Brand DNA, Product Truth/boundary, consent posture, or review ownership would make the plan unsafe.

## Workflow

1. **Freeze scope.** Record campaign class, state A/B, causal hypothesis and alternatives, primary persona, journey stage, objective, decision moment, owner, deadline, constraints, verification, and stop condition.
2. **Link Brand and Product Truth.** Carry forward Brand Orientation, founder-source lineage, claim IDs, verified capabilities, prohibited claims, and the explicit non-product boundary when the plan is brand-only or educational.
3. **Link customer choice.** Use `map-competitors-alternatives` when the decision requires competitor, substitute, manual, free, or do-nothing analysis. Consume its evidence and response doctrine; do not recreate the research inside this skill.
4. **Synthesize SWOT and constraints.** Include only evidence-linked strengths, weaknesses, opportunities, threats, dependencies, and limits that change the plan. Every item needs an implication, owner, action or acceptance decision, evidence ID, and review date.
5. **Forge the master plan** in this chain:

   `timeline -> objective -> decision event -> persona -> insight -> context clocks -> approach -> big idea/key message -> content direction -> tactic -> activity -> evidence -> metric -> review decision`

   Use only market, audience, and Atumerce product/release clocks that materially affect the decision.
6. **Define the campaign content guideline.** Record one knowledge pillar, campaign role, one message per asset, approved/forbidden claims, proof standard, tone, visual logic, accessibility, market/language rule, CTA boundary, channel adaptation rule, and escalation owner. This guides specialist execution; it is not final copy.
7. **Build the channel matrix.** Every row records channel role, audience moment, asset or handoff type, hook hypothesis, CTA, claim IDs, proof, owner, review state, dependency, and success/learning measure. Select channels by evidence and capacity, not fashion.
8. **Produce the on-page contract** when a canonical web surface is required: audience question, query family and intent, page purpose, competing-page decision, proposed URL, title hypothesis, required semantic coverage, internal-link context, content-side schema candidate, image/alt-text constraints, accessibility notes, and measurement plan. This is a Planning constraint, not final SEO copy or technical implementation.
9. **Issue typed specialist handoffs.** Deep Copywriting receives the authorized founder source, claims, content guideline, audience expectation, channel/on-page contract, CTA boundary, measurement hook, and review owner. Route Video E2E only after Deep Copywriting returns the relevant approved image or video foundation brief. Route paid work only with an approved audience, creative, budget, measurement, and stop contract.
10. **Issue the calendar brief.** After master-plan approval, route `campaign_id`, sequence, dependencies, clocks, capacity, review gates, measurement checkpoints, and recovery needs to `plan-campaign-calendar-capacity`.
11. **Run the release-readiness decision.** Route the eventual content package through `commercial-content-audit`; keep the plan in draft while sources, rights, consent, claims, reviewers, or dependencies remain unresolved.

## Workbook View Contract

When the deliverable is a workbook or Google Sheet, use eight compact linked views:

1. Overview
2. Target Audience
3. Market Research
4. SWOT And Constraints
5. Master Plan
6. Content Guideline
7. Calendar And Capacity
8. Sources And Measurement

Treat external agency workbooks, including the prior OLAY exercise, as topology and presentation references only. Replace their category facts, personas, competitors, benchmarks, claims, and recommendations with approved Atumerce evidence; never carry cosmetic-market assumptions into Atumerce.

The view names may be localized, but their responsibilities and lineage must remain. `Sources And Measurement` may be hidden from presentation view; never delete it. Use wrapped text, compact columns, bounded rows, visible owners/statuses, and `N/A — reason` instead of unexplained blank cells. Add a Vietnamese explanation in parentheses for English operating terms when the workbook is founder-facing.

## Readiness Gate

Score 0–2 for each dimension:

1. founder source or approved operational-source exception;
2. primary persona and decision moment;
3. evidence quality and expiry;
4. Brand DNA;
5. Product Truth or explicit non-product boundary;
6. privacy and consent posture;
7. customer-choice and channel fit;
8. qualified action and CTA;
9. measurable learning value;
10. operating and review capacity.

Do not scale below `14/20`. Any zero in evidence, Brand DNA, Product Truth/boundary, or privacy blocks release. A full calendar never compensates for a failed gate.

## Output Contract

Return:

- `campaign_id`, status, owner, phase, scope, expiry, state A/B, hypothesis, verification, and stop condition;
- campaign class, `insight_id`, `canonical_id`, source version, Product Truth boundary, evidence and claim IDs;
- competitor/alternative map reference when applicable, SWOT/constraint register, master plan, content guideline, channel matrix, and on-page contract;
- typed specialist handoffs, calendar brief, capacity assumptions, and review dependencies;
- readiness score, blockers, risks, verdict, next review date, and one consent-safe measurement question.

Do not return fabricated canonical text, an image/video foundation brief, or a detailed calendar from this skill.

## Hard Boundaries

- Preserve canonical claim IDs; do not turn education into signals, profit promises, or urgency theatre.
- Keep anonymous discovery metrics separate from identified CRM records unless an explicit purpose and consent decision permits a join.
- Phase 2 produces governed plans, briefs, and handoffs. Phase 3 connectors schedule or publish only after operator approval.
