import { skillFx } from "../../../../game/skillFx";
import { skillLevel } from "../../../../game/skills/query";
import { game, progress } from "../../../../game/state";
import type { FxAt, FxShape, FxShapeDraw, SkillFxOptions } from "../../../../types/skillFx";
import { bladeHalo } from "./halo";
import { layered } from "./layered";

const LEAD_GAP = 0.12;
const HALO_PER_MASTERY = 1;
const GROUNDED: ReadonlySet<FxShape> = new Set(["pillar", "wave", "nova", "spikes"]);
const lastLead = new Map<string, number>();

function masteryHalo(id: string, shape: FxShape, options: SkillFxOptions): FxShapeDraw | undefined {
  const mastery = progress.build.mastery[id] ?? 0;
  if (options.quiet || mastery <= 0 || shape === "wave") return options.signature;
  const halo = bladeHalo(mastery * HALO_PER_MASTERY, GROUNDED.has(shape) ? 12 : 0);
  return options.signature ? layered(options.signature, halo) : halo;
}

export function brynnFx(id: string, shape: FxShape, at: FxAt, options: SkillFxOptions = {}): void {
  if (skillLevel(id) <= 0) return;
  skillFx(id, shape, at, { ...options, signature: masteryHalo(id, shape, options) });
}

export function isLead(id: string): boolean {
  const last = lastLead.get(id) ?? Number.NEGATIVE_INFINITY;
  lastLead.set(id, game.t);
  return game.t - last > LEAD_GAP || game.t < last;
}
