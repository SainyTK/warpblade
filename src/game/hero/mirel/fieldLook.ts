import { STILLFIELD } from "../../../constants/mirel/field";
import { PAL, SAND } from "../../../constants/palette";
import { GROUND } from "../../../constants/stage";
import { disc, glow, place, px } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import type { Effect } from "../../../types/effect";
import type { StillfieldView } from "../../../types/mirel";
import { PK } from "../../../types/particle";
import { WHITE } from "../../../utils/color";
import { TAU } from "../../../utils/math";
import { character, lights, particles, rng } from "../../state";
import { lowerField, raiseField, type TimeField } from "../../timeFields";
import { mirel } from "./memory";
import { snapField } from "./stillfield";

/** seconds the ring takes to grow open, the open flash, and the closing snap */
const GROW = 4 / 30;
const OPEN_FLASH = 2 / 30;
const CLOSE = 3 / 30;
/** seconds the second hand takes to go round once */
const SWEEP = 2;
/** sand motes hanging still inside */
const MOTES = 12;

/** a mote's resting place inside the field, the same every frame for this field */
function motePlace(id: number, i: number): [number, number] {
  const a = ((id * 37 + i * 97) % 360) * (Math.PI / 180);
  const k = 0.25 + (((id * 13 + i * 29) % 70) / 100) * 0.95;
  return [Math.cos(a) * k, Math.sin(a) * k];
}

/** sand bursts outward as the ring snaps shut */
function burst(f: StillfieldView): void {
  for (let i = 0; i < 18; i++) {
    const a = rng.range(0, TAU);
    const sp = rng.range(40, 110);
    particles.spawn(
      PK.MOTE,
      f.x + Math.cos(a) * f.radius * 0.3,
      f.y + Math.sin(a) * f.radius * 0.3,
      Math.cos(a) * sp,
      Math.sin(a) * sp,
      rng.range(0.25, 0.5),
      {
        col: rng.chance(0.6) ? SAND.light : PAL.hour[4],
        size: 0.6,
      },
    );
  }
  lights.add(f.x, f.y, f.radius + 10, PAL.hour[4], 0.9, 0.15);
}

/** a pixel of the field, hidden where the floor stands in front of it */
function fieldPx(x: number, y: number, c: Color, a: number): void {
  if (y < GROUND) px(x, y, c, a);
}

/** the clock ring: twelve ticks, a faint fill, a second hand going round and sand hanging still inside; the floor in
 *  front hides what is below it */
function drawRing(f: StillfieldView, r: number, age: number, white: boolean): void {
  place();
  const ring = white ? WHITE : PAL.hour[3];
  disc(f.x, f.y, r, PAL.hour[2], 0.15, GROUND);
  const steps = Math.max(24, Math.round(TAU * r));
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * TAU;
    fieldPx(f.x + Math.cos(a) * r, f.y + Math.sin(a) * r, ring, 0.9);
  }
  for (let i = 0; i < 12; i++) {
    const a = -Math.PI / 2 + (i / 12) * TAU;
    const c = i === 0 ? PAL.hour[5] : PAL.hour[4];
    fieldPx(f.x + Math.cos(a) * (r - 2), f.y + Math.sin(a) * (r - 2), c, 0.9);
    fieldPx(f.x + Math.cos(a) * (r - 3), f.y + Math.sin(a) * (r - 3), c, 0.6);
  }
  const hand = -Math.PI / 2 + (age / SWEEP) * TAU;
  for (let k = 0; k <= r - 4; k++) fieldPx(f.x + Math.cos(hand) * k, f.y + Math.sin(hand) * k, PAL.hour[4], 0.6);
  px(f.x, f.y, PAL.hour[5]);
  for (let i = 0; i < MOTES; i++) {
    const [mx, my] = motePlace(f.id, i);
    const drift = Math.sin(age * 0.6 + i) * 0.6;
    fieldPx(f.x + mx * r, f.y + my * r + drift, i % 3 ? SAND.light : SAND.shade, 0.8);
  }
  glow(f.x, f.y, r * 0.8, PAL.hour[3], white ? 0.4 : 0.14);
}

/**
 * The look of a Stillfield, and the time field it holds open while it stands. A held field follows its owner's memory
 * (run with its owner swapped in) and closes when the field there is gone; a free field stands its own `life` and
 * snaps as it closes.
 */
export function createFieldLook(start: StillfieldView, held: boolean, life: number): Effect {
  let view = start;
  let age = 0;
  let closing = -1;
  const time: TimeField = {
    at: () => view,
    radius: () => view.radius,
    pace: STILLFIELD.pace,
  };
  raiseField(time);
  const close = (): void => {
    closing = 0;
    lowerField(time);
    burst(view);
  };
  return {
    update(dt) {
      age += dt;
      if (closing >= 0) {
        closing += dt;
        return closing < CLOSE;
      }
      if (held) {
        const live = character.kit === "mirel" ? mirel.field : null;
        if (!live || live.id !== view.id) close();
        else view = live;
        return true;
      }
      if (age >= life) {
        snapField(view.x, view.y, view.radius);
        close();
      }
      return true;
    },
    draw() {},
    drawBack() {
      if (closing >= 0) {
        const k = 1 - closing / CLOSE;
        drawRing(view, view.radius * (0.3 + 0.7 * k), age, closing < 1 / 30);
        return;
      }
      const grow = Math.min(1, age / GROW);
      drawRing(view, view.radius * grow, age, age < OPEN_FLASH);
    },
  };
}
