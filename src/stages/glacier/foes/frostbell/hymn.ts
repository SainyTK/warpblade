import { ellipseRing, glow, hairline, place } from "../../../../engine/frame";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { fxRng, game, particles } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { clamp, TAU } from "../../../../utils/math";
import { BELL_COLORS } from "./colors";
import { BELL } from "./constants";

const LINK = 0.5;

export const hymnAllies = (e: Enemy): Enemy[] =>
  game.enemies.filter(
    (o) => o !== e && o.hp > 0 && o.type !== "frostbell" && Math.hypot(o.x - e.x, o.y - e.y) < BELL.hymnReach,
  );

function createWard(bell: Enemy, ally: Enemy): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return ally.hp > 0 && t < BELL.hymnBrace;
    },
    draw() {
      const [cx, cy] = enemyCenter(ally);
      const fade = 1 - clamp((t - BELL.hymnBrace + 0.6) / 0.6);
      const pulse = 1 + Math.sin(t * 6) * 0.08;
      place(cx, cy);
      ellipseRing(0, 0, 10 * pulse, 3.5 * pulse, BELL_COLORS.rune[1], 0.55 * fade);
      glow(0, 0, 12, BELL_COLORS.rune[0], 0.12 * fade);
      if (t < LINK) {
        const [bx, by] = enemyCenter(bell);
        place();
        hairline(bx, by, cx, cy, BELL_COLORS.rune[2], 1 - t / LINK);
      }
      place();
    },
  };
}

export function singHymn(e: Enemy): void {
  for (const ally of hymnAllies(e)) {
    ally.brace = Math.max(ally.brace, BELL.hymnBrace);
    ally.hp = Math.min(ally.max, ally.hp + ally.max * BELL.hymnMend);
    game.fx.push(createWard(e, ally));
  }
  sfx.chime(3);
  for (let i = 0; i < 14; i++) {
    const a = fxRng.range(0, TAU);
    particles.spawn(PK.MOTE, e.x, e.y + 4, Math.cos(a) * 70, Math.sin(a) * 70, 0.5, {
      col: BELL_COLORS.rune[1],
      size: 0.7,
    });
  }
}
