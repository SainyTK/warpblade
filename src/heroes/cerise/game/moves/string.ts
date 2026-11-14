import { onFrame } from "../../../../constants/combo";
import { frame } from "../../../../constants/hero";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { skin } from "../../../../game/hero/skin";
import { game, hero } from "../../../../game/state";
import { dust } from "../../../../game/world";
import type { MoveDef } from "../../../../types/move";
import {
  LUNGE,
  LUNGE_BOX,
  RISING_BOX,
  STRING_CANCEL,
  STRING_FEEL,
  STRING_POWER,
  THRUST_BOX,
} from "../../constants/string";
import { lungeTrail, startLunge } from "../lunge";
import { LUNGE_STREAK, RISING, THRUST } from "./slashes";

/** the lunge's front foot lands: a small rose ring and dust under it, and Long Lunge's petals and comet */
function lungeLanded(): void {
  const gx = hero.x + hero.face * 14;
  game.fx.push(createFloorRing(gx, hero.y, 16, skin.ramp, 0.25));
  dust(gx, hero.y, 4, hero.face);
  lungeTrail();
}

/**
 * The ground string, the same every time: lead thrust, second thrust, rising thrust, twin flick and the long lunge that
 * spends every Point and pierces every foe on its line. Every thrust keeps her feet where they are; only the lunge
 * carries her forward.
 */
export const STRING_MOVES = {
  leadThrust: {
    id: "leadThrust",
    name: "Lead thrust",
    clip: "thrust1",
    pitch: 1.5,
    cancel: STRING_CANCEL.thrust,
    hits: [
      {
        at: onFrame(4),
        box: THRUST_BOX,
        power: STRING_POWER.leadThrust,
        kx: 6,
        ky: 0,
        slash: THRUST,
        feel: STRING_FEEL.thrust,
      },
    ],
  },
  secondThrust: {
    id: "secondThrust",
    name: "Second thrust",
    clip: "thrust2",
    pitch: 1.6,
    cancel: STRING_CANCEL.thrust,
    hits: [
      {
        at: onFrame(4),
        box: THRUST_BOX,
        power: STRING_POWER.secondThrust,
        kx: 6,
        ky: 0,
        slash: { ...THRUST, cy: -15 },
        feel: STRING_FEEL.thrust,
      },
    ],
  },
  risingThrust: {
    id: "risingThrust",
    name: "Rising thrust",
    clip: "thrust3",
    pitch: 1.4,
    cancel: STRING_CANCEL.thrust,
    hits: [
      {
        at: onFrame(4),
        box: RISING_BOX,
        power: STRING_POWER.risingThrust,
        kx: 8,
        ky: -20,
        stagger: 0.55,
        slash: RISING,
        feel: STRING_FEEL.rising,
      },
    ],
  },
  twinFlick: {
    id: "twinFlick",
    name: "Twin flick",
    clip: "flick",
    pitch: 1.75,
    cancel: STRING_CANCEL.flick,
    hits: [
      {
        at: onFrame(3),
        box: THRUST_BOX,
        power: STRING_POWER.flickFirst,
        kx: 4,
        ky: 0,
        slash: { ...THRUST, cy: -18, W: 2 },
        feel: STRING_FEEL.flick,
      },
      {
        at: onFrame(7),
        box: THRUST_BOX,
        power: STRING_POWER.flickSecond,
        kx: 6,
        ky: 0,
        slash: { ...THRUST, cy: -17, W: 2 },
        feel: STRING_FEEL.flick,
      },
    ],
  },
  longLunge: {
    id: "longLunge",
    name: "Long lunge",
    clip: "lunge",
    pitch: 0.9,
    cancel: STRING_CANCEL.lunge,
    hits: [
      {
        at: onFrame(5),
        box: LUNGE_BOX,
        power: STRING_POWER.longLunge,
        kx: 30,
        ky: 0,
        stun: LUNGE.stun,
        stagger: LUNGE.pin,
        slash: LUNGE_STREAK,
        feel: STRING_FEEL.lunge,
      },
    ],
    strides: [{ from: frame(2), to: frame(5), speed: LUNGE.speed }],
    enter: startLunge,
    afterHit: lungeLanded,
  },
} satisfies Record<string, MoveDef>;
