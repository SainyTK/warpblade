import { frame } from "../../../../constants/hero";
import { PAL } from "../../../../constants/palette";
import { glow, place, px, sparkle } from "../../../../engine/frame";
import { hero } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Vec } from "../../../../types/rig";
import { WHITE } from "../../../../utils/color";
import { ease, TAU } from "../../../../utils/math";
import { PRISM_CLIPS } from "../../constants/clips/prism";
import { SHATTER_MOTES } from "../../constants/prism";
import { KAEL_BLADE } from "../../look/blade";

const P = PAL.prism;
/** the wind-up's last key: the blade straight up overhead */
const PEAK = PRISM_CLIPS.shatterfall.keys[2];
/** the blade's tip at the top of the wind-up, from the feet facing right */
const TIP: Vec = [
  PEAK[1].fx + Math.cos(PEAK[1].sa) * KAEL_BLADE.reach,
  PEAK[1].fy + Math.sin(PEAK[1].sa) * KAEL_BLADE.reach,
];
/** the motes arrive as the wind-up peaks and are gone as the cut starts */
const GATHER = PEAK[0];
const GONE = frame(5);

/** four prism motes drift in from around the blade's tip through Shatterfall's wind-up and meet on it in a white star */
export function createShatterMotes(): Effect {
  const spin = hero.face;
  return {
    update: () => hero.move === "shatterfall" && hero.st < GONE,
    draw() {
      place();
      const x = hero.x + hero.face * TIP[0];
      const y = hero.y + TIP[1];
      const u = Math.min(1, hero.st / GATHER);
      const r = SHATTER_MOTES.spread * (1 - ease.outQuad(u));
      for (let i = 0; i < SHATTER_MOTES.count; i++) {
        const a = (i / SHATTER_MOTES.count) * TAU + spin * u * 2;
        px(x + Math.cos(a) * r, y + Math.sin(a) * r, u > 0.7 ? WHITE : P[4]);
        glow(x + Math.cos(a) * r, y + Math.sin(a) * r, 5, P[3], 0.3);
      }
      if (u >= 1) sparkle(x, y, 3, WHITE, P[4], 0.6);
    },
  };
}
