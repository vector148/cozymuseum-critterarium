# CozyMuseum Documentation

- Product/module vocabulary: `../CONTEXT.md`
- Live project roadmap: `PROJECT-ROADMAP.md`
- Architecture decisions: `adr/`
- Point-in-time audits: `audits/`
- Agent conventions: `agents/`
- Master PRD and implementation issues: `../.scratch/cozymuseum-rebuild/`
- Repository safety: `policies/repository-safety.md`

## Governance decisions

- `adr/0006-conventional-commit-source-governance.md`
- `adr/0007-media-rights-and-provenance.md`
- `audits/2026-08-01-media-rights-audit.md`

## Workflow Clone Kit

The portable workflow remains under `workflow-clone-kit/`:

1. Blackfire Grilling sharpens PRDs, UX, architecture, and risk before implementation.
2. Greenline Forging delivers one red-capable vertical slice at a time.
3. Faultline Containment isolates recurring failures before broad edits resume.

Start at `workflow-clone-kit/checklists/agent-startup-checklist.md` and use the templates under `workflow-clone-kit/templates/`.

## Verification profile

- Full check: `npm run verify`
- Tests only: `npm test`
- Production build: `npm run build`
- Data health: `npm run bio -- doctor`
- End-to-end local smoke: `npm run dev`

Screenshots support visual review but do not replace behavioral tests.
