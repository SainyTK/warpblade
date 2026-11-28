import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export function writeJson(dir: string, file: string, value: unknown): void {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, file), `${JSON.stringify(value, null, 1)}\n`);
}
