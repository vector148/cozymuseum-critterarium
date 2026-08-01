# ADR-0006 - Conventional Commit source governance

## Status

Accepted on 2026-08-01.

## Context

Atumerce Brand Governance records three intended source-control gates: Conventional Commits, a Commitlint CI check, and branch protection on `main`. CozyMuseum already has Commitlint and Husky locally, but the scope allowlist was advisory and the public repository had no CI gate documenting the same standard.

CozyMuseum is a public, independent repository. Its history must remain understandable without FourRealm or private Atumerce context. The four sanitized biological source workbooks are intentional public product data under ADR-0009; personal workbook state, downloaded media, caches, secrets, and ignored local skills must never enter a commit.

## Decision

- Use Conventional Commits with the allowed types `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, and `revert`.
- Keep scope optional, but reject unknown or non-lowercase scopes. CozyMuseum scopes include `app`, `client`, `server`, `catalog`, `taxonomy`, `media`, `legal`, `database`, `scripts`, `deps`, `config`, `agents`, and `docs`.
- Enforce a 72-character header, non-empty subject, no final period, and blank lines before body/footer.
- Enforce the policy locally through `.husky/commit-msg` and remotely through `.github/workflows/commitlint.yml`.
- Keep exactly one consolidated commit per calendar day, using `Asia/Saigon` as the day boundary. Every additional code, data, documentation, QA, or deployment fix made on the same day must amend that day's commit instead of creating another commit.
- A same-day commit that has already been pushed may be amended and force-pushed only with explicit owner approval. Never rewrite a tag or a commit from an earlier calendar day as part of routine consolidation.
- Establish the public repository with one sanitized, parentless root commit. The root tree may contain only the reviewed independent CozyMuseum state; inherited commits, personal workbook state, local media, caches, secrets, and internal mega-skills must not be reachable from `main` history. ADR-0009's four reviewed source workbooks are allowed.
- Treat hosting-provider object retention separately from branch history: a force-push makes `main` parentless but cannot promise immediate deletion of unreachable objects cached by GitHub. Absolute remote-object purging requires GitHub Support or repository recreation and re-linking of external deployments.
- Stage explicit paths. Before every commit, inspect the staged tree for personal state, unapproved media/workbooks, secrets, local Atumerce skills, or unrelated user changes.
- Protect `main` with the Commitlint workflow once repository settings are configured.

## Consequences

Commit history becomes machine-checkable and searchable by domain, while the maximum commit cadence is one auditable snapshot per Saigon calendar day. Same-day published amendments deliberately trigger a replacement CI/Vercel deployment. The stricter scope and body/footer rules may reject messages that previously produced only warnings. GitHub branch protection remains an operator setting and is tracked as a follow-up until enabled.

## Verification

- A valid message such as `docs(legal): define media rights policy` passes.
- A non-conventional message and an unknown scope fail.
- The GitHub workflow checks pushes to `main` and all pull requests.
- `npm run commitlint` validates the current commit.
- `git rev-list --max-parents=0 --count main` returns `1`.
- During project establishment, `git rev-list --parents main` prints only the root commit ID and no parent ID.
- For ongoing work, the log contains no more than one commit whose author date falls within the same `Asia/Saigon` calendar day.

## Source

Adapted from Atumerce Brand Governance's `2026-06-24_admin-hub_phase1-open-items_plan.md`, which records Conventional Commits, Commitlint CI, and `main` branch protection as quality gates.
