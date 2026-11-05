import { resolve } from "node:path";

/** the game repository the harness lives in: agent-studio/playtest is two levels down */
export const DEFAULT_ROOT = resolve(import.meta.dirname, "..", "..", "..");
