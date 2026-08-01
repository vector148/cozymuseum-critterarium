# Atumerce CCO/COO Nine-Skill Suite for CozyMuseum

Status: implemented locally - 2026-08-01

## Decision

CozyMuseum carries nine independent Atumerce skills on disk, preserving the source department's operating boundaries.

### CCO - five skills

1. `atumerce-cco-content-strategy`
2. `atumerce-cco-channel-templates`
3. `atumerce-cco-editorial-calendar`
4. `atumerce-cco-published-analytics`
5. `atumerce-cco-brand-guardian`

### COO - four skills

1. `atumerce-coo-web-operations`
2. `atumerce-coo-automation`
3. `atumerce-coo-crm-funnels`
4. `atumerce-coo-crm-operations`

The previous three wrappers are deleted. Each replacement has its own narrow trigger, entrypoint, UI metadata, and directly relevant references/assets.

## Public-repository boundary

- `.agents/skills/add-organism` is the only tracked Bio skill.
- All nine Atumerce skills and their copied references/assets are ignored by Git.
- No Atumerce credential or live integration state is copied.
- Private CRM workbooks remain inside an ignored local skill asset folder.

## Verification

- All nine entrypoints pass the Codex skill validator.
- Exact local inventory is `add-organism + CCO 5 + COO 4`.
- `git check-ignore` matches every Atumerce skill file.
- The committed Bio tree contains only `add-organism` under `.agents/skills`.
