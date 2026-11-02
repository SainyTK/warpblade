import { FEEL } from "../../../constants/combo";
import { PAL, WORLD_COLORS } from "../../../constants/palette";
import type { MoveDef } from "../../../types/move";
import { PK } from "../../../types/particle";
import { createFloorRing } from "../../effects/floorRing";
import { createSlash } from "../../effects/slash";
import { game, hero, particles, rng } from "../../state";
import { dust, shake } from "../../world";
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
      ramp: PAL.crystal.slice(0, 6),
    }),
  );
  if (!hero.ground) return;
  const gx = hero.x + hero.face * 22;
  game.fx.push(createFloorRing(gx, hero.y, 30, PAL.crystal, 0.35));
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

/** the hop cleave comes down: a small ring and dust where the blade meets the floor */
function cleaveImpact(): void {
  const gx = hero.x + hero.face * 18;
  game.fx.push(createFloorRing(gx, hero.y, 18, PAL.crystal, 0.25));
  dust(gx, hero.y, 4, hero.face);
}

/**
 * The plain ground string, one routine: a step-in cut, a rising backhand, a lunging double stab,
 * a hop into an overhead cleave, a turn that cuts front then back, and the falling smash that knocks down.
 */
export const CHAIN_MOVES = {
  stepCut: {
    id: "stepCut",
    turns: true,
    name: "Step cut",
    clip: "atk1",
    pitch: 1,
    hits: [{ at: 0.09, box: [-2, -38, 30, -2], power: 1.1, kx: 70, ky: -20, slash: CROSS, feel: FEEL.light }],
    strides: [{ from: 0, to: 0.1, speed: 95 }],
  },
  risingBackhand: {
    id: "risingBackhand",
    turns: true,
    name: "Rising backhand",
    clip: "atk2",
    pitch: 1.15,
    hits: [
      {
        at: 0.09,
        box: [-4, -46, 26, -2],
        power: 1.1,
        kx: 40,
        ky: -70,
        slash: RISING,
        feel: { ...FEEL.light, pitch: 1.25 },
      },
    ],
    strides: [{ from: 0, to: 0.06, speed: 40 }],
  },
  twinFang: {
    id: "twinFang",
    turns: true,
    name: "Twin fang",
    clip: "twinFang",
    pitch: 1.4,
    ghosts: 0.12,
    hits: [
      { at: 0.07, box: [0, -26, 36, -12], power: 0.7, kx: 30, ky: 0, slash: STAB, feel: FEEL.tap },
      {
        at: 0.15,
        box: [0, -24, 38, -8],
        power: 0.8,
        kx: 130,
        ky: -20,
        slash: { ...STAB, cy: -14, R: 24 },
        feel: { ...FEEL.light, pitch: 1.4 },
      },
    ],
    strides: [
      { from: 0, to: 0.07, speed: 150 },
      { from: 0.1, to: 0.15, speed: 60 },
    ],
  },
  hopCleave: {
    id: "hopCleave",
    turns: true,
    name: "Hop cleave",
    clip: "hopCleave",
    falls: true,
    hop: true,
    pitch: 0.85,
    hits: [
      {
        at: 0.2,
        box: [-2, -44, 32, 2],
        power: 1.5,
        kx: 140,
        ky: 0,
        slash: CLEAVE,
        feel: FEEL.firm,
      },
    ],
    enter: () => {
      hero.ground = false;
      hero.vy = -170;
    },
    strides: [{ from: 0, to: 0.2, speed: 55 }],
    afterHit: cleaveImpact,
  },
  crescentTurn: {
    id: "crescentTurn",
    turns: true,
    name: "Crescent turn",
    clip: "crescent",
    pitch: 1.05,
    hits: [
      { at: 0.07, box: [-4, -38, 30, -2], power: 0.9, kx: 80, ky: -30, slash: FLAT_FRONT, feel: FEEL.light },
      {
        at: 0.17,
        box: [-4, -38, 30, -2],
        power: 0.9,
        kx: 110,
        ky: -30,
        around: true,
        slash: FLAT_BACK,
        feel: { ...FEEL.light, pitch: 0.95 },
      },
    ],
    strides: [{ from: 0.08, to: 0.18, speed: 70 }],
  },
  smash: {
    id: "smash",
    turns: true,
    name: "Falling smash",
    clip: "atk3",
    pitch: 0.7,
    hits: [
      {
        at: 0.16,
        box: [-2, -40, 38, 2],
        power: 2.2,
        kx: 220,
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
        feel: FEEL.crush,
      },
    ],
    strides: [{ from: 0.1, to: 0.17, speed: 150 }],
    afterHit: smashImpact,
  },
} satisfies Record<string, MoveDef>;
