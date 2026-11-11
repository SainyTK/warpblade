import { place } from "../../../../engine/frame";
import type { Enemy } from "../../../../types/enemy";
import { dealDamage } from "../../../damage";
import { enemyBox, enemyCenter } from "../../../enemies/enemy";
import { addStacks } from "../../../enemies/skillStatus";
import { skillValues, withCharms } from "../../../skills/query";
import { foesOnScreen } from "../../../skills/targets";
import { game, hero, progress } from "../../../state";
import { boxHit } from "../../../world";
import { drawNeedle } from "../blades";
import { strikeFrom } from "../marks";

const ID = "t_needles";
/** a needle's speed, and the fan's spread either side of straight ahead */
const SPEED = 320;
const SPREAD = 0.42;
/** Iron Rain's needles fall from this high above their foe, this fast */
const RAIN = { height: 70, speed: 380 } as const;

/** a needle strikes: ability power, and a bleed with its level */
function prick(e: Enemy, x: number): void {
  const v = skillValues(ID);
  dealDamage(e, progress.stats.ap * v.power, {
    fromX: strikeFrom(e, x),
    kx: Math.sign(e.x - x) * 15,
    source: "abilities",
  });
  if (v.chill) e.chill = Math.max(e.chill, 1);
  if (v.bleed)
    addStacks(e, ID, {
      stacks: 1,
      max: 5,
      damage: progress.stats.ap * 0.08,
      every: 1,
      duration: withCharms("duration", 3),
    });
}

/** one needle flying from (x, y) at this angle until its range, through foes once it pierces */
function needle(x0: number, y0: number, vx: number, vy: number, range: number, pierce: boolean): void {
  let x = x0;
  let y = y0;
  let flown = 0;
  const hit: Enemy[] = [];
  const speed = Math.hypot(vx, vy);
  game.fx.push({
    update(dt) {
      x += vx * dt;
      y += vy * dt;
      flown += speed * dt;
      for (const e of game.enemies) {
        if (e.hp <= 0 || hit.includes(e) || !boxHit([x - 1.5, y - 1.5, x + 1.5, y + 1.5], enemyBox(e))) continue;
        hit.push(e);
        prick(e, x - Math.sign(vx) * 6);
        if (!pierce) return false;
      }
      return flown < range;
    },
    draw() {
      place();
      drawNeedle(x, y, vx / Math.max(1, speed), vy / Math.max(1, speed));
    },
  });
}

/**
 * Needle Fan: a fan of needles thrown ahead out to its range; with its levels they pierce, grow in number, bleed and
 * recharge sooner. Iron Rain drops a needle from above on every foe on screen as well.
 */
export function castNeedles(): void {
  const v = skillValues(ID);
  const n = Math.round(withCharms("amount", v.count));
  const range = withCharms("area", v.range);
  const x = hero.x + hero.face * 6;
  const y = hero.y - 15;
  for (let i = 0; i < n; i++) {
    const a = n > 1 ? -SPREAD + (2 * SPREAD * i) / (n - 1) : 0;
    needle(x, y, Math.cos(a) * SPEED * hero.face, Math.sin(a) * SPEED * 0.6, range, !!v.pierce);
  }
  if (!v.ironRain) return;
  for (const e of foesOnScreen()) {
    const [cx, cy] = enemyCenter(e);
    needle(cx, cy - RAIN.height, 0, RAIN.speed, RAIN.height + 12, false);
  }
}
