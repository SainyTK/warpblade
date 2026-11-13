import { DIAL } from "../../../constants/mirel/look";
import { PAL, SAND } from "../../../constants/palette";
import { place } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { TAU } from "../../../utils/math";
import { hero, particles, rng } from "../../state";
import { type Dial, dialArc, drawDial, drawHand, drawHandWake, drawHub } from "./clockArt";

/** the face round her: its radius, the seconds its hand takes to wind back a full turn, and its white flash */
const FACE = 15;
const WIND = 0.4;
const FLASH = 2 / 30;
/** sand motes drawn back into her as the moment rewinds */
const MOTES = 16;

/** sand flies back into her from all round, the way it left */
function sandIn(x: number, y: number): void {
  for (let i = 0; i < MOTES; i++) {
    const a = rng.range(0, TAU);
    const d = rng.range(18, 30);
    particles.spawn(
      PK.MOTE,
      x + Math.cos(a) * d,
      y + Math.sin(a) * d,
      -Math.cos(a) * d * 3,
      -Math.sin(a) * d * 3,
      0.3,
      {
        col: rng.chance(0.5) ? SAND.light : PAL.hour[4],
        size: 0.6,
      },
    );
  }
}

/**
 * The Stopped Moment round her: a clock face snaps open white on her, its hand winds back a full turn with its wake
 * running ahead of it, and sand flies back into her; it follows her as she moves.
 */
export function createMomentLook(): Effect {
  let t = 0;
  sandIn(hero.x, hero.y - 18);
  return {
    update(dt) {
      t += dt;
      return t < WIND;
    },
    draw() {
      place();
      const u = t / WIND;
      const fade = 1 - u * u;
      const dial: Dial = { x: hero.x, y: hero.y - 18, r: FACE, a: fade, floor: hero.y + 1, flash: t < FLASH };
      drawDial(dial);
      dialArc(dial, FACE + 2, -Math.PI / 2 - u * TAU, -Math.PI / 2, DIAL.hour, fade * 0.8);
      // the hand winds back from twelve, its wake on the side it is heading to
      drawHandWake(dial, -u, FACE - 3, -0.08);
      drawHand(dial, -u, FACE - 3, true);
      drawHub(dial);
    },
  };
}
