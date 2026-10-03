import { spawnSync } from "node:child_process";
import { copyFileSync, cpSync, existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const buildRoot = resolve(root, ".build");
const payload = resolve(buildRoot, "windows-payload-v304");
const compiler = process.env.INNO_COMPILER || resolve(homedir(), "AppData/Local/Programs/Inno Setup 6/ISCC.exe");
const npmCli = resolve(dirname(process.execPath), "node_modules/npm/bin/npm-cli.js");

function run(command, args, cwd = root) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit", shell: false });
  if (result.status !== 0) throw new Error(`${command} failed (${result.status ?? result.error?.message})`);
}

if (process.platform !== "win32") throw new Error("Windows installer builds require Windows");
if (process.version !== "v26.3.0") throw new Error("Build with Node v26.3.0 to match the bundled Node license");
if (!existsSync(compiler)) throw new Error(`Inno Setup compiler is missing: ${compiler}`);
if (resolve(payload) !== resolve(root, ".build/windows-payload-v304")) throw new Error("Unsafe payload path");

run(process.execPath, ["scripts/verify-cleanroom-release.mjs", "."]);
run(process.execPath, [npmCli, "run", "build"]);
run(process.execPath, [resolve(root, "node_modules/@tauri-apps/cli/tauri.js"), "build", "--no-bundle"]);
if (existsSync(payload)) rmSync(payload, { recursive: true, force: true });
mkdirSync(resolve(payload, "scripts"), { recursive: true });

for (const folder of ["app", "server", "dist"]) {
  cpSync(resolve(root, folder), resolve(payload, folder), { recursive: true });
}
for (const file of ["package.json", "package-lock.json", "LICENSE", "THIRD_PARTY_NOTICES"]) {
  copyFileSync(resolve(root, file), resolve(payload, file));
}
for (const file of ["desktop-server.mjs"]) {
  copyFileSync(resolve(root, "scripts", file), resolve(payload, "scripts", file));
}
copyFileSync(process.execPath, resolve(payload, "node.exe"));
copyFileSync(resolve(root, "src-tauri/target/release/cozymuseum-critterarium.exe"), resolve(payload, "cozymuseum-critterarium.exe"));
copyFileSync(resolve(root, "installer/node-license.txt"), resolve(payload, "NODE-LICENSE.txt"));

run(process.execPath, [npmCli, "ci", "--omit=dev", "--ignore-scripts", "--no-audit", "--no-fund"], payload);
run(process.execPath, ["scripts/verify-cleanroom-release.mjs", payload]);
run(compiler, [resolve(root, "installer/Critterarium.iss")]);

const artifact = resolve(buildRoot, "release/CozyMuseum-Critterarium-Setup.exe");
if (!existsSync(artifact) || statSync(artifact).size < 1_000_000) throw new Error("Installer was not produced");
console.log(`INSTALLER_READY ${artifact} (${statSync(artifact).size} bytes)`);
