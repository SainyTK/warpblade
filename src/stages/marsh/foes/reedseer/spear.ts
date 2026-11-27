import { ellipseRing, fleck, glow, hairline, place, polygon } from "../../../../engine/frame";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { RAIN_FOES as R, WATER_SPARKS } from "../../../../game/enemies/rain/colors";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, particles } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { clamp } from "../../../../utils/math";
import { SPEAR } from "./colors";

const FALL = { speed: 460, from: -24, length: 20, half: 3, stuck: 0.3 } as const;

function shape(x: number, tip: number, sink: number): void {
  const top = tip - FALL.length;
  place(x, 0);
  glow(0, tip - 8, 10, SPEAR[2], 0.25 * (1 - sink));
  polygon(
    [
      [0, tip],
      [-1.8, tip - 6],
      [-1.2, top],
      [1.2, top],
      [1.8, tip - 6],
    ],
    SPEAR[1],
  );
  polygon(
    [
      [0, tip],
      [0.2, top],
      [1.2, top],
      [1.8, tip - 6],
    ],
    SPEAR[3],
  );
  hairline(-0.4, tip - 2, -0.6, top + 2, SPEAR[4]);
  hairline(-1.8, tip - 6, 0, tip, R.outline);
  fleck(0, tip - 1, SPEAR[4]);
  for (let i = 1; i <= 3; i++) fleck(fxRng.range(-1, 1), top - i * 4, SPEAR[3], 0.7 - i * 0.18);
  place();
}

function splash(x: number, y: number): void {
  for (let i = 0; i < 12; i++)
    particles.spawn(PK.SPARK, x + fxRng.range(-3, 3), y - 1, fxRng.range(-80, 80), -fxRng.range(50, 150), 0.4, {
      sparks: WATER_SPARKS,
    });
}

export function createRainSpear(x: number, floor: number, mark: number, damage: number): Effect {
  const fallTime = (floor - FALL.from) / FALL.speed;
  const drop = Math.max(0, mark - fallTime);
  const struck = new Set<number>();
  let t = 0;
  let landed = false;
  const tip = (): number => Math.min(floor, FALL.from + Math.max(0, t - drop) * FALL.speed);
  return {
    update(dt) {
      t += dt;
      if (t < drop) return true;
      const y = tip();
      if (!landed) {
        eachStanding(() => {
          if (struck.has(heroSlot())) return;
          if (!boxHit([x - FALL.half, y - FALL.length, x + FALL.half, y], heroBox())) return;
          struck.add(heroSlot());
          hurtHero(damage, x);
        });
      }
      if (!landed && y >= floor) {
        landed = true;
        splash(x, floor);
        sfx.shatter();
      }
      return t < drop + fallTime + FALL.stuck;
    },
    drawBack() {
      if (landed) return;
      const u = clamp(t / mark);
      place(x, floor);
      const r = 10 - u * 4;
      ellipseRing(0, 0, r, r * 0.28, u > 0.75 ? SPEAR[4] : SPEAR[2], 0.5 + u * 0.5);
      ellipseRing(0, 0, r * 0.5, r * 0.15, R.wart, u);
      glow(0, -2, 12, R.wart, 0.1 + u * 0.25);
      place();
      for (let y = (t * 140) % 12; y < floor - 6; y += 12) hairline(x, y, x - 0.5, y + 4, R.wetSkyDim, 0.15 + u * 0.35);
    },
    draw() {
      if (t < drop) return;
      const sink = landed ? clamp((t - drop - fallTime) / FALL.stuck) : 0;
      shape(x, tip(), sink);
    },
  };
}
