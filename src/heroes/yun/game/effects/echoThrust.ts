import { COMBO } from "../../../../constants/combat";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyBox, enemyCenter } from "../../../../game/enemies/enemy";
import { game, hero, progress } from "../../../../game/state";
import { boxHit } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Box } from "../../../../types/world";
import { clamp, ease } from "../../../../utils/math";
import { ECHO } from "../../constants/swords";
import { JADE_SPARKS } from "../../look";
import { drawSpiritSword } from "../art/spiritSword";
import type { SwordPlace } from "../hover";

/** one sword's echo: how far it reaches, how hard it strikes and whether the strike is a sure critical hit */
export interface EchoThrust {
  from: SwordPlace;
  /** seconds before it leaves, so the swords go one after another */
  delay: number;
  /** pixels ahead of Yun its point reaches, and its height from his feet */
  reach: number;
  height: number;
  power: number;
  crit: boolean;
}

/**
 * Sword Echo: a held spirit sword leaves its place behind Yun, thrusts straight ahead along his facing to `reach`, holds
 * a beat and flies back. As its point arrives it strikes every foe in the line from `ECHO.near` to its reach once; it
 * is not a sword blow of his hand, so guards do not stop it.
 */
export function createEchoThrust(o: EchoThrust): Effect {
  const face = hero.face;
  const baseX = hero.x;
  const baseY = hero.y;
  const tip = { x: o.from.x, y: o.from.y };
  const out = ECHO.out;
  const total = o.delay + out + ECHO.hold + ECHO.back;
  let t = 0;
  let struck = false;
  const target = (): [number, number] => [baseX + face * o.reach, baseY + o.height];
  return {
    update(dt) {
      t += dt;
      const [tx, ty] = target();
      const local = t - o.delay;
      if (local < 0) return true;
      if (local < out) {
        const u = ease.outCubic(local / out);
        tip.x = o.from.x + (tx - o.from.x) * u;
        tip.y = o.from.y + (ty - o.from.y) * u;
      } else if (local < out + ECHO.hold) {
        tip.x = tx;
        tip.y = ty;
      } else {
        const u = clamp((local - out - ECHO.hold) / ECHO.back);
        tip.x = tx + (o.from.x - tx) * u;
        tip.y = ty + (o.from.y - ty) * u;
      }
      if (!struck && local >= out) {
        struck = true;
        strike(baseX, baseY, face, o);
      }
      return t < total;
    },
    draw() {
      const local = t - o.delay;
      if (local < 0) return;
      const angle = face > 0 ? 0 : Math.PI;
      const goingBack = local > out + ECHO.hold;
      const k = goingBack ? 1 - clamp((local - out - ECHO.hold) / ECHO.back) * 0.6 : 1;
      drawSpiritSword(tip.x, tip.y, angle, k);
    },
  };
}

/** the thrust's line: from the near end to its reach, over the height of a foe on the floor */
function strike(x: number, y: number, face: number, o: EchoThrust): void {
  const near = x + face * ECHO.near;
  const far = x + face * o.reach;
  const box: Box = [Math.min(near, far), y + ECHO.top, Math.max(near, far), y + ECHO.low];
  for (const e of game.enemies) {
    if (e.hp <= 0 || !boxHit(box, enemyBox(e))) continue;
    dealDamage(e, progress.stats.ad * o.power, {
      fromX: x,
      kx: face * ECHO.push,
      stagger: COMBO.stagger,
      sureCrit: o.crit,
    });
    const [ex, ey] = enemyCenter(e);
    game.fx.push(createImpact(ex, ey, face, false, JADE_SPARKS));
  }
}
