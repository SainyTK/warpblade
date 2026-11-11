import { STILLFIELD } from "../../../constants/mirel/field";
import { DIAL } from "../../../constants/mirel/look";
import { PAL, SAND } from "../../../constants/palette";
import { GROUND } from "../../../constants/stage";
import { disc, fleck, glow, place } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import type { StillfieldView } from "../../../types/mirel";
import { PK } from "../../../types/particle";
import { TAU } from "../../../utils/math";
import { character, lights, particles, rng } from "../../state";
import { lowerField, raiseField, type TimeField } from "../../timeFields";
import { type Dial, dialArc, drawDial, drawHand, drawHandWake, drawHub } from "./clockArt";
import { mirel } from "./memory";
import { snapField } from "./stillfield";

/** seconds the ring takes to grow open, the open flash, and the closing snap */
const GROW = 4 / 30;
const OPEN_FLASH = 2 / 30;
const CLOSE = 3 / 30;
/** seconds the second hand takes to go round once */
const SWEEP = 2;
/** sand motes hanging still inside */
const MOTES = 16;
/** the inner ring of dashes: how far out it sits, how many dashes, and how fast it turns against the hand */
const INNER = { at: 0.58, dashes: 12, speed: 0.35 } as const;

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
  lights.add(f.x, f.y, f.radius + 10, PAL.hour[3], 0.55, 0.15);
}

/**
 * The clock face of a field: a faint fill, the dial, a slower ring of dashes turning the other way inside it, a second
 * hand going round with its wake, and sand hanging still inside; the floor in front hides what is below it.
 */
function drawRing(f: StillfieldView, r: number, age: number, white: boolean): void {
  place();
  const dial: Dial = { x: f.x, y: f.y, r, a: 1, floor: GROUND, flash: white };
  disc(f.x, f.y, r, DIAL.fill, 0.15, GROUND);
  drawDial(dial);
  const inner = r * INNER.at;
  const turn = -age * INNER.speed;
  for (let i = 0; i < INNER.dashes; i++) {
    const from = turn + (i / INNER.dashes) * TAU;
    dialArc(dial, inner, from, from + (TAU / INNER.dashes) * 0.55, DIAL.minute, 0.7);
  }
  const hand = age / SWEEP;
  drawHandWake(dial, hand, r * 0.8, 0.06);
  drawHand(dial, hand, r * 0.8, false);
  drawHub(dial);
  for (let i = 0; i < MOTES; i++) {
    const [mx, my] = motePlace(f.id, i);
    const y = f.y + my * r + Math.sin(age * 0.6 + i) * 0.6;
    if (y < GROUND) fleck(f.x + mx * r, y, i % 3 ? DIAL.sand : DIAL.sandShade);
    if (y < GROUND && i % 4 === 0) fleck(f.x + mx * r + 0.5, y, DIAL.sandShade);
  }
  glow(f.x, f.y, r * 0.8, DIAL.light, white ? 0.26 : 0.14);
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
