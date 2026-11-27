import { skillFx } from "../../../../game/skillFx";
import { game } from "../../../../game/state";
import type { FxAt, FxCast, SkillFxOptions } from "../../../../types/skillFx";
import { SAYA_FX, SAYA_FX_MERGE } from "../../constants/skillFx";
import { sayaSignature } from "./signature";

const lastMain = new Map<string, number>();

function mergedQuiet(id: string, quiet: boolean): boolean {
  if (quiet) return true;
  const last = lastMain.get(id);
  if (last !== undefined && game.t >= last && game.t - last < SAYA_FX_MERGE) return true;
  lastMain.set(id, game.t);
  return false;
}

export function sayaFx(id: string, at: FxAt, options: Omit<SkillFxOptions, "signature"> = {}): FxCast {
  const look = SAYA_FX[id];
  const quiet = mergedQuiet(id, !!options.quiet);
  return skillFx(id, look.shape, { reach: look.reach, ...at }, { ...options, quiet, signature: sayaSignature(look) });
}
