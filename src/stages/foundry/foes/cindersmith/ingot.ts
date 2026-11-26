import { GROUND } from "../../../../constants/stage";
import { ellipseRing, glow, hairline, place, polygon } from "../../../../engine/frame";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { shotWarded } from "../../../../game/shotWards";
import { fxRng, particles } from "../../../../game/state";
import { fieldPace } from "../../../../game/timeFields";
import { boxHit, dust, heroBox, shake } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { clamp } from "../../../../utils/math";
import { FORGE, FORGE_SPARKS } from "../../colors";

const GRAVITY = 420;
const SPLASH = { half: 8, height: 10 } as const;
const BODY = 3;

export function createIngot(x: number, y: number, tx: number, flight: number, damage: number): Effect {
  const target = clampStageX(tx, 8);
  const o = {
    x,
    y,
    vx: (target - x) / flight,
    vy: (GROUND - y - 0.5 * GRAVITY * flight * flight) / flight,
    t: 0,
    spin: 0,
  };
  const struck = new Set<number>();
  return {
    update(step) {
      const dt = step * fieldPace(o.x, o.y);
      o.t += dt;
      o.vy += GRAVITY * dt;
      o.x += o.vx * dt;
      o.y += o.vy * dt;
      o.spin += dt * 14 * Math.sign(o.vx || 1);
      if (shotWarded(o.x, o.y)) return false;
      if (fxRng.chance(0.6))
        particles.spawn(PK.EMBER, o.x, o.y, -o.vx * 0.1, -fxRng.range(4, 14), fxRng.range(0.2, 0.4), {
          sparks: FORGE_SPARKS.molten,
        });
      eachStanding(() => {
        if (struck.has(heroSlot()) || !boxHit([o.x - BODY, o.y - BODY, o.x + BODY, o.y + BODY], heroBox())) return;
        struck.add(heroSlot());
        hurtHero(damage, o.x);
      });
      if (o.y < GROUND - 1) return true;
      eachStanding(() => {
        if (
          struck.has(heroSlot()) ||
          !boxHit([o.x - SPLASH.half, GROUND - SPLASH.height, o.x + SPLASH.half, GROUND], heroBox())
        )
          return;
        struck.add(heroSlot());
        hurtHero(damage, o.x);
      });
      dust(o.x, GROUND, 4);
      for (let i = 0; i < 14; i++)
        particles.spawn(
          PK.SPARK,
          o.x,
          GROUND - 2,
          fxRng.range(-120, 120),
          -fxRng.range(50, 170),
          fxRng.range(0.2, 0.5),
          {
            sparks: FORGE_SPARKS.molten,
          },
        );
      particles.spawn(PK.FIRE, o.x, GROUND - 3, 0, -20, 0.4, { size: 3 });
      shake(0.08, 1.2);
      return false;
    },
    draw() {
      place();
      const warn = clamp(o.t / 0.4);
      ellipseRing(target, GROUND, SPLASH.half, 2, FORGE.molten[2], 0.4 + warn * 0.5);
      ellipseRing(target, GROUND, SPLASH.half * (1 - warn * 0.6), 1.2, FORGE.molten[4], warn);
      glow(target, GROUND - 1, 10, FORGE.molten[2], 0.15 + warn * 0.2);
      const c = Math.cos(o.spin);
      const s = Math.sin(o.spin);
      const at = (u: number, v: number): [number, number] => [o.x + u * c - v * s, o.y + u * s + v * c];
      polygon([at(-4, -2), at(4, -2), at(4.5, 2), at(-4.5, 2)], FORGE.molten[2]);
      polygon([at(-3, -1.5), at(3, -1.5), at(3.3, 0.8), at(-3.3, 0.8)], FORGE.molten[4]);
      const [ax, ay] = at(-2.5, -1);
      const [bx, by] = at(2, -1);
      hairline(ax, ay, bx, by, FORGE.molten[5]);
      glow(o.x, o.y, 10, FORGE.molten[3], 0.35);
    },
  };
}
