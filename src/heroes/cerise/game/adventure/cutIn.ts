import { game, hero } from "../../../../game/state";
import { usesCeriseDrill } from "./selection";

interface CutIn {
  age: number;
  intro: number;
  face: number;
  tint: number;
}

let cue: (Omit<CutIn, "age"> & { began: number }) | null = null;

export function showCutIn(tint: number, intro: number): void {
  if (!usesCeriseDrill()) return;
  cue = { tint, intro, face: hero.face, began: game.clock };
}

export function resetCutIn(): void {
  cue = null;
}

export function ceriseCutIn(): CutIn | null {
  if (!cue) return null;
  const age = game.clock - cue.began;
  return age < cue.intro + 0.12 ? { ...cue, age } : null;
}
