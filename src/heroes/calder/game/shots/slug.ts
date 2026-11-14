import { RES, W } from "../../../../constants/stage";
import { fleck, glow, hairline, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyBox } from "../../../../game/enemies/enemy";
import { emitSkillEvent } from "../../../../game/skills/events";
import { game } from "../../../../game/state";
import { boxHit } from "../../../../game/world";
import type { SourceId } from "../../../../types/build";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { PHOSPHOR, PHOSPHOR_SPARKS } from "../../constants/colors";
import { SLUG } from "../../constants/shots";

/** one slug in flight */
export interface SlugSpec {
  damage: number;
  /** a Breaker Slug: larger, breaks guards and drives every foe it passes back */
  wide: boolean;
  source?: SourceId;
}

/** how long the green tracer runs behind the slug, in pixels */
const TAIL = 30;

/**
 * A slug fired straight ahead from (x, y): it flies fast and pierces, striking each foe in its line once, and leaves a
 * green tracer behind it that fades.
 */
export function createSlug(x: number, y: number, face: number, spec: SlugSpec): Effect {
  const o = { x, t: 0 };
  const half = SLUG.half * (spec.wide ? SLUG.wide : 1);
  const struck = new Set<Enemy>();
  return {
    update(dt) {
      o.t += dt;
      o.x += face * SLUG.speed * dt;
      for (const e of game.enemies) {
        if (struck.has(e) || e.hp <= 0 || !boxHit([o.x - 4, y - half, o.x + 4, y + half], enemyBox(e))) continue;
        struck.add(e);
        dealDamage(e, spec.damage, {
          fromX: o.x - face * 10,
          kx: face * (spec.wide ? SLUG.wideKx : SLUG.kx),
          ky: -30,
          heavy: spec.wide,
          source: spec.source ?? "abilities",
        });
        game.fx.push(createImpact(o.x, y, face, spec.wide, PHOSPHOR_SPARKS));
        emitSkillEvent({ type: "calderBlast", x: o.x, y, foes: [e] });
      }
      return o.t < SLUG.life && o.x > -TAIL && o.x < W + TAIL;
    },
    draw() {
      place();
      const k = 1 - o.t / SLUG.life;
      const tail = Math.min(TAIL, Math.abs(o.x - x));
      const thick = spec.wide ? 2 : 1;
      for (let j = -thick; j <= thick; j++) {
        const row = y + j / RES;
        hairline(o.x, row, o.x - face * tail, row, j === 0 ? PHOSPHOR[5] : PHOSPHOR[3], (u) => k * (1 - u));
      }
      for (let j = -thick; j <= thick; j++) fleck(o.x + face * 0.5, y + j / RES, j === 0 ? WHITE : PHOSPHOR[5]);
      fleck(o.x + face, y, WHITE);
      glow(o.x, y, spec.wide ? 16 : 10, PHOSPHOR[4], 0.45);
    },
  };
}
