import { ENEMY_AIR } from "../../../constants/combat";
import { PAL } from "../../../constants/palette";
import { GROUND } from "../../../constants/stage";
import { hairline, place } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { launchEnemy } from "../../enemies/airborne";
import { enemyBox } from "../../enemies/enemy";
import { kindOf } from "../../enemies/kinds";
import { lodge } from "../../skills/kael/crystalSplinters";
import { skillEvolved, skillLevel, skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { shake } from "../../world";
import { drawCrystal } from "./art/crystal";

const SKILL = "k_reap";
/** flying foes this high over the sweep are pulled down */
const FLYER_HEIGHT = 70;
/** Crystal Harvest's tide: how long it takes to run out, and how hard it drags a foe for each pixel away it stands */
const TIDE = { run: 0.3, drag: 5 } as const;
/** the crystals riding the front of the tide: how many, the gap between them, the first one's height and the drop to the next */
const TIDE_CREST = { count: 5, gap: 6, height: 11, drop: 1.8 } as const;

/** Reaping Sweep: the sweep is out; from level 6 flying foes over it are pulled down, and as Crystal Harvest a crystal
 *  tide runs out both ways along the floor */
export function afterSweep(): void {
  const v = skillValues(SKILL);
  const reach = withCharms("area", v.reach);
  if (v.flyers)
    for (const e of game.enemies)
      if (e.hp > 0 && kindOf(e.type).flies && Math.abs(e.x - hero.x) <= reach && hero.y - e.y <= FLYER_HEIGHT)
        pullDown(e);
  if (skillEvolved(SKILL)) game.fx.push(createTide(hero.x, hero.y, withCharms("area", v.tide)));
}

/** a flying foe is thrown down to the floor, where it bounces and lies stunned */
function pullDown(e: Enemy): void {
  launchEnemy(e, 0);
  e.vy = ENEMY_AIR.spike;
}

/** Crystal Harvest: a tide of crystal runs out both ways along the floor, dragging each foe it reaches to Kael's feet,
 *  cutting it and lodging splinters */
function createTide(x: number, y: number, reach: number): Effect {
  const struck = new Set<Enemy>();
  const v = skillValues(SKILL);
  const damage = progress.stats.ad * v.power;
  let t = 0;
  shake(0.18, 2);
  return {
    update(dt) {
      t += dt;
      const r = reach * Math.min(1, t / TIDE.run);
      for (const e of game.enemies) {
        if (e.hp <= 0 || struck.has(e)) continue;
        const [x0, , x1, y1] = enemyBox(e);
        if (x1 < x - r || x0 > x + r || y1 < y - 30) continue;
        struck.add(e);
        e.vx += Math.sign(x - e.x) * Math.abs(x - e.x) * TIDE.drag;
        dealDamage(e, damage, { fromX: x, kx: 0, stun: 0.6 });
        if (skillLevel("k_splinters")) lodge(e, v.tideSplinters);
      }
      return t < TIDE.run + 0.25;
    },
    draw() {
      place();
      const C = PAL.crystal;
      const r = reach * Math.min(1, t / TIDE.run);
      const k = 1 - Math.max(0, t - TIDE.run) / 0.25;
      for (const side of [-1, 1]) {
        const tip = x + side * r;
        hairline(x, GROUND - 0.25, tip, GROUND - 0.25, C[4], (u) => k * (0.3 + 0.7 * u));
        hairline(x, GROUND + 0.25, tip, GROUND + 0.25, C[2], k * 0.6);
        // the crest of the tide: crystals leaning the way it runs, tallest at the front
        for (let i = TIDE_CREST.count - 1; i >= 0; i--) {
          const sx = tip - side * i * TIDE_CREST.gap;
          if ((sx - x) * side < 0) continue;
          drawCrystal(sx, GROUND, TIDE_CREST.height - i * TIDE_CREST.drop, 2.2, side * 2.5, C, 1 - i * 0.08, k);
        }
      }
    },
  };
}
