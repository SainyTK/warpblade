import { mkdir, mkdtemp, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

export async function writeJson(path: string, data: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`);
}

export async function fileBytes(path: string): Promise<number> {
  const info = await stat(path);
  return info.size;
}

export async function ensureDirFor(path: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
}

/** a new empty folder in the system temp folder */
export function makeTempDir(prefix: string): Promise<string> {
  return mkdtemp(join(tmpdir(), prefix));
}

export async function removeDir(path: string): Promise<void> {
  await rm(path, { recursive: true, force: true });
}
