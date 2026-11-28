import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { BUNDLE } from "../constants";

const git = (root: string, args: readonly string[]): Buffer =>
  execFileSync("git", args, { cwd: root, maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "ignore"] });

export function gameTreeKey(root: string, entry: string): string {
  const paths = [...BUNDLE.gamePaths];
  const hash = createHash("sha256");
  hash.update(entry);
  for (const path of paths) {
    hash.update(git(root, ["rev-parse", `HEAD:${path}`]));
  }
  hash.update(git(root, ["diff", "HEAD", "--binary", "--", ...paths]));
  const untracked = git(root, ["ls-files", "--others", "--exclude-standard", "-z", "--", ...paths])
    .toString()
    .split("\0")
    .filter(Boolean)
    .sort();
  for (const file of untracked) {
    hash.update(file);
    hash.update(readFileSync(join(root, file)));
  }
  return hash.digest("hex").slice(0, 24);
}
