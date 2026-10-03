import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";

const appDataRoot = process.platform === "win32"
  ? process.env.LOCALAPPDATA || join(homedir(), "AppData", "Local")
  : process.env.XDG_DATA_HOME || join(homedir(), ".local", "share");

export const DEFAULT_DATABASE_DIR = resolve(appDataRoot, "CozyMuseum", "data");

export function catalogDataDir() {
  return resolve(process.env.COZYMUSEUM_DATA_DIR || DEFAULT_DATABASE_DIR);
}

export function catalogImagesDir() {
  return resolve(process.env.COZYMUSEUM_IMAGES_DIR || join(dirname(catalogDataDir()), "images"));
}
