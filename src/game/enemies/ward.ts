import { DAMAGE_NUMBERS } from "../../constants/damageNumbers";
import { SPARKS } from "../../constants/palette";
import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import { createImpact } from "../effects/impact";
import { game } from "../state";
import { enemyBox, enemyCenter } from "./enemy";
import { kindOf } from "./kinds";

/** a foe whose kind says nothing can hurt it right now */
export const isWarded = (e: Enemy): boolean => kindOf(e.type).warded?.(e) ?? false;

/**
 * A hit turned away by a ward: no damage, no stagger, no Flow. A loud hit (a hero's own blow, not damage over time)
 * shows sparks and one word over the foe, which stays up while more hits keep coming.
 */
export function turnAway(e: Enemy, loud: boolean): void {
  if (!loud) return;
  const shown = game.numbers.find((n) => n.foe === e && n.tag === "warded");
  if (shown) {
    if (shown.age < DAMAGE_NUMBERS.merge) return;
    shown.age = 0;
  } else {
    const box = enemyBox(e);
    game.numbers.push({
      x: (box[0] + box[2]) / 2,
      y: box[1] - 2,
      vy: -20,
      value: 0,
      tag: "warded",
      big: false,
      quiet: false,
      foe: e,
      life: DAMAGE_NUMBERS.life,
      age: 0,
    });
  }
  const [cx, cy] = enemyCenter(e);
  game.fx.push(createImpact(cx - e.face * 6, cy, -e.face, false, SPARKS.hot));
  sfx.block();
}
