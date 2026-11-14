import { glow, place, sparkle } from "../../../engine/frame";
import { game, hero } from "../../../game/state";
import { WHITE } from "../../../utils/color";
import { DAWN_RAMP } from "../constants/light";
import { ALDRIC_BLADE } from "../look/blade";
import { aldric } from "./state";
import { radiant } from "./valor";

/** Radiance lights the sword: a glow along the blade from the hand, and a glint that runs up it */
function drawRadiance(): void {
  if (!radiant() || !hero.hasSword) return;
  const hx = hero.x + hero.face * hero.hand[0];
  const hy = hero.y + hero.hand[1];
  const a = hero.pose.sa;
  const reach = ALDRIC_BLADE.reach;
  const run = (game.t * 2) % 1;
  for (const u of [0.35, 0.7, 1]) {
    glow(hx + hero.face * Math.cos(a) * reach * u, hy + Math.sin(a) * reach * u, 7, DAWN_RAMP[4], 0.35);
  }
  sparkle(hx + hero.face * Math.cos(a) * reach * run, hy + Math.sin(a) * reach * run, 2, DAWN_RAMP[5], WHITE, 0.5);
}

/** Bulwark: a thin shell of light round him while it holds, brighter on the side he faces */
function drawBulwark(): void {
  if (aldric.barrier <= 0) return;
  const k = Math.min(1, aldric.barrier / 0.4);
  const pulse = 0.7 + 0.3 * Math.sin(game.t * 10);
  sparkle(hero.x + hero.face * 10, hero.y - 20, 3 * pulse, DAWN_RAMP[5], WHITE, 0.5 * k);
  glow(hero.x + hero.face * 6, hero.y - 18, 16, DAWN_RAMP[4], 0.3 * k * pulse);
}

/** drawn over Aldric: his lit sword and his Bulwark */
export function drawAldric(): void {
  place();
  drawRadiance();
  drawBulwark();
}
