import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SERVER_PORT, UI_PORT } from '../shared/ports';
import type { StudioConfig } from './types/config';

const studioRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));

export function configuration(env = process.env): StudioConfig {
  return {
    port: Number(env.STUDIO_PORT ?? SERVER_PORT),
    origins: [`http://127.0.0.1:${UI_PORT}`, `http://localhost:${UI_PORT}`],
    repoRoot: resolve(studioRoot, '..'),
    studioRoot,
  };
}
