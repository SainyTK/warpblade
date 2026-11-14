import { onFrame } from "../../../../constants/combo";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { lift } from "../../../../game/hero/lift";
import { objectMemory, rememberPerSeat } from "../../../../game/seatMemory";
import { game, hero } from "../../../../game/state";
import { dust } from "../../../../game/world";
import type { MoveDef } from "../../../../types/move";
import { SAND_RAMP } from "../../constants/palette";
import { CYCLONE_HOP, STRING_CANCEL, STRING_FEEL } from "../../constants/string";
import { heldSide, walkThrough } from "../walkThrough";
import { CYCLONE_RING, HIGH_RING, LOW_RING, RING_CUT, RISING_RING } from "./slashes";

/** whether the cyclone in play has hopped yet */
const hop = { done: false };
rememberPerSeat(objectMemory(hop));
/** the cyclone leaves the floor on this frame, out of its coil */
const HOP_AT = onFrame(5);

/** the cyclone hops off its coil and drifts with the walk held */
function cycloneStep(t: number): void {
  if (!hop.done && t >= HOP_AT) {
    hop.done = true;
    lift(CYCLONE_HOP.rise, false);
  }
  if (hop.done) hero.vx = heldSide() * CYCLONE_HOP.drift;
  else walkThrough();
}

/** the cyclone's ring: sand thrown out along the floor */
function cycloneSand(): void {
  game.fx.push(createFloorRing(hero.x, hero.y + (hero.ground ? 0 : 16), 34, SAND_RAMP, 0.4));
  dust(hero.x - 10, hero.y + (hero.ground ? 0 : 16), 4, -1);
  dust(hero.x + 10, hero.y + (hero.ground ? 0 : 16), 4, 1);
}

/** a spin's box: its reach in front, mirrored behind by `around` */
const WAIST = [-4, -36, 30, -2] as const;

/**
 * The ground string, four spins he can walk through: a level sweep, a rising turn, a double turn low then high, and
 * the cyclone, a hop spin that throws foes up on both sides. Every blow cuts in front and behind at once.
 */
export const STRING_MOVES = {
  sweepTurn: {
    id: "sweepTurn",
    name: "Sweep turn",
    clip: "turn1",
    pitch: 1.1,
    cancel: STRING_CANCEL.sweepTurn,
    step: walkThrough,
    hits: [
      {
        at: onFrame(5),
        box: WAIST,
        power: 0.95,
        kx: 8,
        ky: -15,
        around: true,
        slash: RING_CUT,
        feel: STRING_FEEL.sweepTurn,
      },
    ],
  },
  risingTurn: {
    id: "risingTurn",
    name: "Rising turn",
    clip: "turn2",
    pitch: 1.2,
    cancel: STRING_CANCEL.risingTurn,
    step: walkThrough,
    hits: [
      {
        at: onFrame(5),
        box: [-4, -44, 28, -2],
        power: 1,
        kx: 8,
        ky: -40,
        around: true,
        slash: RISING_RING,
        feel: STRING_FEEL.risingTurn,
      },
    ],
  },
  twinTurn: {
    id: "twinTurn",
    name: "Twin turn",
    clip: "turn3",
    pitch: 1.3,
    cancel: STRING_CANCEL.twinTurn,
    step: walkThrough,
    hits: [
      {
        at: onFrame(5),
        box: [-4, -24, 30, 2],
        power: 0.6,
        kx: 6,
        ky: 0,
        around: true,
        slash: LOW_RING,
        feel: STRING_FEEL.twinTurnFirst,
      },
      {
        at: onFrame(10),
        box: [-4, -40, 31, -8],
        power: 0.65,
        kx: 10,
        ky: -20,
        around: true,
        slash: HIGH_RING,
        feel: STRING_FEEL.twinTurnSecond,
      },
    ],
  },
  duneCyclone: {
    id: "duneCyclone",
    name: "Dune cyclone",
    clip: "cyclone",
    pitch: 0.75,
    falls: true,
    cancel: STRING_CANCEL.duneCyclone,
    enter: () => {
      hop.done = false;
    },
    step: cycloneStep,
    afterHit: cycloneSand,
    hits: [
      {
        at: onFrame(8),
        box: [-4, -48, 34, 4],
        power: 1.85,
        kx: 30,
        ky: -40,
        launch: 230,
        stun: 0.5,
        big: true,
        wall: true,
        around: true,
        slash: CYCLONE_RING,
        feel: STRING_FEEL.duneCyclone,
      },
    ],
  },
} satisfies Record<string, MoveDef>;
