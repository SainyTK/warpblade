import { GROUND } from "../../../../constants/stage";
import { fleck, glow, hairline, line, place, px } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, particles } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { grain } from "../../../../utils/grain";
import { clamp } from "../../../../utils/math";
import { FORGE, FORGE_SPARKS } from "../../colors";

const CRACK = { from: 14, step: 9, segments: 5, beat: 0.06, burst: 0.34, height: 13, half: 4 } as const;

export interface CrackLine {
  x: number;
  dir: number;
  mark: number;
  damage: number;
}

const segmentX = (c: CrackLine, i: number): number => c.x + c.dir * (CRACK.from + i * CRACK.step);

function jet(age: number): number {
  if (age < 0 || age > CRACK.burst) return 0;
  const rise = clamp(age / 0.06);
  const fall = clamp((CRACK.burst - age) / 0.14);
  return CRACK.height * Math.min(rise, fall);
}

function warning(c: CrackLine, k: number, t: number): void {
  for (let i = 0; i < CRACK.segments; i++) {
    const x = segmentX(c, i);
    const reach = 2 + k * 2.5;
    const jag = (grain(i, c.x) - 0.5) * 1.6;
    line(x - reach, GROUND, x + reach, GROUND + jag * 0.5, k > 0.75 ? FORGE.molten[3] : FORGE.molten[1], 0.4 + k * 0.6);
    if (k > 0.5 && Math.sin(t * 30 + i) > 0) fleck(x + jag, GROUND - 1, FORGE.molten[4], k);
  }
}

function drawJet(x: number, h: number, age: number): void {
  const w = 1 + h / CRACK.height;
  for (let y = 0; y < h; y++) {
    const u = y / h;
    const sway = Math.sin(age * 40 + y * 0.6 + x) * 0.6 * u;
    const c = u < 0.25 ? FORGE.molten[5] : u < 0.55 ? FORGE.molten[4] : u < 0.8 ? FORGE.molten[3] : FORGE.molten[2];
    hairline(x - w * (1 - u) + sway, GROUND - y, x + w * (1 - u) + sway, GROUND - y, c);
  }
  px(x - 1, GROUND - 0.5, FORGE.molten[3]);
  glow(x, GROUND - h / 2, 10, FORGE.molten[2], 0.35);
}

export function createForgeCrack(owner: Enemy, c: CrackLine): Effect {
  let t = 0;
  let cancelled = false;
  const struck = new Set<number>();
  const end = c.mark + CRACK.segments * CRACK.beat + CRACK.burst;
  return {
    update(dt) {
      t += dt;
      if (t < c.mark) {
        if (owner.hp <= 0 || owner.state !== "wind") cancelled = true;
        return !cancelled;
      }
      for (let i = 0; i < CRACK.segments; i++) {
        const x = segmentX(c, i);
        if (x < stageLeft() + 4 || x > stageRight() - 4) continue;
        const age = t - c.mark - i * CRACK.beat;
        if (age >= 0 && age - dt < 0) {
          for (let k = 0; k < 5; k++)
            particles.spawn(
              PK.SHARD,
              x,
              GROUND - 1,
              fxRng.range(-50, 50),
              -fxRng.range(60, 130),
              fxRng.range(0.3, 0.6),
              {
                col: fxRng.pick(FORGE.iron),
                size: fxRng.range(1, 2),
              },
            );
          for (let k = 0; k < 4; k++)
            particles.spawn(PK.SPARK, x, GROUND - 2, fxRng.range(-40, 40), -fxRng.range(80, 160), 0.35, {
              sparks: FORGE_SPARKS.molten,
            });
        }
        const h = jet(age);
        if (h < 2) continue;
        eachStanding(() => {
          if (struck.has(heroSlot()) || !boxHit([x - CRACK.half, GROUND - h, x + CRACK.half, GROUND], heroBox()))
            return;
          struck.add(heroSlot());
          hurtHero(c.damage, x - c.dir * 6);
        });
      }
      return t < end;
    },
    draw() {
      place();
      if (t < c.mark) {
        warning(c, clamp(t / c.mark), t);
        return;
      }
      for (let i = 0; i < CRACK.segments; i++) {
        const x = segmentX(c, i);
        const age = t - c.mark - i * CRACK.beat;
        if (age < 0) continue;
        const cool = clamp((age - CRACK.burst) / 0.3);
        hairline(x - 3, GROUND + 0.5, x + 3, GROUND, cool > 0.5 ? FORGE.crust[2] : FORGE.molten[2]);
        const h = jet(age);
        if (h >= 1) drawJet(x, h, age);
      }
    },
  };
}
