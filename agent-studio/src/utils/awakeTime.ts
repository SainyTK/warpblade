/** the part of the time between two clock checks that counts toward an agent's limit.
    Checks run every `tick` ms; a longer gap means the Mac slept or the process was frozen, so only one tick of it counts */
export function awakeMs(previous: number, now: number, tick: number): number {
  return Math.min(Math.max(0, now - previous), tick);
}
