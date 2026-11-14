import { skillValues } from "../../../game/skills/query";
import { hero, progress } from "../../../game/state";
import { armoured } from "./armour";
import { brynn } from "./state";

/** stamina her skills give back each second: War Cry while it lasts, Iron Skin while she wears her armour */
export function regainStamina(dt: number): void {
  let rate = 0;
  if (brynn.cry > 0) rate += skillValues("br_cry").stamina ?? 0;
  if (armoured()) rate += skillValues("br_ironskin").stamina ?? 0;
  if (rate > 0) hero.stamina = Math.min(progress.stats.stamina, hero.stamina + rate * dt);
}
