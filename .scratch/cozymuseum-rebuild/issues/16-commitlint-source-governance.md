# Issue 16 - Commitlint source governance

Status: in progress

## Outcome

Adopt ADR-0006: strict Conventional Commit validation locally and in GitHub CI, with explicit CozyMuseum scopes and a protected `main` quality gate.

## Acceptance criteria

- [x] ADR-0006 records the adapted Atumerce governance decision.
- [x] Unknown/non-lowercase scopes and malformed body/footer spacing fail locally.
- [x] GitHub workflow checks pushes and pull requests.
- [ ] Enable branch protection requiring the Commit message policy workflow on `main`.
