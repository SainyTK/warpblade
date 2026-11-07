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
import { markFoe } from "../enemies/skillStatus";
import { sable } from "../hero/sable/memory";
import { skin } from "../hero/skin";
import { skillValues } from "../skills/query";
import { game, hero, lights, progress } from "../state";
import { hitStop, shake } from "../world";
import { foesOnSegment } from "./segmentHits";
import { ultTargets } from "./targets";

/** the bolt flies at her eye line */
const EYE = 18;
const SPEED = 900;
/** the heavy bolt's wake strikes foes from a little above her eye line down to her shins, so short foes are hit too */
const REACH = [-4, 2, 8, 13] as const;
/** a kill splits the bolt this far up and down, in radians */
const SPLIT = 0.5;
/** a perfect reload this recent counts as just before the cast */
const PERFECT_RECENT = 1;

/** one heavy bolt along a line, striking every foe it passes once */
function heavyBolt(
  x: number,
  y: number,
  angle: number,
  hit: (e: Enemy, dir: number) => void,
  struck: Set<Enemy>,
): void {
  const dir = Math.cos(angle) >= 0 ? 1 : -1;
  game.fx.push(
    createCrossbowBolt({
      x,
      y,
      angle,
      ramp: skin.ramp,
      primed: true,
      heavy: true,
      bounces: 0,
      speed: SPEED,
      range: W,
      pass(ax, ay, bx, by) {
        for (const dy of REACH) for (const e of foesOnSegment(ax, ay + dy, bx, by + dy, struck)) hit(e, dir);
        return false;
      },
    }),
  );
}

/**
 * Deadeye: one heavy bolt the length of the stage through every foe in the line. Charge level 3 looses one each way,
 * and at charge level 4 every foe on the screen also takes a bolt aimed at its heart. The skill's level marks and pins
 * the foes it strikes, splits the bolt on a kill, doubles it after a perfect reload and brings it back sooner for each
 * kill; Heartseeker fires both ways and seeks every foe at every charge level. Grows with attack damage.
 */
export function castDeadeye(level: number): void {
  const v = skillValues("s_deadeye");
  const perfect = sable.sincePerfect <= PERFECT_RECENT ? (v.perfect ?? 1) : 1;
  const damage = ULT_LEVELS[level - 1].power * progress.stats.ad * (v.power ?? 1) * perfect;
  if (v.cooldown) hero.ultCd = v.cooldown;
  let refunded = 0;
  const struck = new Set<Enemy>();
  const hit = (e: Enemy, dir: number) => {
    struck.add(e);
    const [cx, cy] = enemyCenter(e);
    dealDamage(e, damage, { fromX: hero.x, kx: dir * 160, ky: -50, stun: 0.6, heavy: true, source: "ultimate" });
    if (v.mark) markFoe(e, v.markTime, v.mark);
    if (v.pin) e.pinned = Math.max(e.pinned, v.pin);
    game.fx.push(createImpact(cx, cy, dir, true));
    lights.add(cx, cy, 30, skin.ramp[5], 0.9, 0.2);
    sfx.hit(true, 0.9);
    hitStop(0.03);
    if (e.hp > 0) return;
    if (v.refund && refunded < v.refundCap) {
      const back = Math.min(v.refund, v.refundCap - refunded);
      refunded += back;
      hero.ultCd = Math.max(0, hero.ultCd - back);
    }
    if (v.split) for (const s of [-SPLIT, SPLIT]) heavyBolt(cx, cy, (dir > 0 ? 0 : Math.PI) + s * dir, hit, struck);
  };
  const y = hero.y - EYE;
  game.fx.push(createGlint(hero.x + hero.face * 12, y, WHITE));
  const dirs = level >= 3 || v.both ? [hero.face, -hero.face] : [hero.face];
  for (const dir of dirs) heavyBolt(hero.x + dir * 12, y, dir > 0 ? 0 : Math.PI, hit, struck);
  shake(0.3, 3);
  sfx.boom();
  if (level < 4 && !v.seek) return;
  ultTargets(4).forEach((e, i) => {
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
