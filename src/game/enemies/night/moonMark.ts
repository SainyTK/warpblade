import { GROUND } from "../../../constants/stage";
import { ellipseRing, fleck, glow, hairline, line, place } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { eachStanding, heroSlot } from "../../coopHooks";
import { hurtHero } from "../../hurtHero";
import { lights, particles, rng } from "../../state";
import { boxHit, heroBox, shake } from "../../world";
import type { MoonLook, MoonStrike } from "./moonLook";
import { TOLL } from "./shepherdMoves";

const MARK = { far: 10, flat: 0.24, hurts: 0.1, fade: 0.42, fizzle: 0.25, near: 0.75 } as const;
const ARMING = "charge";
const STRIKING = "shoot";

type Stage = "arming" | "fired" | "fizzle";

export interface MarkPlan {
  owner: Enemy;
  x: number;
  windup: number;
  delay: number;
  damage: number;
  look: MoonLook;
  strike: MoonStrike;
}

function drawArming(p: MarkPlan, k: number, t: number): void {
  const { x, look } = p;
  const R = TOLL.radius;
  const near = k > MARK.near;
  const blink = near && Math.floor(t * 18) % 2 === 0;
  const r = R + (1 - k) * MARK.far;
  ellipseRing(x, GROUND, R, R * MARK.flat, look.ramp[1], 0.5 + 0.3 * k);
  ellipseRing(x, GROUND, r, r * MARK.flat, look.ramp[2], 0.4 + 0.5 * k, -1);
  ellipseRing(x, GROUND, r, r * MARK.flat, blink ? WHITE : near ? look.ramp[4] : look.ramp[3], 0.6 + 0.4 * k, 1);
  ellipseRing(x, GROUND, R * 0.55, R * 0.55 * MARK.flat, look.ramp[2], 0.3 + 0.4 * k);
  for (let m = 0; m < 5; m++) {
    const lift = (k * 2.2 + m * 0.23) % 1;
    fleck(x + (m - 2) * R * 0.35, GROUND - 1 - lift * (4 + k * 10), look.ramp[3], (1 - lift) * k);
  }
  glow(x, GROUND - 2, R * (0.6 + 0.4 * k), look.ramp[2], 0.12 + 0.25 * k);
}

function drawBurst(p: MarkPlan, k: number): void {
  const { x, look } = p;
  const R = TOLL.radius;
  const width = Math.round(R * (0.55 + 0.25 * (1 - k)));
  const tall = TOLL.height * (0.6 + 0.4 * k);
  for (let o = -width; o <= width; o++) {
    const edge = Math.abs(o) / width;
    const c = edge < 0.2 && k > 0.6 ? WHITE : edge < 0.5 ? look.ramp[4] : edge < 0.8 ? look.ramp[3] : look.ramp[2];
    const top = GROUND - tall * (1 - edge * edge * 0.6);
    line(x + o, GROUND, x + o, top, c, (u) => k * (1 - u) * (1 - edge * 0.5));
  }
  if (k > 0.8) ellipseRing(x, GROUND, R + 2, (R + 2) * MARK.flat, WHITE, 1);
  ellipseRing(x, GROUND, R + (1 - k) * 14, (R + (1 - k) * 14) * MARK.flat, look.ramp[3], k);
  hairline(x - R, GROUND, x + R, GROUND, look.ramp[4], k);
  glow(x, GROUND - tall * 0.4, R + 10, look.ramp[3], 0.55 * k);
}

function burst(p: MarkPlan): void {
  lights.add(p.x, GROUND - 10, 54, p.look.ramp[3], 0.8, 0.35);
  lights.add(p.x, GROUND - 4, 16, WHITE, 0.7, 0.1);
  shake(0.1, 1.5);
  for (let i = 0; i < 12; i++)
    particles.spawn(
      PK.SPARK,
      p.x + rng.range(-TOLL.radius, TOLL.radius) * 0.7,
      GROUND - 1,
      rng.range(-50, 50),
      -rng.range(80, 200),
      rng.range(0.25, 0.5),
      { sparks: p.look.sparks },
    );
}

export function createMoonMark(p: MarkPlan): Effect {
  let stage: Stage = "arming";
  let k = 0;
  let t = 0;
  let age = 0;
  let burstDone = false;
  return {
    update(dt) {
      age += dt;
      if (stage === "arming") {
        if (p.owner.hp > 0 && p.owner.state === ARMING) {
          k = clamp(p.owner.st / p.windup);
          return true;
        }
        stage = p.owner.hp > 0 && p.owner.state === STRIKING ? "fired" : "fizzle";
        t = 0;
      }
      t += dt;
      if (stage === "fizzle") return t < MARK.fizzle;
      if (t < p.delay) return true;
      if (!burstDone) {
        burstDone = true;
        burst(p);
      }
      if (t < p.delay + MARK.hurts)
        eachStanding(() => {
          const slot = heroSlot();
          if (p.strike.struck.has(slot)) return;
          if (!boxHit([p.x - TOLL.radius, GROUND - TOLL.height, p.x + TOLL.radius, GROUND], heroBox())) return;
          p.strike.struck.add(slot);
          hurtHero(p.damage, p.x);
        });
      return t < p.delay + MARK.fade;
    },
    draw() {
      place();
      if (stage === "arming") drawArming(p, k, age);
      else if (stage === "fizzle") drawArming(p, k * (1 - t / MARK.fizzle), age);
      else if (t < p.delay) drawArming(p, 1, age);
      else drawBurst(p, 1 - clamp((t - p.delay) / MARK.fade));
    },
  };
}
