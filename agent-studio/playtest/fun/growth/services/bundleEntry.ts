import { join } from "node:path";
import { GAME_MODULES } from "../constants";

export function bundleEntry(root: string): string {
  return Object.entries(GAME_MODULES)
    .map(([key, { path }]) => `export * as ${key} from ${JSON.stringify(join(root, path))};\n`)
    .join("");
}
