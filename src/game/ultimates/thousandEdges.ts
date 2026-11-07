import { GROUND, W } from "../../constants/stage";
import { ULT_LEVELS } from "../../constants/ultimate";
import { sfx } from "../../services/audio";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { dealDamage } from "../damage";
import { createImpact } from "../effects/impact";
import { createSlash } from "../effects/slash";
import { enemyCenter } from "../enemies/enemy";
import { kael } from "../hero/kael/state";
import { skillEvolved, skillValues } from "../skills/query";
import { game, hero, progress, rng } from "../state";
import { hitStop, shake } from "../world";
import { ultSpan, ultTargets } from "./targets";

const CUTS_PER_FOE = [2, 3, 4, 6] as const;
const LOOSE_CUTS = [4, 8, 14, 30] as const;
const SKILL = "k_edges";
/** Thousand Edges' longer storm: this much longer, with this many more cuts on each foe */
const LONGER = { time: 0.6, cuts: 3 } as const;
/** how hard the storm draws foes to its middle */
const PULL = 140;
/** Endless Edges: the storm round Kael cuts every foe this close, this often, each cut this share of the level's power */
const FOLLOW = { reach: 70, every: 0.2, share: 0.15 } as const;

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

/** the great sword that falls last: a tall crescent on each foe still standing, the share of the power again */
function greatSword(foes: readonly Enemy[], damage: number): void {
  for (const foe of foes) {
    if (foe.hp <= 0) continue;
    const [ex, ey] = enemyCenter(foe);
    game.fx.push(
      createSlash(ex, ey, 1, { cx: 0, cy: -10, R: 30, sy: 0.25, rot: Math.PI / 2, a0: -1.2, a1: 1.2, W: 12 }),
    );
    game.fx.push(createImpact(ex, ey, 1, true));
    dealDamage(foe, damage, { fromX: hero.x, ky: -40, heavy: true, stun: 0.6, source: "ultimate" });
  }
  hitStop(0.1);
  shake(0.35, 4);
}

/** Endless Edges: for a while the storm follows Kael, cutting every foe close to him; each Keen blow adds a volley */
function createFollowStorm(seconds: number, damage: number): Effect {
  let t = 0;
  let next = 0;
  kael.stormLeft = seconds;
  return {
    update(dt) {
      t += dt;
      next -= dt;
      kael.stormLeft = Math.max(0, seconds - t);
      const volleys = kael.stormVolleys;
      kael.stormVolleys = 0;
      if (next > 0 && volleys === 0) return t < seconds;
      if (next <= 0) next = FOLLOW.every;
      for (const foe of game.enemies) {
        if (foe.hp <= 0 || Math.abs(foe.x - hero.x) > FOLLOW.reach) continue;
        const [ex, ey] = enemyCenter(foe);
        slashAt(ex + rng.range(-4, 4), ey + rng.range(-4, 4), false);
        dealDamage(foe, damage * (1 + volleys), { fromX: hero.x, kx: 0, ky: -10, source: "ultimate" });
      }
      return t < seconds;
    },
    draw() {},
  };
}

/** Thousand Edges: crescents flash across every foe in reach, each landing a share of the damage; its levels draw foes
 *  in, reach both sides sooner, cut longer, and end with a great sword */
export function castThousandEdges(level: number): void {
  const v = skillValues(SKILL);
  const both = v.both ? 2 : 3;
  const foes = ultTargets(level, both);
  const dur = 0.35 + 0.2 * level + (v.longer ? LONGER.time : 0);
  const per = CUTS_PER_FOE[level - 1] + (v.longer ? LONGER.cuts : 0);
  const power = ULT_LEVELS[level - 1].power * progress.stats.ad * (v.power ?? 1);
  const damage = (power * (v.longer ? per / CUTS_PER_FOE[level - 1] : 1)) / per;
  const [x0, x1] = ultSpan(level, both);
  if (v.pull) for (const foe of foes) foe.vx += Math.sign((x0 + x1) / 2 - foe.x) * PULL;
  if (skillEvolved(SKILL)) game.fx.push(createFollowStorm(v.follow, power * FOLLOW.share));
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
  let greatDone = false;
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
      if (!greatDone && t >= dur) {
        greatDone = true;
        if (v.greatsword) greatSword(foes, power * v.greatsword);
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
