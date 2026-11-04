import { GROUND, W } from "../../../constants/stage";
import { glow, line, place, px } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { WHITE } from "../../../utils/color";
import { hurtHero } from "../../hurtHero";
import { particles, rng } from "../../state";
import { boxHit, heroBox } from "../../world";
import { RUNE_RAMP, RUNE_SPARKS } from "./colors";

const SPEED = 125;
const REACH = 190;
const TRAIL = 16;
/** 3 by 4 rune glyphs that rise out of the floor at the crest */
const GLYPHS: readonly (readonly string[])[] = [
  ["#.#", ".#.", "#.#", ".#."],
  ["##.", "#.#", "##.", "#.."],
  [".#.", "###", ".#.", "#.#"],
];

/** a wave of runes running along the floor from a golem's slam: low enough to jump, it hits once */
export function createRuneWave(x0: number, dir: number, damage: number): Effect {
  const w = { x: x0, t: 0, hit: false };
  return {
    update(dt) {
      w.t += dt;
      w.x += dir * SPEED * dt;
      if (!w.hit && boxHit([w.x - 4, GROUND - 7, w.x + 4, GROUND + 2], heroBox())) {
        w.hit = true;
        hurtHero(damage, w.x - dir * 10);
      }
      if (rng.chance(0.45))
        particles.spawn(PK.EMBER, w.x + rng.range(-2, 2), GROUND - rng.range(1, 6), dir * 10, -rng.range(14, 30), 0.5, {
          sparks: RUNE_SPARKS,
        });
      const end = Math.abs(w.x - x0) > REACH || w.x < -4 || w.x > W + 4;
      return !end;
    },
    draw() {
      place();
      const fade = Math.min(1, w.t * 8) * Math.min(1, (REACH - Math.abs(w.x - x0)) / 30);
      for (let i = 0; i < TRAIL; i++) {
        const x = Math.round(w.x - dir * i);
        const u = i / TRAIL;
        const h = Math.max(0, (1 - u) * 6 + Math.sin(w.t * 30 + i * 1.7) * 1.2);
        const top = GROUND - h;
        line(x, GROUND - 1, x, top, (v) => RUNE_RAMP[Math.min(4, 1 + Math.floor((1 - u) * 2 + v * 1.9))], fade);
        px(x, GROUND, RUNE_RAMP[3], fade * (1 - u));
      }
      const g = GLYPHS[Math.floor(w.t * 14) % GLYPHS.length];
      const gx = Math.round(w.x + dir * 1) - 1;
      const lift = 8 + Math.sin(w.t * 20) * 1;
      g.forEach((row, j) => {
        for (let i = 0; i < 3; i++) if (row[i] === "#") px(gx + i, GROUND - lift - 4 + j, WHITE, fade);
      });
      glow(w.x, GROUND - 4, 16, RUNE_RAMP[3], 0.5 * fade);
      glow(w.x - dir * 8, GROUND - 2, 12, RUNE_RAMP[2], 0.3 * fade);
    },
  };
}
