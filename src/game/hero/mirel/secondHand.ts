import { SECOND_HAND } from "../../../constants/mirel/abilities";
import { PAL, SPARKS } from "../../../constants/palette";
import { glow, line, place, px } from "../../../engine/frame";
import { sfx } from "../../../services/audio";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { emitSkillEvent } from "../../skills/events";
import { game, hero, progress } from "../../state";
import { setState } from "../actions";
import { canCast } from "./castCheck";
import { mirel } from "./memory";

/** the hand's length, pixels */
const LENGTH = 8;

/** a thin clock hand flying straight ahead through foes, each once, up to its pierce, chilling them */
function createSecondHand(x: number, y: number, dir: number): Effect {
  let flown = 0;
  let px0 = x;
  const struck = new Set<Enemy>();
  return {
    update(dt) {
      const step = SECOND_HAND.speed * dt;
      flown += step;
      px0 += dir * step;
      for (const e of game.enemies) {
        if (e.hp <= 0 || struck.has(e) || struck.size >= SECOND_HAND.pierce) continue;
        const b = enemyBox(e);
        if (px0 < b[0] - 2 || px0 > b[2] + 2 || y < b[1] - 3 || y > b[3] + 3) continue;
        struck.add(e);
        dealDamage(e, progress.stats.ap * SECOND_HAND.power, {
          fromX: px0 - dir * 6,
          kx: dir * 40,
          source: "abilities",
        });
        e.chill = Math.max(e.chill, SECOND_HAND.chill);
        const [cx, cy] = enemyCenter(e);
        game.fx.push(createImpact(cx, cy, dir, false, SPARKS.hour));
      }
      return flown < SECOND_HAND.range && struck.size < SECOND_HAND.pierce;
    },
    draw() {
      place();
      const tail = px0 - dir * LENGTH;
      for (let i = 1; i <= 3; i++) px(tail - dir * i * 3, y, PAL.hour[3], 0.5 - i * 0.12);
      line(tail, y, px0, y, PAL.hour[4]);
      px(px0, y, PAL.hour[5]);
      px(tail + dir, y - 1, PAL.hour[2]);
      px(tail + dir, y + 1, PAL.hour[2]);
      glow(px0, y, 8, PAL.hour[3], 0.35);
    },
  };
}

/** I with Second Hand */
export function pressSecondHand(): boolean {
  if (!canCast(mirel.handCd, SECOND_HAND.mp)) return true;
  hero.mp -= SECOND_HAND.mp;
  mirel.handCd = SECOND_HAND.cooldown;
  mirel.casting = "secondHand";
  if (hero.ground) hero.vx = 0;
  setState("handCast");
  sfx.cast();
  emitSkillEvent({ type: "cast", ability: "secondHand" });
  return true;
}

/** the cast: the hand leaves the staff's ring on its frame */
export function runHandCast(): void {
  const h = hero;
  if (!h.hitDone && h.st >= SECOND_HAND.hit) {
    h.hitDone = true;
    game.fx.push(createSecondHand(h.x + h.face * 14, h.y - 18, h.face));
    sfx.swing(1.6);
  }
  if (h.st >= SECOND_HAND.dur) setState(h.ground ? "idle" : "fall");
}
