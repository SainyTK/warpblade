import { GROOVE } from "../constants/jory/beat";
import { PACE } from "../constants/stage";

/** the game seconds one beat lasts at a tempo: the fight runs at PACE, so a beat keeps its real length on screen */
export const beatSeconds = (bpm: number): number => (60 / bpm) * PACE;

/** the Groove tier, 1 to 4, of a Groove */
export function tierOf(groove: number): number {
  let tier = 1;
  for (let i = 1; i < GROOVE.tiers.length; i++) if (groove >= GROOVE.tiers[i]) tier = i + 1;
  return tier;
}

/** game seconds from a press to the nearest beat, given the time since the last beat: late (positive) or early (negative) */
export function offBeat(phase: number, beatLen: number): number {
  const p = ((phase % beatLen) + beatLen) % beatLen;
  return p <= beatLen / 2 ? p : p - beatLen;
}
