# 9. Public and Private Skill Parity (99/1 Rule)

Date: 2026-08-02

## Status

Accepted

## Context

The CozyMuseum workflow heavily relies on AI-driven organism intake using the `add-organism` and `add-organism-private` skills. Over time, these two skills tend to drift apart. New safety invariants, error recovery strategies, or UI tweaks are often added to one skill while the other is forgotten. 
This creates a fragmented experience where the public skill (used by normal players) might miss critical taxonomy protections, or the private skill (used for the showcase) might contain outdated code logic.

## Decision

We institute the **99/1 Skill Parity Rule**:
- The `.agents/skills/add-organism/SKILL.md` (Public) and `.agents/skills/add-organism-private/SKILL.md` (Private) files MUST be 99% identical in structure, wording, and logic.
- They must share the exact same `Workflow`, `Invariants`, `Recovery`, and basic `Image Filtering` and `Manual Unsplash Overrides` structure.

**The ONLY 1% difference permitted is:**
1. **The CLI Command:** Private uses `--strict-media`. Public does not.
2. **Aesthetic Enforcement:** Private has a strict mandate to reject visually unappealing images (even if they depict the correct organism) and route them to `.scratch/qa_backlog.md` (the "Sổ Nợ"). Public relaxes this rule to a simple "Is this the correct organism?" check and rejects immediately without touching the backlog.

## Consequences

- **Double Update Burden:** Any future improvement to taxonomy handling, prompt engineering, or error recovery in one skill MUST be explicitly copied to the other skill during the same commit.
- **Unified Knowledge:** Both audiences (private curators and public players) benefit from the most robust ingestion logic available.
