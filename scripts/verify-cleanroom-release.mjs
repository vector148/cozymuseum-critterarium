import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { inspectCleanroomTree } from "../app/Modules/Operations/Release/cleanroom.js";

// CLI adapter — parses arguments, calls cleanroom gate, exits with appropriate code.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(process.argv[2] || ".");
  if (!existsSync(root)) throw new Error(`Release root does not exist: ${root}`);
  const report = inspectCleanroomTree(root);
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exitCode = 1;
}

export { inspectCleanroomTree };
