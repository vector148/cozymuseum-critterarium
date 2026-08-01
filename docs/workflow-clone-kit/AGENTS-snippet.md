# Workflow Clone Kit Instructions

This repository uses the portable Workflow Clone Kit.

## Required Workflow

For serious planning, PRDs, ADRs, architecture, privacy/security, high-risk UX, repo-history changes, or issue batches:

- Read `docs/workflow-clone-kit/skills/01-blackfire-grilling.md`.
- Produce or update a PRD/ADR/issue breakdown before implementation.

For feature implementation:

- Read `docs/workflow-clone-kit/skills/02-greenline-forging.md`.
- Build one verified slice at a time.
- Prefer tests and smoke checks through public interfaces.

For hard bugs or repeated failure:

- Read `docs/workflow-clone-kit/skills/03-faultline-containment.md`.
- If three Greenline attempts fail, stop broad edits and isolate the fault with a minimal reproducible loop.

## Templates

Use these templates when creating artifacts:

- PRD: `docs/workflow-clone-kit/templates/prd-template.md`
- ADR: `docs/workflow-clone-kit/templates/adr-template.md`
- Handoff: `docs/workflow-clone-kit/templates/handoff-template.md`

## Startup Checklist

Before acting, read:

- `docs/workflow-clone-kit/checklists/agent-startup-checklist.md`

Then state:

- the request being answered;
- the combo being used;
- files read first;
- module/surface owner;
- verification command;
- whether existing dirty changes must be preserved.

## Core Rule

Clarity over noise. Do not expand scope, hide risk, or produce unverified work just to look productive.
