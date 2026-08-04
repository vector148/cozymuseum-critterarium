---
name: plan-campaign-calendar-capacity
description: Turn an approved Atumerce campaign plan and, when available, a validated content-supply manifest into a capacity-aware publication calendar with market, audience, product, review, dependency, readiness, and measurement gates. Use after the master plan and content guideline are approved to allocate work windows, and again after specialist outputs are ready to bind real artifacts to publication slots; do not publish, schedule through connectors, or fill dates merely to look active.
---

# Plan Campaign Calendar And Capacity

## Role

Operate as a leaf of **Omnichannel Planning**, Team01's single Planning mega-skill under ADR-0017. Translate an approved campaign sequence into a feasible calendar and an explicit handoff to content operations. This is Planning, not scheduling or publishing authority.

## Required Inputs

Require:

- approved `campaign_id`, plan version, objective, primary persona, journey stage, and decision sequence;
- approved canonical and derivative dependencies, claim IDs, content guideline, and channel roles;
- planned work packages and, for artifact-bound scheduling, the versioned `content_supply_manifest` from `route-specialist-content-outputs`;
- campaign window, deadline, owner, reviewers, review service levels, founder-time ceiling, production capacity, cash ceiling, blackout dates, and stop condition;
- market/audience/product context evidence and the measurement contract.

Keep unknown capacity visible. Do not assume unlimited writing, design, video, legal, translation, founder, or engineering availability.

## Three Context Clocks

Use only clocks that materially affect the customer decision:

1. **Market clock**: regulatory events, market regimes, holidays, conferences, seasonal demand, and competitor/category moments.
2. **Audience clock**: attention rhythm, learning cadence, timezone, workweek, buying window, and channel behaviour.
3. **Atumerce clock**: verified product/release readiness, support load, founder availability, review gates, and operational dependencies.

For every date-sensitive event, record the source, timezone, last checked date, confidence, and revalidation owner.

## Workflow

1. Freeze the approved outcome, baseline, sequence hypothesis, target cohort/window, verification date, and stop condition.
2. Run two explicit passes:
   - **allocation pass**: convert the master plan into dependency-linked work packages and movable publication windows;
   - **binding pass**: bind only `ready-for-calendar` artifact IDs from the content-supply manifest to publication slots.
3. Record campaign role, source mega-skill and leaf, artifact or handoff, source/canonical lineage, channel, owner, reviewer, effort, earliest start, due date, review gate, readiness state, and measurement hook for each package.
4. Reconcile the three context clocks. Separate fixed dates from movable windows and hypotheses from verified deadlines.
5. Capacity-plan the work. Reserve review time, translation/localization, rights/accessibility checks, rework, recovery room, and operational handoff time before allocating optional assets.
6. Apply **Essential Simplicity**: remove activity that does not change the target decision or produce learning. Empty days and deliberately unused channels are valid.
7. Mark dependencies and blocking gates. Do not bind a derivative before its canonical source, a video before its approved foundation brief, paid distribution before its contracts, or a publication slot before artifact readiness, audit, and operator approval.
8. Define status values and rescheduling rules. A missed gate moves dependent work to `blocked` or `replan`; it does not silently compress review time.
9. Emit a publication handoff queue. Phase 3 operational connectors may schedule or publish only after the authorized operator approves the exact destination, slot, artifact version, and account.

## Calendar Row Contract

Every scheduled row must include:

- `campaign_id`, plan version, work-package ID, date/window, timezone, and status;
- source mega-skill/leaf, artifact ID/version, and readiness state;
- journey stage, campaign role, channel, market/language, primary persona, and decision moment;
- source/canonical IDs, claim IDs, asset or handoff type, CTA, and proof requirement;
- owner, reviewer, effort/capacity unit, dependency IDs, review gate, and recovery allowance;
- primary signal, guardrail, learning question, stop condition, and next review date.

Use `N/A — reason` when a field is intentionally inapplicable. Do not use unexplained blank cells.

## Output Contract

Return a versioned `campaign_calendar` with the three context clocks, dependency map, capacity ledger, planned windows, artifact-bound publication slots, unscheduled backlog, review and recovery allowance, blockers, measurement checkpoints, and handoff owner.

Also return a `publication_handoff_queue` containing the exact slot, destination, artifact version, operator, final approval gate, and connector requirement. Use verdict: `proceed`, `reframe`, `escalate`, or `reject`.

The calendar must expose source lineage even when a presentation view hides it. A full-looking calendar is not evidence of readiness.

## Hard Boundaries

- Never create fake cadence, manufacture timely claims, or sacrifice evidence/review to meet a date.
- Never treat follower count, impressions, or content volume as the final business outcome.
- Do not mistake a planned window for a ready publication slot.
- Do not mutate the operational calendar, schedule connectors, spend, send, publish, or access customer identity data from this Planning skill.
