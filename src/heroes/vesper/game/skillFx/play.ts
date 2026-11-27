import { skillFx } from "../../../../game/skillFx";
import { game } from "../../../../game/state";
import type { FxAt, FxCast, SkillFxOptions } from "../../../../types/skillFx";
import { VESPER_FX, VESPER_FX_MERGE } from "../../constants/skillFx";
import { vesperSignature } from "./signature";

const lastMain = new Map<string, number>();

function mergedQuiet(id: string, quiet: boolean): boolean {
  if (quiet) return true;
  const last = lastMain.get(id);
  if (last !== undefined && game.t >= last && game.t - last < VESPER_FX_MERGE) return true;
  lastMain.set(id, game.t);
  return false;
}

export function vesperFx(id: string, at: FxAt, options: Omit<SkillFxOptions, "signature"> = {}): FxCast {
  const look = VESPER_FX[id];
  const quiet = mergedQuiet(id, !!options.quiet);
  return skillFx(id, look.shape, { reach: look.reach, ...at }, { ...options, quiet, signature: vesperSignature(look) });
}
