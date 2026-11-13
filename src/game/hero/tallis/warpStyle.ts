import { W } from "../../../constants/stage";
import { SMOKE_KNOT } from "../../../constants/tallis/abilities";
import { TALLIS_WARP } from "../../../constants/tallis/moveset";
import type { Enemy } from "../../../types/enemy";
import type { WarpStyle, WarpTune } from "../../../types/moveset";
import { clamp } from "../../../utils/math";
import { createSlash } from "../../effects/slash";
import { meleeHit } from "../../meleeHit";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, ponytail, scarf } from "../../state";
import { boxAhead } from "../../world";
import { skin } from "../skin";
import { sharedWarpStrike } from "../warp";
import { behindOf } from "./backOpen";
import { drawThrownKnife } from "./blades";
import { raiseCloud } from "./clouds";
import { addGloam } from "./gloam";
import { createGloamShade, createGloamThread } from "./gloamLook";
import { fadeIn } from "./veil";

/** Quiet Step, his warp skill */
const SKILL = "t_quietStep";
/** minions this near his arrival are blinded by Quiet Step */
const BLIND_REACH = 40;
/** Phantom Step's smoke: this share of a Smoke Knot's width, standing this long */
const PHANTOM = { width: 0.7, life: 2 } as const;

/** the arrival's cut: a short rose crescent from his near knife into the foe's back */
const ARRIVAL_SLASH = { cx: 6, cy: -16, R: 13, sy: 0.75, rot: 0.25, a0: -1.7, a1: 1, W: 3, hold: 0.05, trail: 0.2 };

/** he leaves a shade where the knife struck and steps out of the foe's shadow at its back, facing it */
function stepBehind(foe: Enemy): void {
  const ox = hero.x;
  const nx = clamp(foe.x - foe.face * TALLIS_WARP.behind, 8, W - 8);
  game.fx.push(createGloamShade(ox, hero.y, hero.face));
  game.fx.push(createGloamThread(ox, hero.y - 14, nx, hero.y - 14));
  scarf.shift(nx - ox, 0);
  ponytail.shift(nx - ox, 0);
  hero.x = nx;
  hero.face = Math.sign(foe.x - nx) || foe.face;
}

/**
 * His arrival blow: out of the foe's own shadow at its back, a knife cut that lands from behind. His blows from behind
 * deal both back bonuses, so the cut is scaled to deal what every hero's warp deals. With no foe, the shared blow.
 */
function strike(power: number, foe: Enemy | null, sureCrit: boolean): void {
  if (!foe || foe.hp <= 0) return sharedWarpStrike(power, foe, sureCrit);
  stepBehind(foe);
  const share = behindOf(foe) ? TALLIS_WARP.backShare : 1;
  game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...ARRIVAL_SLASH, ramp: skin.ramp }));
  meleeHit([boxAhead(-4, -36, 24, 2)], {
    power: power * share,
    kx: TALLIS_WARP.kx,
    ky: TALLIS_WARP.ky,
    big: true,
    sureCrit,
  });
}

/** after the blow: a breath of the Veil; Quiet Step lengthens it, gives Gloam, primes an Ambush, blinds and leaves smoke */
function arrived(): void {
  const v = skillValues(SKILL);
  fadeIn(TALLIS_WARP.breath + (v.breath ?? 0), "warp", !!v.ambush);
  if (v.refund) addGloam(v.refund);
  if (v.blind)
    for (const e of game.enemies)
      if (e.hp > 0 && e.rank === "minion" && Math.abs(e.x - hero.x) <= BLIND_REACH)
        e.blind = Math.max(e.blind, v.blind);
  if (v.phantom)
    raiseCloud(
      hero.x,
      hero.y,
      SMOKE_KNOT.width * PHANTOM.width,
      SMOKE_KNOT.height,
      withCharms("duration", PHANTOM.life),
    );
}

/** Quiet Step's warps in a row and the cut of the thrown knife */
function tune(): WarpTune {
  const v = skillValues(SKILL);
  return { charges: v.charges || undefined, path: v.path || undefined };
}

/** Tallis's warp: a knife thrown into the foe, and he steps out of its shadow at its back, veiled for a breath */
export const TALLIS_WARP_STYLE: WarpStyle = {
  drawThrown: drawThrownKnife,
  strike,
  arrived,
  tune,
};
