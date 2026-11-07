import { GROUND, W } from "../../constants/stage";
import { ULT_LEVELS } from "../../constants/ultimate";
import { sfx } from "../../services/audio";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { dealDamage } from "../damage";
import { createImpact } from "../effects/impact";
import { createSlash } from "../effects/slash";
import { enemyCenter } from "../enemies/enemy";
import { game, hero, progress, rng } from "../state";
import { hitStop, shake } from "../world";
import { ultSpan, ultTargets } from "./targets";

const CUTS_PER_FOE = [2, 3, 4, 6] as const;
const LOOSE_CUTS = [4, 8, 14, 30] as const;

interface Cut {
  at: number;
  x: number;
  y: number;
  foe: Enemy | null;
  done: boolean;
}

function slashAt(x: number, y: number, big: boolean): void {
  const R = big ? rng.range(16, 24) : rng.range(10, 18);
  const a0 = rng.range(-3, -1.5);
  game.fx.push(
    createSlash(x, y, rng.chance(0.5) ? 1 : -1, {
      cx: 0,
      cy: 0,
      R,
      sy: rng.range(0.25, 0.8),
      rot: rng.range(-1.2, 1.2),
      a0,
      a1: a0 + rng.range(2.6, 3.4),
      W: big ? 8 : 5,
      sweep: 0.04,
      hold: 0.03,
      trail: 0.16,
    }),
  );
}

/** Thousand Edges: crescents flash across every foe in reach, each landing a share of the damage */
export function castThousandEdges(level: number): void {
  const foes = ultTargets(level);
  const dur = 0.35 + 0.2 * level;
  const per = CUTS_PER_FOE[level - 1];
  const damage = (ULT_LEVELS[level - 1].power * progress.stats.ad) / per;
  const [x0, x1] = ultSpan(level);
  const cuts: Cut[] = [];
  for (const foe of foes)
    for (let i = 0; i < per; i++) cuts.push({ at: (dur * (i + rng.next())) / per, x: 0, y: 0, foe, done: false });
  for (let i = 0; i < LOOSE_CUTS[level - 1]; i++)
    cuts.push({
      at: rng.range(0, dur),
      x: rng.range(x0, x1),
      y: rng.range(GROUND - 60, GROUND - 6),
      foe: null,
      done: false,
    });
  let t = 0;
  let finale = level < 4;
  const effect: Effect = {
    update(dt) {
      t += dt;
      for (const c of cuts) {
        if (c.done || t < c.at) continue;
        c.done = true;
        if (!c.foe) {
          slashAt(c.x, c.y, false);
          continue;
        }
        if (c.foe.hp <= 0) continue;
        const [ex, ey] = enemyCenter(c.foe);
        slashAt(ex + rng.range(-4, 4), ey + rng.range(-4, 4), true);
        game.fx.push(createImpact(ex, ey, rng.chance(0.5) ? 1 : -1, false));
        dealDamage(c.foe, damage, { fromX: hero.x, kx: 0, ky: -20, heavy: true, source: "ultimate" });
        sfx.hit(false);
      }
      if (!finale && t >= dur) {
        finale = true;
        game.fx.push(
          createSlash(W / 2, GROUND - 40, 1, {
            cx: 0,
            cy: 0,
            R: 170,
            sy: 0.12,
            rot: -0.12,
            a0: -2.9,
            a1: 0.25,
            W: 14,
          }),
        );
        hitStop(0.12);
        shake(0.4, 4);
      }
      return t < dur + 0.05;
    },
    draw() {},
  };
  game.fx.push(effect);
}
