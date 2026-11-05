import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

/** the game's own Vite module, installed with npm ci when the worktree has no node_modules yet */
export function ensureDependencies(root: string): string {
  const vite = join(root, "node_modules", "vite", "dist", "node", "index.js");
  if (existsSync(vite)) {
    return vite;
  }
  console.error(`Installing the game's dependencies in ${root} (npm ci)`);
  const result = spawnSync("npm", ["ci"], { cwd: root, stdio: ["ignore", process.stderr, process.stderr] });
  if (result.status !== 0 || !existsSync(vite)) {
    throw new Error(`npm ci failed in ${root}`);
  }
  return vite;
}
