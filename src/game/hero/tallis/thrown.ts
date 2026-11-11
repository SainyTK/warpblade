import { place } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import type { KnifeBlow } from "../../../types/tallis";
import { dealDamage } from "../../damage";
import { enemyBox } from "../../enemies/enemy";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { boxHit } from "../../world";
import { drawSpinningKnife } from "./blades";

/** a thrown knife's speed */
const SPEED = 280;
/** the angles of Knife Storm's fan */
const FAN = [-0.22, 0, 0.22] as const;

/** one knife flying straight from his hand, through as many foes as its pierce allows */
function throwKnife(angle: number): void {
  const v = skillValues("t_quickKnives");
  const range = withCharms("area", v.range);
  const face = hero.face;
  let x = hero.x + face * 6;
  let y = hero.y - 16;
  let flown = 0;
  let left = 1 + (v.pierce ?? 0);
  const hit: Enemy[] = [];
  const vx = Math.cos(angle) * SPEED * face;
  const vy = Math.sin(angle) * SPEED;
  game.fx.push({
    update(dt) {
      x += vx * dt;
      y += vy * dt;
      flown += SPEED * dt;
      for (const e of game.enemies) {
        if (e.hp <= 0 || hit.includes(e) || !boxHit([x - 2, y - 1, x + 2, y + 1], enemyBox(e))) continue;
        hit.push(e);
        dealDamage(e, progress.stats.ad * v.knife, { fromX: x - face * 8, kx: face * 20 });
        left--;
        if (left <= 0) return false;
      }
      return flown < range;
    },
    draw() {
      place();
      drawSpinningKnife(x, y, face, flown);
    },
  });
}

/** Quick Knives: Heel Kick throws a knife, then Flick and Cross too, and Knife Storm throws a fan with every blow */
export function throwKnives(blow: KnifeBlow): void {
  const v = skillValues("t_quickKnives");
  if (!v.power) return;
  if (v.storm) {
    for (const a of FAN) throwKnife(a);
    return;
  }
  const throws = (blow === "heelKick" && v.heel) || ((blow === "flick" || blow === "cross") && v.all);
  if (throws) throwKnife(0);
}
