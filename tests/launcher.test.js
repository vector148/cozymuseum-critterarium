import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("Windows shortcut launcher finds the CozyMuseum root and exposes a dry run", {
  skip: process.platform !== "win32",
}, () => {
  const launcher = resolve(root, "scripts/CozyMuseum.bat");
  const result = spawnSync(
    `call "${launcher}" --dry-run`,
    {
      shell: "cmd.exe",
      cwd: dirname(root),
      encoding: "utf8",
      env: {
        ...process.env,
        PORT: "43001",
        VITE_PORT: "43173",
        COZYMUSEUM_NO_BROWSER: "1",
      },
    },
  );

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /CozyMuseum dev launcher/);
  assert.match(result.stdout, /API:\s+http:\/\/localhost:43001/);
  assert.match(result.stdout, /Client:\s+http:\/\/localhost:43173/);
});
