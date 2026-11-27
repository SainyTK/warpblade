import { GROUND } from "../../../../constants/stage";
import { fleck, glow, hairline, line, place, polygon, px } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { fxRng, particles } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { grain } from "../../../../utils/grain";
import { clamp } from "../../../../utils/math";
import { BLIGHT_SPARKS } from "../../colors";
import { strikeOnce } from "../../spores";
import { BEAR } from "./colors";
import { SHOCK } from "./constants";

const spikeX = (x: number, side: number, i: number): number => x + side * (SHOCK.from + i * SHOCK.step);

function rise(age: number): number {
  if (age < 0 || age > SHOCK.burst) return 0;
  return SHOCK.height * Math.min(clamp(age / 0.05), clamp((SHOCK.burst - age) / 0.14));
}

function warning(x: number, k: number, t: number): void {
  const c = k > 0.75 ? BEAR.glow[4] : BEAR.glow[2];
  for (const side of [-1, 1])
    for (let i = 0; i < SHOCK.segments; i++) {
      const sx = spikeX(x, side, i);
      const reach = 1.5 + k * 2.5;
      const jag = (grain(i, sx) - 0.5) * 1.4;
      line(sx - reach, GROUND, sx + reach, GROUND + jag * 0.5, c, 0.35 + k * 0.6);
      if (k > 0.5 && Math.sin(t * 28 + i) > 0) fleck(sx + jag, GROUND - 1, BEAR.glow[3], k);
    }
  glow(x, GROUND, 6 + k * 8, BEAR.glow[2], 0.08 + k * 0.16);
}

function spike(x: number, h: number, lean: number): void {
  const w = SHOCK.half;
  const tip: [number, number] = [x + lean, GROUND - h];
  polygon(
    [
      [x - w - 0.5, GROUND],
      [x - w * 0.4, GROUND - h * 0.55],
      tip,
      [x + w * 0.5, GROUND - h * 0.5],
      [x + w + 0.5, GROUND],
    ],
    BEAR.outline,
  );
  polygon(
    [
      [x - w, GROUND],
      [x - w * 0.3, GROUND - h * 0.5],
      [tip[0], tip[1] + 1],
      [x + w * 0.4, GROUND - h * 0.45],
      [x + w, GROUND],
    ],
    BEAR.fur[3],
  );
  polygon(
    [
      [x - w, GROUND],
      [x - w * 0.3, GROUND - h * 0.5],
      [tip[0], tip[1] + 1],
      [x, GROUND],
    ],
    BEAR.fur[2],
  );
  hairline(x + w * 0.4, GROUND - h * 0.45, tip[0], tip[1] + 1, BEAR.fur[4]);
  px(tip[0], tip[1] + 0.5, BEAR.glow[3]);
  fleck(tip[0], tip[1], BEAR.glow[4]);
  glow(x, GROUND - h * 0.6, 8, BEAR.glow[2], 0.3);
}

export function createBearShockwave(owner: Enemy, x: number, mark: number, damage: number): Effect {
  let t = 0;
  let cancelled = false;
  const struck = new Set<number>();
  const end = mark + SHOCK.segments * SHOCK.beat + SHOCK.burst;
  const inside = (sx: number): boolean => sx > stageLeft() + 4 && sx < stageRight() - 4;
  return {
    update(dt) {
      t += dt;
      if (t < mark) {
        if (owner.hp <= 0 || owner.state !== "wind") cancelled = true;
        return !cancelled;
      }
      for (const side of [-1, 1])
        for (let i = 0; i < SHOCK.segments; i++) {
          const sx = spikeX(x, side, i);
          if (!inside(sx)) continue;
          const age = t - mark - i * SHOCK.beat;
          if (age >= 0 && age - dt < 0)
            for (let k = 0; k < 4; k++)
              particles.spawn(
                PK.SHARD,
                sx,
                GROUND - 1,
                fxRng.range(-40, 40),
                -fxRng.range(50, 120),
                fxRng.range(0.3, 0.55),
                {
                  col: fxRng.pick(BLIGHT_SPARKS.bark),
                  size: fxRng.range(1, 2),
                },
              );
          if (age >= 0 && age - dt < 0 && i % 2 === 0)
            particles.spawn(PK.MOTE, sx, GROUND - 4, fxRng.range(-10, 10), -fxRng.range(10, 30), 0.6, {
              col: BEAR.glow[3],
              size: 0.6,
            });
          const h = rise(age);
          if (h >= 2) strikeOnce(struck, [sx - SHOCK.half, GROUND - h, sx + SHOCK.half, GROUND], damage, sx - side * 6);
        }
      return t < end;
    },
    drawBack() {
      if (t >= mark) return;
      place();
      warning(x, clamp(t / mark), t);
    },
    draw() {
      if (t < mark) return;
      place();
      for (const side of [-1, 1])
        for (let i = 0; i < SHOCK.segments; i++) {
          const sx = spikeX(x, side, i);
          if (!inside(sx)) continue;
          const h = rise(t - mark - i * SHOCK.beat);
          if (h >= 1) spike(sx, h, side * (1 + i * 0.4));
        }
    },
  };
}
