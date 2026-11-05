import { EMBER } from "../../constants/characters/ysra/look";
import { GROUND, PLATFORMS, W } from "../../constants/stage";
import { ULT_LEVELS, ULT_REACH } from "../../constants/ultimate";
import { sfx } from "../../services/audio";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { clamp } from "../../utils/math";
import { dealDamage } from "../damage";
import { emberBurst } from "../effects/emberBurst";
import { createEruption } from "../effects/eruption";
import { createFloorCrack, type FloorCrack } from "../effects/floorCrack";
import { createImpact } from "../effects/impact";
import { enemyBox, enemyCenter } from "../enemies/enemy";
import { game, hero, lights, progress, rng } from "../state";
import { boxHit, shake, surfaceBelow } from "../world";

const EDGE = 6;
/** pixels a second the crack runs; at level 4 it splits the whole floor faster */
const SPEED = [300, 300, 340, 440] as const;
/** a pillar every this many pixels along the crack, bursting a moment after the crack passes */
const GAP = 22;
const LAG = 0.08;
const HEIGHT = [38, 46, 54, 64] as const;
const WIDTH = 5;
/** at levels 1 and 2 the crack behind her runs this share of the way it runs ahead */
const BEHIND = 0.35;
/** level 4: once both cracks reach the walls, the whole floor erupts in taller pillars set between the first ones */
const SPLIT_HEIGHT = 92;
const SPLIT_WIDTH = 7;
const BURN = 3;

/** the stretch of floor she stands on: a platform's length, or the whole floor */
function floorSpan(floor: number): [number, number] {
  const p = PLATFORMS.find((q) => q.y === floor && hero.x >= q.x0 && hero.x <= q.x1);
  return p ? [p.x0 + 2, p.x1 - 2] : [EDGE, W - EDGE];
}

/**
 * Volcanic Rift: she drives the glaive into the floor and a crack runs out both ways from it, erupting in pillars of fire
 * that throw foes up and set them burning. Each foe takes the level's power once. At level 4 the crack splits the whole
 * floor from wall to wall, then all of it erupts at once.
 */
export function castVolcanicRift(level: number): void {
  const whole = level >= 4;
  const floor = whole ? GROUND : hero.ground ? hero.y : surfaceBelow(hero.x, hero.y);
  const [lo, hi] = whole ? [EDGE, W - EDGE] : floorSpan(floor);
  const x0 = clamp(hero.x, lo, hi);
  const damage = ULT_LEVELS[level - 1].power * progress.stats.ap;
  const struck = new Set<Enemy>();
  const erupt = (bx0: number, by0: number, bx1: number, by1: number) => {
    for (const e of game.enemies) {
      if (struck.has(e) || e.hp <= 0 || !boxHit(enemyBox(e), [bx0, by0, bx1, by1])) continue;
      struck.add(e);
      const [cx, cy] = enemyCenter(e);
      dealDamage(e, damage, { fromX: (bx0 + bx1) / 2, kx: 0, launch: -230, heavy: true });
      e.burn = Math.max(e.burn, BURN);
      game.fx.push(createImpact(cx, cy, Math.sign(cx - x0) || 1, true));
    }
  };
  const reach = ULT_REACH[level - 1];
  const ahead = whole ? W : reach;
  const behind = whole ? W : level >= 3 ? reach : reach * BEHIND;
  const speed = SPEED[level - 1];
  const ends = [hero.face, -hero.face].map((dir, i) => {
    const run = i === 0 ? ahead : behind;
    return clamp(x0 + dir * run, lo, hi);
  });
  emberBurst(x0, floor - 2, 18, null);
  lights.add(x0, floor, 60, EMBER[4], 0.8, 0.6);
  shake(0.3, 3);
  sfx.boom();
  const cracks: FloorCrack[] = ends.map((end) => createFloorCrack(x0, end, floor, speed));
  // each side's pillars, by how far along its crack they stand
  const pillars = ends.map((end) => {
    const dir = Math.sign(end - x0) || 1;
    const n = Math.floor(Math.abs(end - x0) / GAP);
    return Array.from({ length: n }, (_, k) => ({ at: (k + 1) * GAP, x: x0 + dir * (k + 1) * GAP, up: false }));
  });
  let split = !whole;
  const height = HEIGHT[level - 1];
  const effect: Effect = {
    update() {
      cracks.forEach((crack, side) => {
        for (const p of pillars[side]) {
          if (p.up || crack.front() < p.at) continue;
          p.up = true;
          game.fx.push(createEruption(p.x, floor, height, WIDTH, LAG, erupt));
          shake(0.12, 2);
          sfx.hit(true, 0.6);
        }
      });
      const ran = cracks.every((c, i) => c.front() >= Math.abs(ends[i] - x0));
      if (ran && !split) {
        split = true;
        game.flash = 0.12;
        shake(0.6, 6);
        sfx.boom();
        sfx.thunder();
        for (let x = lo + GAP / 2; x <= hi; x += GAP) {
          const at = x + rng.range(-5, 5);
          const tall = SPLIT_HEIGHT * rng.range(0.6, 1.1);
          game.fx.push(createEruption(at, floor, tall, SPLIT_WIDTH, LAG + Math.abs(at - x0) * 0.0006, erupt));
        }
      }
      return !ran || !split;
    },
    draw() {},
  };
  for (const c of cracks) game.fx.push(c);
  game.fx.push(effect);
}
