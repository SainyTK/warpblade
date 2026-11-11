import { GROUND, W } from "../../../constants/stage";
import { fleck, glow, glowLine, hairline, place, polygon, px } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { WHITE } from "../../../utils/color";
import { eachStanding, heroSlot } from "../../coopHooks";
import { hurtHero } from "../../hurtHero";
import { particles, rng } from "../../state";
import { boxHit, heroBox } from "../../world";
import { RUNE_RAMP, RUNE_SPARKS } from "./colors";

const SPEED = 125;
const REACH = 190;
const TRAIL = 16;
/** how far the crest's foot runs ahead of its peak, and how high the peak stands */
const CREST = { lead: 3, height: 7.5, wobble: 1.2 };
/** a rune is left burning on the floor every this many art pixels, for this long */
const BRAND = { every: 16, life: 0.45, rise: 3 };
/** 3 by 4 rune glyphs that rise out of the floor at the crest */
const GLYPHS: readonly (readonly string[])[] = [
  ["#.#", ".#.", "#.#", ".#."],
  ["##.", "#.#", "##.", "#.."],
  [".#.", "###", ".#.", "#.#"],
];

/** a wave of runes running along the floor from a golem's slam: low enough to jump, it hits once */
export function createRuneWave(x0: number, dir: number, damage: number): Effect {
  const w = { x: x0, t: 0, struck: new Set<number>() };
  return {
    update(dt) {
      w.t += dt;
      w.x += dir * SPEED * dt;
      eachStanding(() => {
        if (w.struck.has(heroSlot()) || !boxHit([w.x - 4, GROUND - 7, w.x + 4, GROUND + 2], heroBox())) return;
        w.struck.add(heroSlot());
        hurtHero(damage, w.x - dir * 10);
      });
      if (rng.chance(0.45))
        particles.spawn(PK.EMBER, w.x + rng.range(-2, 2), GROUND - rng.range(1, 6), dir * 10, -rng.range(14, 30), 0.5, {
          sparks: RUNE_SPARKS,
        });
      const end = Math.abs(w.x - x0) > REACH || w.x < -4 || w.x > W + 4;
      return !end;
    },
    draw() {
      place();
      const run = Math.abs(w.x - x0);
      // the wave swells up as it starts and sinks back into the floor at the end of its run
      const swell = Math.min(1, w.t * 8) * Math.min(1, (REACH - run) / 30);
      const fade = Math.min(1, swell * 2);
      // the runes it has passed over still burn on the floor, rising a little as they die
      for (let n = 1; n * BRAND.every < run; n++) {
        const age = (run - n * BRAND.every) / SPEED / BRAND.life;
        if (age >= 1) continue;
        const g = GLYPHS[n % GLYPHS.length];
        const gx = Math.round(x0 + dir * n * BRAND.every) - 1;
        const gy = GROUND - 5 - age * BRAND.rise;
        g.forEach((row, j) => {
          for (let i = 0; i < 3; i++)
            if (row[i] === "#") px(gx + i, gy + j, RUNE_RAMP[age < 0.3 ? 4 : age < 0.6 ? 3 : 2], (1 - age) * fade);
        });
        glow(gx + 1, gy + 2, 6, RUNE_RAMP[2], 0.3 * (1 - age) * fade);
      }
      // the wave: a crest that leans into its run and a ragged back falling away behind it
      const height = (i: number): number =>
        Math.max(0.5, ((1 - i / TRAIL) ** 1.3 * CREST.height + Math.sin(w.t * 30 + i * 1.7) * CREST.wobble) * swell);
      const outline: (readonly [number, number])[] = [[w.x + dir * CREST.lead, GROUND]];
      for (let i = 0; i <= TRAIL; i += 2) outline.push([w.x - dir * i, GROUND - height(i)]);
      outline.push([w.x - dir * TRAIL, GROUND]);
      polygon(
        outline,
        (sx, sy = 0) => {
          const behind = ((w.x - sx) * dir) / TRAIL;
          const up = (GROUND - sy) / CREST.height;
          return RUNE_RAMP[Math.min(4, Math.max(1, 1 + Math.floor((1 - behind) * 2.4 + up * 1.6 - 0.6)))];
        },
        fade,
      );
      hairline(w.x + dir * CREST.lead, GROUND - 0.5, w.x, GROUND - height(0), WHITE, fade);
      hairline(
        w.x + dir * CREST.lead,
        GROUND - 0.25,
        w.x - dir * TRAIL,
        GROUND - 0.25,
        (u) => RUNE_RAMP[u < 0.4 ? 4 : 3],
        (u) => fade * (1 - u),
      );
      for (let i = 0; i < 3; i++) {
        const lift = ((w.t * 3 + i / 3) % 1) * 7;
        fleck(w.x - dir * (2 + i * 4), GROUND - height(2 + i * 4) - lift, WHITE, fade * (1 - lift / 7));
      }
      const g = GLYPHS[Math.floor(w.t * 14) % GLYPHS.length];
      const gx = Math.round(w.x + dir * 1) - 1;
      const lift = (9 + Math.sin(w.t * 20) * 1) * swell;
      g.forEach((row, j) => {
        for (let i = 0; i < 3; i++) {
          if (row[i] !== "#") continue;
          px(gx + i, GROUND - lift - 4 + j, WHITE, fade);
          fleck(gx + i + 1, GROUND - lift - 3.5 + j, RUNE_RAMP[3], fade);
        }
      });
      glow(w.x, GROUND - 4, 16, RUNE_RAMP[3], 0.5 * swell);
      glowLine(w.x, GROUND - 1, w.x - dir * TRAIL, GROUND - 1, 9, RUNE_RAMP[2], 0.3 * swell);
    },
  };
}
