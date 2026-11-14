import { onFrame } from "../../../../constants/combo";
import { frame } from "../../../../constants/hero";
import { travelEnded } from "../../../../game/hero/travelEnd";
import { hero } from "../../../../game/state";
import { dust } from "../../../../game/world";
import type { MoveDef } from "../../../../types/move";
import { AIR_CANCEL, AIR_THRUST, DIVE, STRING_FEEL } from "../../constants/string";
import { diveLanded } from "../dive";
import { DIVE_STREAK, THRUST } from "./slashes";

/** the dive tucks for this long, then drops on its slant */
const TUCK = frame(3);

/** the air thrusts: one diving thrust a jump in the base kit, with Swallow Dive a level thrust before it */
export const AIR_MOVES = {
  airThrust: {
    id: "airThrust",
    name: "Air thrust",
    clip: "airThrust",
    pitch: 1.5,
    cancel: AIR_CANCEL,
    hits: [
      {
        at: onFrame(4),
        box: AIR_THRUST.box,
        power: AIR_THRUST.power,
        kx: 10,
        ky: -30,
        slash: THRUST,
        feel: STRING_FEEL.rising,
      },
    ],
  },
  dive: {
    id: "dive",
    name: "Diving thrust",
    clip: "dive",
    pitch: 1.1,
    falls: true,
    untilLanding: true,
    hits: [
      {
        at: onFrame(4),
        box: DIVE.box,
        power: DIVE.power,
        kx: 20,
        ky: 120,
        spike: true,
        stagger: DIVE.pin,
        slash: DIVE_STREAK,
        feel: STRING_FEEL.rising,
      },
    ],
    step: (t) => {
      if (t < TUCK) {
        hero.vx = 0;
        hero.vy = Math.min(hero.vy, -20);
        return;
      }
      hero.vx = hero.face * DIVE.vx;
      hero.vy = DIVE.vy;
    },
    land: () => {
      dust(hero.x, hero.y, 5, hero.face);
      diveLanded();
      travelEnded();
    },
  },
} satisfies Record<string, MoveDef>;
