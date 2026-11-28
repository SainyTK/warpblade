import type { BotMemory } from "../types/bot";

export const freshMemory = (): BotMemory => ({
  now: 0,
  lastDodge: -1e9,
  lastVault: -1e9,
  ultUntil: 0,
  warpUntil: 0,
  ultRestUntil: 0,
  warpRestUntil: 0,
});
