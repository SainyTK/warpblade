import { HERO_MOVE } from "../../../constants/combat";
import { onFrame } from "../../../constants/combo";
import { frame } from "../../../constants/hero";
import { HOP_CLEAVE, SKILL_CANCEL, SKILL_FEEL } from "../../../constants/kael/skillBlows";
import { STRING_CANCEL, STRING_FEEL } from "../../../constants/kael/string";
import { WORLD_COLORS } from "../../../constants/palette";
import type { MoveDef } from "../../../types/move";
import { PK } from "../../../types/particle";
import { createFloorRing } from "../../effects/floorRing";
import { createSlash } from "../../effects/slash";
import { objectMemory, rememberPerSeat } from "../../seatMemory";
import { game, hero, particles, rng } from "../../state";
import { dust, shake } from "../../world";
import { lift } from "../lift";
import { skin } from "../skin";
import { CLEAVE, CROSS, FLAT_BACK, FLAT_FRONT, RISING, STAB } from "./slashes";

/** the smash lands: a second crescent, and on the floor a ring, dust and rubble */
function smashImpact(): void {
  game.fx.push(
    createSlash(hero.x, hero.y, hero.face, {
      cx: 6,
      cy: -22,
      sy: 0.55,
      rot: -0.15,
      R: 21,
      a0: -2.0,
      a1: 1.15,
      W: 5,
      t0: 0.017,
      sweep: 0.06,
      hold: 0.03,
      trail: 0.2,
      ramp: skin.ramp.slice(0, 6),
    }),
  );
  if (!hero.ground) return;
  const gx = hero.x + hero.face * 22;
  game.fx.push(createFloorRing(gx, hero.y, 30, skin.ramp, 0.35));
  dust(gx, hero.y, 7, hero.face);
  for (let i = 0; i < 6; i++)
    particles.spawn(
      PK.SHARD,
      gx,
      hero.y - 1,
      hero.face * rng.range(20, 120),
      rng.range(-180, -60),
      rng.range(0.5, 0.9),
      {
        col: WORLD_COLORS.rubble,
        size: rng.range(1.5, 3),
      },
    );
  shake(0.2, 2);
}

/** whether the hop cleave in play has left the floor yet */
const hop = { done: false };
rememberPerSeat(objectMemory(hop));
/** the hop's height, so it comes down on the cleave's hit frame */
const HOP_RISE = (HERO_MOVE.gravity * (HOP_CLEAVE.land - HOP_CLEAVE.off) ** 2) / 8;

/** the hop cleave hops off its crouch so it lands on its hit frame */
function hopStep(t: number): void {
  if (hop.done || t < HOP_CLEAVE.off) return;
  hop.done = true;
  lift(HOP_RISE, false);
}

/** the hop cleave comes down: a small ring and dust where the blade meets the floor */
function cleaveImpact(): void {
  const gx = hero.x + hero.face * 18;
  game.fx.push(createFloorRing(gx, hero.y, 18, skin.ramp, 0.25));
  dust(gx, hero.y, 4, hero.face);
}

/**
 * The ground string, one routine: a step-in cut, a rising backhand, a lunging double stab and the falling smash that
 * knocks down, with the blows skills put in it: Keen Edge's hop into an overhead cleave and Reaping Sweep's turn that
 * cuts front then back.
 */
export const CHAIN_MOVES = {
  stepCut: {
    id: "stepCut",
    name: "Step cut",
    clip: "atk1",
    pitch: 1,
    cancel: STRING_CANCEL.stepCut,
    hits: [
      {
        at: onFrame(5),
        box: [-2, -38, 30, -2],
        power: 1.15,
        kx: 10,
        ky: -20,
        slash: CROSS,
        feel: STRING_FEEL.stepCut,
      },
    ],
  },
  risingBackhand: {
    id: "risingBackhand",
    name: "Rising backhand",
    clip: "atk2",
    pitch: 1.15,
    cancel: STRING_CANCEL.risingBackhand,
    hits: [
      {
        at: onFrame(5),
        box: [-4, -46, 26, -2],
        power: 1.15,
        kx: 10,
        ky: -40,
        slash: RISING,
        feel: STRING_FEEL.risingBackhand,
      },
    ],
  },
  twinFang: {
    id: "twinFang",
    name: "Twin fang",
    clip: "twinFang",
    pitch: 1.4,
    cancel: STRING_CANCEL.twinFang,
    hits: [
      {
        at: onFrame(5),
        box: [0, -26, 36, -12],
        power: 0.75,
        kx: 10,
        ky: 0,
        slash: STAB,
        feel: STRING_FEEL.twinFangFirst,
      },
      {
        at: onFrame(10),
        box: [0, -24, 38, -8],
        power: 0.85,
        kx: 15,
        ky: -20,
        slash: { ...STAB, cy: -14, R: 24 },
        feel: STRING_FEEL.twinFangSecond,
      },
    ],
  },
  hopCleave: {
    id: "hopCleave",
    name: "Hop cleave",
    clip: "hopCleave",
    falls: true,
    hop: true,
    pitch: 0.85,
    cancel: STRING_CANCEL.finisher,
    hits: [
      {
        at: onFrame(8),
        box: [-2, -44, 32, 4],
        power: 1.5,
        kx: 30,
        ky: 0,
        slash: CLEAVE,
        feel: SKILL_FEEL.hopCleave,
      },
    ],
    strides: [{ from: HOP_CLEAVE.off, to: HOP_CLEAVE.land, speed: HOP_CLEAVE.speed }],
    enter: () => {
      hop.done = false;
    },
    step: hopStep,
    afterHit: cleaveImpact,
  },
  crescentTurn: {
    id: "crescentTurn",
    name: "Crescent turn",
    clip: "crescent",
    pitch: 1.05,
    cancel: SKILL_CANCEL.crescentTurn,
    hits: [
      {
        at: onFrame(5),
        box: [-4, -38, 30, -2],
        power: 1.32,
        kx: 10,
        ky: -10,
        slash: FLAT_FRONT,
        feel: SKILL_FEEL.crescentFront,
      },
      {
        at: onFrame(10),
        box: [-4, -38, 30, -2],
        power: 1.32,
        kx: 15,
        ky: -20,
        around: true,
        slash: FLAT_BACK,
        feel: SKILL_FEEL.crescentBack,
      },
    ],
  },
  smash: {
    id: "smash",
    name: "Falling smash",
    clip: "atk3",
    pitch: 0.7,
    cancel: STRING_CANCEL.finisher,
    hits: [
      {
        at: onFrame(7),
        box: [-2, -40, 38, 2],
        power: 2.35,
        kx: 60,
        ky: -60,
        stun: 0.8,
        big: true,
        wall: true,
        slash: {
          cx: 6,
          cy: -22,
          sy: 0.55,
          rot: -0.15,
          R: 27,
          a0: -2.3,
          a1: 1.25,
          W: 12,
          sweep: 0.06,
          hold: 0.07,
          trail: 0.28,
        },
        feel: STRING_FEEL.smash,
      },
    ],
    strides: [{ from: frame(3), to: frame(7), speed: 250 }],
    afterHit: smashImpact,
  },
} satisfies Record<string, MoveDef>;
