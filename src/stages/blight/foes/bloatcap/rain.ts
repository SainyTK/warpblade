import { disc, ellipseRing, fleck, glow, hairline, place, polygon } from "../../../../engine/frame";
import { fxRng, game, particles } from "../../../../game/state";
import { shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import type { Box } from "../../../../types/world";
import { clamp } from "../../../../utils/math";
import { BLIGHT, BLIGHT_SPARKS } from "../../colors";
import { createPoisonPuddle, strikeOnce } from "../../spores";
import { BLOAT_TIMES } from "./timing";

const COLUMN = { half: 11, streaks: 22, hitFor: 0.22 } as const;
const PUDDLE = { half: 13, life: 2.4 } as const;

export interface SporeRain {
  x: number;
  top: number;
  floor: number;
  mark: number;
  damage: number;
  puddle: number;
}

function drawMarker(x: number, floor: number, k: number, t: number): void {
  const c = k > 0.75 ? BLIGHT.markHot : BLIGHT.mark;
  const r = COLUMN.half * (1.5 - 0.5 * k);
  ellipseRing(x, floor, r, r * 0.26, c, 0.35 + 0.55 * k, 1);
  ellipseRing(x, floor, r, r * 0.26, c, 0.2 + 0.3 * k, -1);
  hairline(x - COLUMN.half, floor - 0.5, x + COLUMN.half, floor - 0.5, BLIGHT.spore[1], 0.3 + 0.4 * k);
  if (k > 0.55 && Math.sin(t * 28) > 0) fleck(x, floor - 1, BLIGHT.markHot);
  glow(x, floor, r + 4, BLIGHT.mark, 0.1 + 0.25 * k);
}

function drawDrizzle(x: number, top: number, floor: number, k: number, t: number): void {
  if (k > 0.45)
    for (let y = top + 4; y < floor - 2; y += 3) {
      fleck(x - COLUMN.half, y + ((t * 20) % 3), BLIGHT.spore[2], 0.25 + 0.35 * k);
      fleck(x + COLUMN.half, y + ((t * 20) % 3), BLIGHT.spore[2], 0.25 + 0.35 * k);
    }
  for (let i = 0; i < 6; i++) {
    const u = (t * 1.6 + i / 6) % 1;
    const sx = x + Math.sin(i * 2.3 + t * 3) * COLUMN.half * 0.6;
    fleck(sx, top + (floor - top) * u * k, BLIGHT.spore[3], 0.3 + 0.4 * k);
  }
}

function drawColumn(x: number, top: number, floor: number, front: number, fade: number, t: number): void {
  const reach = top + (floor - top) * front;
  polygon(
    [
      [x - COLUMN.half * 0.8, top],
      [x + COLUMN.half * 0.8, top],
      [x + COLUMN.half, reach],
      [x - COLUMN.half, reach],
    ],
    BLIGHT.spore[1],
    0.22 * fade,
  );
  polygon(
    [
      [x - COLUMN.half * 0.35, top],
      [x + COLUMN.half * 0.35, top],
      [x + COLUMN.half * 0.5, reach],
      [x - COLUMN.half * 0.5, reach],
    ],
    BLIGHT.spore[2],
    0.25 * fade,
  );
  for (let i = 0; i < COLUMN.streaks; i++) {
    const sx = x + (((i * 5.7) % (COLUMN.half * 2)) - COLUMN.half) * 0.9;
    const run = (t * 160 + i * 17) % 18;
    for (let y = top + run - 18; y < reach; y += 18) {
      const y0 = Math.max(top, y);
      const y1 = Math.min(reach, y + 8);
      if (y1 > y0) hairline(sx, y0, sx, y1, i % 3 ? BLIGHT.spore[2] : BLIGHT.spore[4], 0.75 * fade);
    }
  }
  disc(x, reach, COLUMN.half * 0.6, BLIGHT.spore[3], 0.4 * fade);
  glow(x, (top + reach) / 2, COLUMN.half + 10, BLIGHT.spore[2], 0.35 * fade);
}

export function createSporeRain(rain: SporeRain): Effect {
  const { x, top, floor, mark, damage, puddle } = rain;
  const struck = new Set<number>();
  const end = mark + BLOAT_TIMES.fall;
  let t = 0;
  let landed = false;
  const front = (): number => clamp((t - mark) / 0.12);
  const area = (): Box => [x - COLUMN.half, top, x + COLUMN.half, floor];
  return {
    update(dt) {
      t += dt;
      if (t < mark) {
        if (fxRng.chance(dt * 18))
          particles.spawn(PK.MOTE, x + fxRng.range(-8, 8), floor - 1, 0, -fxRng.range(6, 16), 0.5, {
            col: BLIGHT.spore[2],
            size: 0.5,
          });
        return true;
      }
      if (front() >= 1 && t - mark < 0.12 + COLUMN.hitFor) strikeOnce(struck, area(), damage, x);
      if (!landed && front() >= 1) {
        landed = true;
        shake(0.08, 1);
        sfx.block();
        rainSplash(x, floor);
        game.fx.push(createPoisonPuddle(x, floor, PUDDLE.half, PUDDLE.life, puddle));
      }
      return t < end;
    },
    drawBack() {
      place();
      if (t < mark) drawMarker(x, floor, clamp(t / mark), t);
    },
    draw() {
      place();
      if (t < mark) drawDrizzle(x, top, floor, clamp(t / mark), t);
      else drawColumn(x, top, floor, front(), clamp((end - t) / 0.2), t);
    },
  };
}

function rainSplash(x: number, floor: number): void {
  for (let i = 0; i < 14; i++)
    particles.spawn(
      PK.SPARK,
      x + fxRng.range(-COLUMN.half, COLUMN.half),
      floor - 1,
      fxRng.range(-60, 60),
      -fxRng.range(30, 80),
      fxRng.range(0.2, 0.4),
      { sparks: BLIGHT_SPARKS.spore },
    );
}
