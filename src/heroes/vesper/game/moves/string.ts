import { onFrame } from "../../../../constants/combo";
import { frame } from "../../../../constants/hero";
import { lift } from "../../../../game/hero/lift";
import { objectMemory, rememberPerSeat } from "../../../../game/seatMemory";
import { hero } from "../../../../game/state";
import { dust } from "../../../../game/world";
import type { MoveDef } from "../../../../types/move";
import { MOONRISE, STRING_CANCEL, STRING_FEEL } from "../../constants/string";
import { tellLaunched } from "../launched";
import { BACKHAND, FALLING, LAUNCH, LEVEL, LOW_FLICK, RISING, STAB, SWEEP_SHORT } from "./slashes";

/** the long blade's reach in a string blow, and the short blade's */
const LONG_BOX = [-2, -40, 34, -2] as const;
const SHORT_BOX = [-2, -34, 25, -2] as const;

/** whether the leap of the last press has left the floor yet */
const leap = { done: false };
rememberPerSeat(objectMemory(leap));

/** the last press leaps on its rising blow, so she goes up with the foe she throws */
function leapStep(t: number): void {
  if (leap.done || t < frame(8)) return;
  leap.done = true;
  dust(hero.x, hero.y, 4);
  lift(MOONRISE.rise, false);
}

/**
 * The ground string, four presses of two blows each, the same every time: the dusk cross, the rising pair, the scissor
 * turn and the moonrise, whose long blade throws the foe up as she leaps after it. Her feet stay planted for the first
 * three presses, and the blows push the foe only a few pixels, so it stays in reach.
 */
export const STRING_MOVES = {
  duskCross: {
    id: "duskCross",
    name: "Dusk cross",
    clip: "duskCross",
    pitch: 1.1,
    cancel: STRING_CANCEL.duskCross,
    hits: [
      { at: onFrame(4), box: LONG_BOX, power: 0.7, kx: 6, ky: -20, slash: FALLING, feel: STRING_FEEL.long },
      { at: onFrame(7), box: SHORT_BOX, power: 0.5, kx: 6, ky: -10, slash: BACKHAND, feel: STRING_FEEL.short },
    ],
  },
  risingPair: {
    id: "risingPair",
    name: "Rising pair",
    clip: "risingPair",
    pitch: 1.2,
    cancel: STRING_CANCEL.risingPair,
    hits: [
      { at: onFrame(4), box: [-4, -48, 30, -2], power: 0.7, kx: 6, ky: -40, slash: RISING, feel: STRING_FEEL.long },
      { at: onFrame(7), box: [0, -28, 30, -10], power: 0.5, kx: 8, ky: 0, slash: STAB, feel: STRING_FEEL.short },
    ],
  },
  scissorTurn: {
    id: "scissorTurn",
    name: "Scissor turn",
    clip: "scissorTurn",
    pitch: 1.05,
    cancel: STRING_CANCEL.scissorTurn,
    hits: [
      { at: onFrame(4), box: LONG_BOX, power: 0.75, kx: 6, ky: -10, slash: LEVEL, feel: STRING_FEEL.scissor },
      { at: onFrame(7), box: SHORT_BOX, power: 0.55, kx: 8, ky: -10, slash: SWEEP_SHORT, feel: STRING_FEEL.short },
    ],
  },
  moonrise: {
    id: "moonrise",
    name: "Moonrise",
    clip: "moonrise",
    pitch: 0.9,
    cancel: STRING_CANCEL.finisher,
    hits: [
      { at: onFrame(4), box: SHORT_BOX, power: 0.6, kx: 4, ky: 0, slash: LOW_FLICK, feel: STRING_FEEL.short },
      {
        at: onFrame(8),
        box: [-4, -56, 32, 2],
        power: 1.6,
        kx: 20,
        ky: 0,
        launch: MOONRISE.launch,
        big: true,
        slash: LAUNCH,
        feel: STRING_FEEL.launch,
      },
    ],
    enter: () => {
      leap.done = false;
    },
    step: leapStep,
    afterHit: (hits) => {
      if (hits > 0 && leap.done) tellLaunched(40);
    },
  },
} satisfies Record<string, MoveDef>;
