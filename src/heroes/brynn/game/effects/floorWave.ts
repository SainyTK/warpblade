import { WORLD_COLORS } from "../../../../constants/palette";
import { RES } from "../../../../constants/stage";
import { fleck, glow, hairline, place } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyBox } from "../../../../game/enemies/enemy";
import { emitSkillEvent } from "../../../../game/skills/events";
import { game, particles, rng } from "../../../../game/state";
import { boxHit } from "../../../../game/world";
import type { SourceId } from "../../../../types/build";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { WHITE } from "../../../../utils/color";
import { grain } from "../../../../utils/grain";
import { CRIMSON, CRIMSON_SPARKS } from "../../constants/colors";
import { WAVE_LOOK, type WaveKind } from "../../constants/waves";
import "../../types/events";

/** what a floor wave does: where it starts, which way it runs, how far and fast, and what each foe it reaches takes */
export interface FloorWave {
  x: number;
  y: number;
  face: number;
  reach: number;
  speed: number;
  damage: number;
  stun?: number;
  launch?: number;
  source?: SourceId;
  kind: WaveKind;
  /** foes already struck by the blow that sent it, which it passes by; shared between waves of one cast */
  struck?: Set<Enemy>;
  /** called once for each foe it strikes, after the hit */
  onHit?: (e: Enemy) => void;
}

/** the life a wave's cracks fade over after the front stops */
const FADE = 0.2;

/**
 * A crimson wave that runs along the floor from Brynn's blade: a crest of light at its front, cracks left behind it,
 * rubble thrown up. It strikes each foe it reaches on the floor once and knocks it down or throws it up. It is not a
 * sword blow, so guards do not stop it.
 */
export function createFloorWave(w: FloorWave): Effect {
  const look = WAVE_LOOK[w.kind];
  const struck = w.struck ?? new Set<Enemy>();
  const seed = Math.floor(w.x * 13 + w.y);
  const o = { run: 0, t: 0, done: 0 };
  const front = () => w.x + w.face * o.run;
  const strike = () => {
    const fx = front();
    const box =
      w.face > 0
        ? [fx - look.width, w.y - look.height, fx + 2, w.y + 2]
        : [fx - 2, w.y - look.height, fx + look.width, w.y + 2];
    for (const e of game.enemies) {
      if (e.hp <= 0 || struck.has(e) || !boxHit(box as [number, number, number, number], enemyBox(e))) continue;
      struck.add(e);
      dealDamage(e, w.damage, {
        fromX: fx - w.face * 10,
        kx: w.face * 40,
        ky: -40,
        stun: w.stun,
        launch: w.launch,
        heavy: true,
        source: w.source,
      });
      game.fx.push(createImpact(fx, w.y - 8, w.face, false, CRIMSON_SPARKS));
      w.onHit?.(e);
    }
  };
  return {
    update(dt) {
      o.t += dt;
      if (o.run < w.reach) {
        o.run = Math.min(w.reach, o.run + w.speed * dt);
        strike();
        if (rng.chance(look.rubble))
          particles.spawn(
            PK.SHARD,
            front(),
            w.y - 1,
            w.face * rng.range(10, 60),
            rng.range(-150, -60),
            rng.range(0.3, 0.6),
            {
              col: WORLD_COLORS.rubble,
              size: rng.range(1, 2.4),
            },
          );
        if (front() > stageLeft() - 10 && front() < stageRight() + 10) return true;
        o.run = w.reach;
      }
      if (o.done === 0) emitSkillEvent({ type: "floorWave", x0: w.x, x1: front(), y: w.y, kind: w.kind });
      o.done += dt;
      return o.done < look.crack + FADE;
    },
    draw() {
      place();
      const fx = front();
      const moving = o.run < w.reach;
      const fade = moving ? 1 : Math.max(0, 1 - o.done / (look.crack + FADE));
      // the cracks behind the front, a jagged line in the floor that cools from bright to dark as it fades
      const steps = Math.floor(o.run / 3);
      for (let i = 0; i < steps; i++) {
        const x0 = w.x + w.face * i * 3;
        const x1 = x0 + w.face * 3;
        const j0 = (grain(i, seed) - 0.5) * 1.6;
        const j1 = (grain(i + 1, seed) - 0.5) * 1.6;
        const near = 1 - (o.run - i * 3) / Math.max(1, o.run);
        const c = CRIMSON[Math.max(1, Math.min(5, Math.round(1 + near * 3 * fade)))];
        hairline(x0, w.y + j0 * 0.5, x1, w.y + j1 * 0.5, c, fade);
      }
      if (!moving) return;
      // the crest: licks of light standing up off the floor at the front, tallest just behind it
      for (let s = 0; s < look.width * RES; s++) {
        const back = s / RES;
        const u = 1 - back / look.width;
        const h = look.crest * u * u * (0.55 + 0.45 * grain(s, seed + Math.floor(o.t * 30)));
        const x = fx - w.face * back;
        hairline(x, w.y - h, x, w.y, (v) => (v < 0.25 ? CRIMSON[5] : v < 0.6 ? CRIMSON[4] : CRIMSON[3]), u);
      }
      fleck(fx, w.y - look.crest * 0.6, WHITE);
      glow(fx - w.face * 3, w.y - 4, look.crest + 6, CRIMSON[3], 0.4);
    },
  };
}
