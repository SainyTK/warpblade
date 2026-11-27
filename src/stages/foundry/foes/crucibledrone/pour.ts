import { ellipseRing, fleck, glow, hairline, place } from "../../../../engine/frame";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, particles } from "../../../../game/state";
import { boxHit, heroBox, surfaceBelow } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { clamp } from "../../../../utils/math";
import { FORGE, FORGE_SPARKS } from "../../colors";
import { createSlagPuddle } from "../slagling/puddle";

const POUR = { fall: 0.12, stream: 0.34, half: 5, puddle: 11, puddleDamage: 0.35 } as const;
const M = FORGE.molten;

export interface PourLine {
  x: number;
  top: number;
  mark: number;
  damage: number;
}

function drawStream(x: number, top: number, bottom: number, t: number, thin: number): void {
  for (let y = top; y < bottom; y += 0.5) {
    const wob = Math.sin(t * 50 + y * 0.7) * 0.5;
    const w = (1.6 + (y - top) / 40) * thin;
    const c = Math.floor(y * 2 + t * 40) % 5 === 0 ? M[5] : M[4];
    hairline(x - w + wob, y, x + w + wob, y, M[3]);
    hairline(x - w * 0.4 + wob, y, x + w * 0.4 + wob, y, c);
  }
  glow(x, (top + bottom) / 2, 14, M[2], 0.35 * thin);
}

export function createPour(owner: Enemy, line: PourLine): Effect {
  let t = 0;
  let splashed = false;
  const floor = surfaceBelow(line.x, line.top);
  const struck = new Set<number>();
  const end = line.mark + POUR.fall + POUR.stream;
  return {
    update(dt) {
      t += dt;
      if (t < line.mark) {
        if (owner.hp <= 0) return false;
        if (fxRng.chance(dt * 6))
          particles.spawn(PK.EMBER, line.x + fxRng.range(-1, 1), line.top, 0, 30, 0.6, { sparks: FORGE_SPARKS.molten });
        return true;
      }
      const reach = line.top + (floor - line.top) * clamp((t - line.mark) / POUR.fall);
      eachStanding(() => {
        if (struck.has(heroSlot())) return;
        if (!boxHit([line.x - POUR.half, line.top, line.x + POUR.half, reach], heroBox())) return;
        struck.add(heroSlot());
        hurtHero(line.damage, line.x);
      });
      if (!splashed && t >= line.mark + POUR.fall) {
        splashed = true;
        sfx.boom();
        game.fx.push(createSlagPuddle(line.x, POUR.puddle, line.damage * POUR.puddleDamage));
        for (let i = 0; i < 12; i++)
          particles.spawn(
            PK.SPARK,
            line.x,
            floor - 1,
            fxRng.range(-90, 90),
            -fxRng.range(40, 140),
            fxRng.range(0.2, 0.5),
            {
              sparks: FORGE_SPARKS.molten,
            },
          );
      }
      return t < end;
    },
    drawBack() {
      if (t >= line.mark + POUR.fall) return;
      const u = clamp(t / line.mark);
      place(line.x, floor);
      const r = 12 - u * 5;
      ellipseRing(0, 0, r, r * 0.25, M[u > 0.7 ? 4 : 2], 0.45 + u * 0.5);
      hairline(-POUR.half * u, 0, POUR.half * u, 0, M[4], 0.8);
      if (u > 0.6) fleck(Math.sin(t * 30) * 2, -1, M[5], u);
      glow(0, -2, 12, M[2], 0.1 + u * 0.25);
      place();
    },
    draw() {
      if (t < line.mark) return;
      const reach = line.top + (floor - line.top) * clamp((t - line.mark) / POUR.fall);
      const thin = t > end - 0.1 ? clamp((end - t) / 0.1) : 1;
      place();
      drawStream(line.x, line.top, reach, t, thin);
    },
  };
}
