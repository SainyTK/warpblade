import { W } from "../../constants/stage";
import { ULT_LEVELS } from "../../constants/ultimate";
import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import { WHITE } from "../../utils/color";
import { dealDamage } from "../damage";
import { createCrossbowBolt } from "../effects/crossbowBolt";
import { createGlint } from "../effects/flash";
import { createImpact } from "../effects/impact";
import { enemyCenter } from "../enemies/enemy";
import { skin } from "../hero/skin";
import { game, hero, lights, progress } from "../state";
import { hitStop, shake } from "../world";
import { foesOnSegment } from "./segmentHits";
import { ultTargets } from "./targets";

/** the bolt flies at her eye line */
const EYE = 18;
const SPEED = 900;

/** Deadeye: one heavy bolt the length of the stage through every foe in the line. Level 3 looses one each way, and at
 *  level 4 every foe on the screen also takes a bolt aimed at its heart. Grows with attack damage. */
export function castDeadeye(level: number): void {
  const damage = ULT_LEVELS[level - 1].power * progress.stats.ad;
  const struck = new Set<Enemy>();
  const hit = (e: Enemy, dir: number) => {
    struck.add(e);
    const [cx, cy] = enemyCenter(e);
    dealDamage(e, damage, { fromX: hero.x, kx: dir * 160, ky: -50, stun: 0.6, heavy: true, source: "ultimate" });
    game.fx.push(createImpact(cx, cy, dir, true));
    lights.add(cx, cy, 30, skin.ramp[5], 0.9, 0.2);
    sfx.hit(true, 0.9);
    hitStop(0.03);
  };
  const y = hero.y - EYE;
  game.fx.push(createGlint(hero.x + hero.face * 12, y, WHITE));
  const dirs = level >= 3 ? [hero.face, -hero.face] : [hero.face];
  for (const dir of dirs) {
    game.fx.push(
      createCrossbowBolt({
        x: hero.x + dir * 12,
        y,
        angle: dir > 0 ? 0 : Math.PI,
        ramp: skin.ramp,
        primed: true,
        heavy: true,
        bounces: 0,
        speed: SPEED,
        range: W,
        pass(ax, ay, bx, by) {
          for (const e of foesOnSegment(ax, ay - 3, bx, by - 3, struck)) hit(e, dir);
          for (const e of foesOnSegment(ax, ay + 3, bx, by + 3, struck)) hit(e, dir);
          return false;
        },
      }),
    );
  }
  shake(0.3, 3);
  sfx.boom();
  if (level < 4) return;
  ultTargets(level).forEach((e, i) => {
    const [cx, cy] = enemyCenter(e);
    const sx = hero.x;
    const sy = hero.y - 40;
    game.fx.push(
      createCrossbowBolt({
        x: sx,
        y: sy,
        angle: Math.atan2(cy - sy, cx - sx),
        ramp: skin.ramp,
        primed: true,
        bounces: 0,
        delay: 0.25 + i * 0.04,
        speed: SPEED,
        range: W * 1.2,
        pass(ax, ay, bx, by) {
          const caught = foesOnSegment(ax, ay, bx, by, struck).find((f) => f === e);
          if (!caught) return false;
          hit(e, Math.sign(cx - sx) || 1);
          return true;
        },
      }),
    );
  });
}
