import { skillFx } from "../../../../game/skillFx";
import { skillLevel } from "../../../../game/skills/query";
import { game, progress } from "../../../../game/state";
import type { FxAt, FxShape, SkillFxOptions } from "../../../../types/skillFx";
import { swordHalo } from "./halo";
import { layered } from "./layered";

const LEAD_GAP = 0.12;
const GROUNDED: ReadonlySet<FxShape> = new Set(["pillar", "wave", "nova", "spikes"]);
const UNHALOED: ReadonlySet<FxShape> = new Set(["wave", "trail", "bolt"]);
const lastLead = new Map<string, number>();

function withMastery(id: string, shape: FxShape, options: SkillFxOptions): SkillFxOptions["signature"] {
  const mastery = progress.build.mastery[id] ?? 0;
  if (options.quiet || mastery <= 0 || UNHALOED.has(shape)) return options.signature;
  return layered(options.signature, swordHalo(mastery + 1, GROUNDED.has(shape) ? 14 : 0));
}

export function yunFx(id: string, shape: FxShape, at: FxAt, options: SkillFxOptions = {}): void {
  if (skillLevel(id) <= 0) return;
  skillFx(id, shape, at, { ...options, signature: withMastery(id, shape, options) });
}

export function isLead(id: string): boolean {
  const last = lastLead.get(id) ?? Number.NEGATIVE_INFINITY;
  lastLead.set(id, game.t);
  return game.t - last > LEAD_GAP || game.t < last;
}
