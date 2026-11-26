import { GROUND } from "../../../constants/stage";
import { ellipseRing, fleck, glow, hairline, line, place, polygon } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { eachStanding, heroSlot } from "../../coopHooks";
import { hurtHero } from "../../hurtHero";
import { fxRng, lights, particles } from "../../state";
import { boxHit, dust, heroBox, shake } from "../../world";
import type { MoonLook, MoonStrike } from "./moonLook";
import { MOONFALL } from "./shepherdMoves";

const SHARD = { fall: 0.16, from: -12, length: 10, trail: 22, linger: 0.3 } as const;

export interface ShardPlan {
  x: number;
  delay: number;
  damage: number;
  look: MoonLook;
  strike: MoonStrike;
}

const heightAt = (t: number): number => {
  const u = clamp((t - (MOONFALL.mark - SHARD.fall)) / SHARD.fall);
  return SHARD.from + (GROUND - SHARD.from) * u * u;
};

function drawMarker(p: ShardPlan, t: number): void {
  const k = clamp(t / MOONFALL.mark);
  const blink = k > 0.7 && Math.floor(t * 20) % 2 === 0;
  hairline(p.x, 0, p.x, GROUND, p.look.ramp[2], (u) => (0.15 + 0.35 * k) * (0.4 + 0.6 * u));
  ellipseRing(p.x, GROUND, MOONFALL.half + 1, (MOONFALL.half + 1) * 0.3, blink ? WHITE : p.look.ramp[3], 0.5 + 0.5 * k);
  hairline(p.x - MOONFALL.half * k, GROUND, p.x + MOONFALL.half * k, GROUND, p.look.ramp[4], k);
  glow(p.x, GROUND - 1, 8 + 4 * k, p.look.ramp[2], 0.15 + 0.2 * k);
}

function drawFalling(p: ShardPlan, y: number): void {
  const top = y - SHARD.length;
  line(p.x, top - SHARD.trail, p.x, top, p.look.ramp[2], (u) => u * 0.7);
  hairline(p.x + 1, top - SHARD.trail * 0.6, p.x + 1, top, p.look.ramp[3], (u) => u * 0.5);
  polygon(
    [
      [p.x, top],
      [p.x + 1.5, top + SHARD.length * 0.45],
      [p.x, y],
      [p.x - 1.5, top + SHARD.length * 0.45],
    ],
    p.look.ramp[3],
  );
  hairline(p.x, top + 1, p.x, y - 1, WHITE);
  glow(p.x, y - SHARD.length * 0.5, 12, p.look.ramp[3], 0.45);
}

function shatter(p: ShardPlan): void {
  for (let i = 0; i < 8; i++)
    particles.spawn(PK.SHARD, p.x, GROUND - 1, fxRng.range(-90, 90), -fxRng.range(60, 160), fxRng.range(0.35, 0.7), {
      col: fxRng.pick([p.look.ramp[3], p.look.ramp[4], p.look.ramp[2]]),
      size: fxRng.range(1, 2),
    });
  for (let i = 0; i < 5; i++)
    particles.spawn(PK.MOTE, p.x + fxRng.range(-3, 3), GROUND - 2, fxRng.range(-30, 30), -fxRng.range(20, 60), 0.5, {
      col: p.look.ramp[4],
      size: 0.8,
    });
  dust(p.x, GROUND, 3);
  lights.add(p.x, GROUND - 6, 34, p.look.ramp[3], 0.7, 0.25);
  shake(0.06, 1);
}

export function createMoonShard(p: ShardPlan): Effect {
  let t = -p.delay;
  let landed = false;
  return {
    update(dt) {
      const before = t;
      t += dt;
      if (t < 0) return true;
      const falling = t > MOONFALL.mark - SHARD.fall;
      if (falling && before <= MOONFALL.mark) {
        const from = heightAt(Math.max(0, before)) - SHARD.length;
        const to = heightAt(t);
        eachStanding(() => {
          const slot = heroSlot();
          if (p.strike.struck.has(slot)) return;
          if (!boxHit([p.x - MOONFALL.half, from, p.x + MOONFALL.half, to], heroBox())) return;
          p.strike.struck.add(slot);
          hurtHero(p.damage, p.x);
        });
      }
      if (t >= MOONFALL.mark && !landed) {
        landed = true;
        shatter(p);
      }
      return t < MOONFALL.mark + SHARD.linger;
    },
    draw() {
      if (t < 0) return;
      place();
      if (t < MOONFALL.mark) {
        drawMarker(p, t);
        if (t > MOONFALL.mark - SHARD.fall) drawFalling(p, heightAt(t));
        return;
      }
      const k = 1 - clamp((t - MOONFALL.mark) / SHARD.linger);
      ellipseRing(p.x, GROUND, MOONFALL.half + (1 - k) * 8, (MOONFALL.half + (1 - k) * 8) * 0.3, p.look.ramp[3], k);
      fleck(p.x, GROUND - 1, WHITE, k);
      glow(p.x, GROUND - 3, 14, p.look.ramp[3], 0.4 * k);
    },
  };
}
