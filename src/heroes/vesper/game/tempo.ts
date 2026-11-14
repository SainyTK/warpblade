import { feat } from "../../../game/feat";
import { emitSkillEvent } from "../../../game/skills/events";
import { skillEvolved, skillValues } from "../../../game/skills/query";
import { TEMPO } from "../constants/tempo";
import { vesperSound } from "./sound";
import { vesper } from "./state";

/** the most Tempo stacks right now: Unbroken Rhythm raises the top */
export const tempoMost = (): number => TEMPO.most + (skillValues("ve_rhythm").most ?? 0);

/** Tempo is at the top */
export const tempoTop = (): boolean => vesper.tempo >= tempoMost();

/** Tempo as a share of the top, 0 to 1 */
export const tempoShare = (): number => vesper.tempo / tempoMost();

/** add stacks; reaching the top rings, counts toward her achievement and tells the skills */
export function gainTempo(n: number): void {
  const before = vesper.tempo;
  vesper.tempo = Math.min(tempoMost(), vesper.tempo + n);
  vesper.idle = 0;
  vesper.fall = 0;
  if (vesper.tempo > vesper.runTop) vesper.runTop = vesper.tempo;
  if (before >= tempoMost() || vesper.tempo < tempoMost()) return;
  vesperSound.top();
  feat({ kind: "heroCount", stat: "vesper.tops", add: 1 });
  emitSkillEvent({ type: "tempoTop", stacks: vesper.tempo });
}

/** a blow taken costs a share of the stacks (Unbroken Rhythm softens it) */
export function loseTempoToHurt(): void {
  const v = skillValues("ve_rhythm");
  if (v.topKeep && tempoTop()) return;
  const keep = v.keep ?? 0;
  vesper.tempo = Math.max(tempoFloor(), Math.floor(vesper.tempo * (1 - TEMPO.hurt * (1 - keep))));
}

/** Tempo never falls below this: half the top as Perpetual Tempo, otherwise nothing */
const tempoFloor = (): number =>
  skillEvolved("ve_rhythm") ? Math.floor(tempoMost() * skillValues("ve_rhythm").floor) : 0;

/** once she has gone `hold` seconds without landing a blow, a stack falls away every `fallEvery` seconds */
export function tickTempo(dt: number): void {
  vesper.idle += dt;
  const hold = TEMPO.hold + (skillValues("ve_rhythm").hold ?? 0);
  if (vesper.tempo <= tempoFloor() || vesper.idle < hold) return;
  vesper.fall -= dt;
  if (vesper.fall > 0) return;
  vesper.fall = TEMPO.fallEvery;
  vesper.tempo = Math.max(0, vesper.tempo - 1);
}
