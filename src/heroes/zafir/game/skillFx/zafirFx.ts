import { skillFx } from "../../../../game/skillFx";
import { progress } from "../../../../game/state";
import type { FxAt, FxCast, FxShape, FxSignature, SkillFxOptions } from "../../../../types/skillFx";
import { drawBleed } from "./bleed";
import { drawDervish } from "./dervish";

export type ZafirMark = "spin" | "bleed" | "both";

export interface ZafirFxOptions extends SkillFxOptions {
  mark?: ZafirMark;
  lift?: number;
}

const GROUNDED: ReadonlySet<FxShape> = new Set(["pillar", "wave", "nova", "spikes"]);
const WAIST = 14;

function zafirSignature(mark: ZafirMark, lift: number): FxSignature {
  return (cast, _at, kit, progressed, fade) => {
    const mastery = progress.build.mastery[cast.id] ?? 0;
    if (mark !== "bleed") drawDervish(cast, kit, progressed, fade, lift, mastery);
    if (mark !== "spin") drawBleed(cast, progressed, fade, mark === "both" ? lift : lift * 0.6, mastery);
  };
}

export function zafirFx(id: string, shape: FxShape, at: FxAt, options: ZafirFxOptions = {}): FxCast {
  const { mark = "spin", lift, ...rest } = options;
  const raise = lift ?? (GROUNDED.has(shape) ? WAIST : 0);
  return skillFx(id, shape, at, { ...rest, signature: zafirSignature(mark, raise) });
}
