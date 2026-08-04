---
name: route-specialist-content-outputs
description: Validate and normalize approved Commercial outputs from Deep Copywriting, Video E2E, Paid Media, CRO, or another authorized specialist into a traceable content-supply manifest for calendar planning. Use when specialist artifacts must re-enter Omnichannel Planning for dependency resolution, readiness checks, campaign lineage, capacity allocation, or publication-slot handoff; do not rewrite specialist work, schedule connectors, or publish.
---

# Route Specialist Content Outputs

## Role

Operate as the re-entry leaf of **Omnichannel Planning**, Team01's single Planning mega-skill under ADR-0017. Join approved outputs from Specialized Execution back to the campaign plan without taking ownership of copy, media production, paid execution, performance optimization, or publication.

## Required Inputs

Require one intake record per artifact:

- `campaign_id`, plan version, work-package ID, artifact ID and version;
- source mega-skill and leaf skill, source/canonical IDs, claim IDs, CTA ID, audience, journey stage, channel, format, market, and language;
- artifact location, owner, reviewer, review state, approval timestamp, expiry or revalidation date, rights/accessibility state, and risk flags;
- dependency IDs, required companion assets, measurement hook, and known production or publication constraints.

Use `N/A — reason` for a field that is intentionally inapplicable. An unexplained blank is a blocker, not permission to infer.

## Workflow

1. Match each artifact to the approved campaign route, canonical source, claim ledger, content guideline, and measurement contract.
2. Verify lineage and version compatibility. Reject an artifact that cannot be traced to the approved source or that uses an expired, superseded, or forbidden claim.
3. Preserve specialist ownership. Return copy, media, targeting, or analytics defects to the producing mega-skill; do not silently repair specialist substance inside Planning.
4. Normalize the artifact to one readiness state:
   - `received`;
   - `needs-specialist-rework`;
   - `ready-for-calendar`;
   - `blocked`;
   - `expired`.
5. Resolve duplicates, derivative relationships, companion-asset requirements, review order, channel eligibility, and dependencies.
6. Emit a publication candidate only when the artifact, rights, claims, CTA, destination, tracking, owner, reviewer, and measurement hook are explicit.
7. Route `ready-for-calendar` candidates to `plan-campaign-calendar-capacity`. Route all other items back to the named owner with one blocking reason and the next required evidence or decision.

## Content Supply Manifest

Return a versioned `content_supply_manifest` containing:

- campaign and plan IDs;
- artifact ID/version and source mega-skill/leaf;
- canonical, claim, CTA, audience, journey, channel, format, market, and language IDs;
- owner, reviewer, readiness state, approval and expiry dates;
- dependencies, rights/accessibility state, tracking and measurement hooks;
- publication constraints, blocking reason, next owner, and next review date;
- verdict: `ready-for-calendar`, `needs-specialist-rework`, `blocked`, or `expired`.

Keep the full manifest even when a presentation view hides technical lineage.

## Hard Boundaries

- Do not create or rewrite final copy, search assets, targeting, video, design, or analytics conclusions.
- Do not change claims, approve legal/privacy/product truth, or invent missing approval.
- Do not mutate a live calendar, schedule through a connector, spend, send, publish, or access customer identity data.
- A completed file is not publication-ready until its lineage, rights, destination, tracking, review, and measurement gates pass.
