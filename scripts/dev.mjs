import { existsSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import net from "node:net";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const isWindows = process.platform === "win32";
const dryRun = process.argv.includes("--dry-run");
const preferredApiPort = Number(process.env.PORT ?? 3001);
const preferredClientPort = Number(process.env.VITE_PORT ?? 5173);

function canListen(port) {
  return new Promise((resolveCheck) => {
    const server = net.createServer();
    server.once("error", () => resolveCheck(false));
    server.once("listening", () => {
      server.close(() => resolveCheck(true));
    });
    server.listen(port, "127.0.0.1");
  });
}

async function findOpenPort(startAt) {
  if (!Number.isInteger(startAt) || startAt < 1 || startAt > 65436) {
    throw new Error(`Invalid preferred port: ${startAt}`);
  }
  for (let port = startAt; port < startAt + 100; port += 1) {
    if (await canListen(port)) return port;
  }
  throw new Error(`No open port found from ${startAt} to ${startAt + 99}`);
}

function runNpmInstall() {
  if (existsSync(resolve(repoRoot, "node_modules"))) return;
  console.log("Dependencies are missing; running npm install...");
  const command = isWindows ? "cmd.exe" : "npm";
  const args = isWindows ? ["/d", "/s", "/c", "npm install"] : ["install"];
  const result = spawnSync(command, args, { cwd: repoRoot, stdio: "inherit" });
  if (result.status !== 0) throw new Error("npm install failed");
}

function openBrowser(url) {
  if (process.env.COZYMUSEUM_NO_BROWSER === "1") return;
  const command = isWindows ? "cmd" : process.platform === "darwin" ? "open" : "xdg-open";
  const args = isWindows ? ["/c", "start", "", url] : [url];
  const browser = spawn(command, args, { detached: true, stdio: "ignore" });
  browser.unref();
}

const apiPort = await findOpenPort(preferredApiPort);
const clientPort = await findOpenPort(preferredClientPort);
const apiUrl = `http://localhost:${apiPort}`;
const clientUrl = `http://localhost:${clientPort}`;

console.log("CozyMuseum dev launcher");
console.log(`API:    ${apiUrl}`);
console.log(`Client: ${clientUrl}`);

if (dryRun) process.exit(0);

runNpmInstall();
openBrowser(clientUrl);

const command = isWindows ? "cmd.exe" : "npm";
const args = isWindows ? ["/d", "/s", "/c", "npm run dev"] : ["run", "dev"];
const child = spawn(command, args, {
  cwd: repoRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    PORT: String(apiPort),
    CLIENT_ORIGIN: clientUrl,
    VITE_PORT: String(clientPort),
    VITE_API_TARGET: apiUrl,
    VITE_STRICT_PORT: "true",
  },
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});
