import { RES, W } from "../../constants/stage";
import { ULT_LEVELS } from "../../constants/ultimate";
import { PYRE_WALL } from "../../constants/ysra/fireLook";
import { glow, place, shade } from "../../engine/frame";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { PF, PK } from "../../types/particle";
import { grain } from "../../utils/grain";
import { ease } from "../../utils/math";
import { dealDamage } from "../damage";
import { createImpact } from "../effects/impact";
import { ignite } from "../enemies/burn";
import { enemyBox, enemyCenter } from "../enemies/enemy";
import { skin } from "../hero/skin";
import { game, hero, lights, particles, progress, rng } from "../state";
import { surfaceBelow } from "../world";

/** how far the wall rolls at each level; level 4 crosses the whole stage */
const RANGE = [90, 140, 200, 330] as const;
/** the special is the weakest ultimate: this share of a level's power */
const SHARE = 0.75;
/** seconds to roll its whole way */
const ROLL = 0.75;
const BURN = 3;
const MAX_FLOOR_FIRES = 24;
/** the light the front throws each step; several overlap, so each is dim enough for the wall to keep its colors */
const FRONT_LIGHT = 0.1;
/** the widest the drawn wall gets in art pixels, and how its height falls away behind the front, by image pixel */
const WALL_SPAN = PYRE_WALL.trail + PYRE_WALL.lead + PYRE_WALL.curl * 2 + 2;
const FALLOFF = Float32Array.from({ length: WALL_SPAN * RES }, (_, i) => Math.exp(-i / RES / PYRE_WALL.falloff));

/** Pyre Wave, Ysra's special: a wall of flame rolls out ahead of her, burning each foe it passes and leaving fires on the floor */
export function castPyreWave(level: number): void {
  const dir = hero.face;
  const x0 = hero.x + dir * 6;
  const floor = hero.ground ? hero.y : surfaceBelow(hero.x, hero.y);
  const reach = RANGE[level - 1];
  const tall = 20 + level * 7;
  const damage = ULT_LEVELS[level - 1].power * progress.stats.ad * SHARE;
  const struck = new Set<Enemy>();
  const licks = new Float32Array(WALL_SPAN * RES);
  let lastFire = x0;
  let t = 0;
  const front = () => x0 + dir * reach * ease.outCubic(Math.min(1, t / ROLL));
  const effect: Effect = {
    update(dt) {
      t += dt;
      const fx = front();
      const live = t < ROLL;
      if (live) {
        for (let i = 0; i < 6 + level * 2; i++)
          particles.spawn(
            PK.FIRE,
            fx - dir * rng.range(0, 8),
            floor - rng.range(0, tall * 0.7),
            dir * rng.range(10, 50),
            -rng.range(30, 90),
            rng.range(0.25, 0.55),
            { col: 0, size: rng.range(1.4, 2.6), flag: rng.chance(0.2) ? PF.SMOKES : 0 },
          );
        if (rng.chance(0.5))
          particles.spawn(PK.EMBER, fx, floor - rng.range(4, tall), dir * rng.range(20, 80), -rng.range(40, 100), 0.9);
        // fires stay on the floor behind the wall
        while (Math.abs(fx - lastFire) > 14 && game.blazes.length < MAX_FLOOR_FIRES) {
          lastFire += dir * 14;
          if (lastFire > 4 && lastFire < W - 4)
            game.blazes.push({ x: lastFire, y: floor, life: 2.4, max: 2.4, tick: 0 });
        }
        lights.add(fx, floor - tall / 2, 30, skin.ramp[3], FRONT_LIGHT, 0.08);
      }
      const lo = Math.min(x0, fx);
      const hi = Math.max(x0, fx);
      for (const e of game.enemies) {
        if (struck.has(e) || e.hp <= 0) continue;
        const box = enemyBox(e);
        if (box[2] < lo || box[0] > hi || box[3] < floor - tall - 6) continue;
        struck.add(e);
        const [cx, cy] = enemyCenter(e);
        dealDamage(e, damage, {
          fromX: hero.x,
          kx: dir * 160,
          ky: -90,
          launch: level >= 3 ? -150 : undefined,
          heavy: true,
          source: "ultimate",
        });
        ignite(e, BURN);
        game.fx.push(createImpact(cx, cy, dir, level >= 3));
      }
      return t < ROLL + 0.3;
    },
    draw() {
      place();
      const fx = front();
      const k = 1 - Math.max(0, (t - ROLL) / 0.3);
      const R = skin.ramp;
      const P = PYRE_WALL;
      const back = fx - dir * Math.min(P.trail, Math.abs(fx - x0));
      // the wall: tallest just behind its front, falling away behind it, its top torn into tongues that lick forward
      const ahead = fx + dir * (P.lead + P.curl);
      const left = Math.min(back, ahead);
      // each column's tongue is worked out once a frame, so the fill below does no trigonometry per pixel
      for (let i = 0; i < licks.length; i++) {
        const cx = left + i / RES;
        licks[i] = 0.74 + 0.16 * Math.sin(cx * 1.3 - t * P.lick * dir + Math.sin(cx * 0.37) * 2) + 0.1 * grain(i, 1);
      }
      shade(left, floor - tall - 2, Math.max(back, ahead), floor, (px, py, out) => {
        const rise = (floor - py) / tall;
        // the crest curls forward: the higher up, the further ahead of the front the fire stands
        const d = (fx - px) * dir + P.curl * rise * rise;
        const body = d < 0 ? 1 + d / P.lead : FALLOFF[Math.min(FALLOFF.length - 1, (d * RES) | 0)];
        if (body <= 0) return;
        const top = tall * k * body * licks[Math.min(licks.length - 1, Math.max(0, ((px - left) * RES) | 0))];
        const q = (floor - py) / top;
        if (q > 1) return;
        const heat = q < 0.1 && d < 5 ? 5 : q < 0.3 ? 4 : q < 0.6 ? 3 : q < 0.85 ? 2 : 1;
        out.c = R[heat];
        // the fire behind the front is thin enough to see a foe through it
        out.a = (q > 0.8 ? (1 - q) * 5 : 1) * (d > 10 ? P.thin : 1);
      });
      glow(fx, floor - tall / 2, tall * 0.7, R[2], 0.22 * k);
      glow((x0 + fx) / 2, floor - 6, Math.abs(fx - x0) / 2 + 10, skin.ramp[1], 0.18 * k);
    },
  };
  game.fx.push(effect);
}
