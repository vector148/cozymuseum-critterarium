import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { inspectCleanroomTree } from "../../scripts/verify-cleanroom-release.mjs";

test("cleanroom verifier rejects data, internal documents, media, deployment state, and secrets", () => {
  const root = mkdtempSync(join(tmpdir(), "cozymuseum-release-fixture-"));
  try {
    for (const relative of ["database", "docs/prd", ".agents", "public", ".vercel"]) {
      mkdirSync(join(root, relative), { recursive: true });
    }
    writeFileSync(join(root, "database", "animalia.xlsx"), "catalog");
    writeFileSync(join(root, "docs", "prd", "internal.md"), "internal");
    writeFileSync(join(root, ".agents", "CONTEXT.md"), "private planning");
    writeFileSync(join(root, "public", "species.jpg"), "media");
    writeFileSync(join(root, ".vercel", "project.json"), "deployment");
    writeFileSync(join(root, "recovery-codes.txt"), "1234-5678");

    const report = inspectCleanroomTree(root);
    assert.equal(report.ok, false);
    assert.deepEqual(report.violations.map((item) => item.path).sort(), [
      ".agents/CONTEXT.md",
      ".vercel/project.json",
      "database/animalia.xlsx",
      "docs/prd/internal.md",
      "public/species.jpg",
      "recovery-codes.txt",
    ]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("cleanroom verifier accepts the minimal public shell surface", () => {
  const root = mkdtempSync(join(tmpdir(), "cozymuseum-release-clean-"));
  try {
    for (const relative of ["app", "resources", "server", "scripts", "public/brand"]) {
      mkdirSync(join(root, relative), { recursive: true });
    }
    writeFileSync(join(root, "package.json"), "{}");
    writeFileSync(join(root, "README.md"), "Public user guide");
    writeFileSync(join(root, "LICENSE"), "MIT");
    writeFileSync(join(root, "app", "runtime.js"), "export {};");
    writeFileSync(join(root, "public", "brand", "mark.svg"), "<svg/>");

    assert.deepEqual(inspectCleanroomTree(root), { ok: true, violations: [] });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
