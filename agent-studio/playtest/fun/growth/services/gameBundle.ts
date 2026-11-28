import { existsSync, mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { ensureDependencies } from "../../../services/dependencies";
import { BUNDLE } from "../constants";
import { bundleEntry } from "./bundleEntry";
import { gameTreeKey } from "./gameTreeKey";

interface ViteModule {
  build(config: object): Promise<unknown>;
}

export interface GameBundle {
  file: string;
  key: string;
  built: boolean;
}

async function buildBundle(root: string, entry: string, folder: string): Promise<void> {
  const vite = (await import(pathToFileURL(ensureDependencies(root)).href)) as ViteModule;
  const staging = mkdtempSync(`${folder}.building-`);
  try {
    const entryFile = join(staging, BUNDLE.entryFile);
    writeFileSync(entryFile, entry);
    await vite.build({
      root,
      configFile: false,
      publicDir: false,
      logLevel: "error",
      build: {
        ssr: entryFile,
        outDir: join(staging, "out"),
        emptyOutDir: true,
        minify: false,
        rollupOptions: { output: { format: "es", entryFileNames: BUNDLE.bundleFile, codeSplitting: false } },
      },
      ssr: { noExternal: true },
    });
    try {
      renameSync(join(staging, "out"), folder);
    } catch (error) {
      if (!existsSync(join(folder, BUNDLE.bundleFile))) {
        throw error;
      }
    }
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
}

export async function gameBundle(root: string): Promise<GameBundle> {
  const entry = bundleEntry(root);
  const key = gameTreeKey(root, entry);
  const cache = join(tmpdir(), BUNDLE.cacheFolder);
  const folder = join(cache, key);
  const file = join(folder, BUNDLE.bundleFile);
  if (existsSync(file)) {
    return { file, key, built: false };
  }
  mkdirSync(cache, { recursive: true });
  await buildBundle(root, entry, folder);
  return { file, key, built: true };
}
