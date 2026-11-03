import { ENEMY_AIR } from "../../../constants/combat";
import { FEEL, STAB_RAMP } from "../../../constants/combo";
import { PAL } from "../../../constants/palette";
import type { MoveDef } from "../../../types/move";
import { airHitLimit } from "../../../utils/comboChoice";
import { createFloorRing } from "../../effects/floorRing";
import { createSlash } from "../../effects/slash";
import { meleeHit } from "../../meleeHit";
import { game, hero } from "../../state";
import { boxAhead, dust, shake } from "../../world";
import { gravityPull } from "../gravityWell";
import { STAB } from "./slashes";

const WHIRL = { cx: 0, cy: -18, R: 25, sy: 0.85, rot: 0, a0: -1.6, a1: 1.5, W: 7 };
const DRILL = { ...STAB, R: 20, W: 4, ramp: STAB_RAMP };
const METEOR_REACH = 46;
/** the hammer fall dives from this time into the move, at this speed */
const HAMMER_DIVE = 0.16;
const HAMMER_DIVE_SPEED = 300;

/** the plunge lands: a ring of crystal, dust, and everything near the floor bounced up */
function meteorLanding(): void {
  game.swing++;
  game.fx.push(createFloorRing(hero.x, hero.y, METEOR_REACH, PAL.crystal, 0.45));
  game.fx.push(
    createSlash(hero.x, hero.y, hero.face, { cx: 0, cy: -4, R: 30, sy: 0.25, rot: 0, a0: 3.1, a1: 0, W: 7 }),
  );
  dust(hero.x - 8, hero.y, 6, -1);
  dust(hero.x + 8, hero.y, 6, 1);
  shake(0.25, 3);
  meleeHit([boxAhead(-METEOR_REACH, -26, METEOR_REACH, 4)], {
    power: 1.8,
    kx: 60,
    ky: 0,
    launch: -240,
    big: true,
    feel: FEEL.crush,
  });
  gravityPull();
}

/** the air string: a cross cut, a somersault cut that lifts Kael, a drill of three stabs, then the hammer that spikes */
export const AIR_MOVES = {
  airCross: {
    id: "airCross",
    turns: true,
    name: "Air cross",
    clip: "airCross",
    pitch: 1.1,
    hits: [
      {
        at: 0.08,
        box: [-4, -40, 30, 6],
        power: 1.1,
        kx: 50,
        ky: -20,
        slash: { cx: 4, cy: -22, R: 22, sy: 0.5, rot: -0.2, a0: -2.4, a1: 0.8, W: 8 },
        feel: FEEL.light,
      },
    ],
    strides: [{ from: 0.02, to: 0.1, speed: 150 }],
  },
  airSomersault: {
    id: "airSomersault",
    turns: true,
    name: "Somersault cut",
    clip: "airFlip",
    pitch: 1.25,
    hits: [
      {
        at: 0.1,
        box: [-8, -48, 28, 4],
        power: 1.1,
        kx: 30,
        ky: -40,
        slash: { cx: 2, cy: -21, R: 20, sy: 0.95, rot: 0, a0: 2.6, a1: 5.9, W: 7, sweep: 0.07 },
        feel: { ...FEEL.light, pitch: 1.3 },
      },
    ],
    lift: 18,
  },
  airDrill: {
    id: "airDrill",
    turns: true,
    name: "Drill stabs",
    clip: "airDrill",
    pitch: 1.5,
    hits: [
      { at: 0.06, box: [0, -26, 36, -8], power: 0.5, kx: 20, ky: 0, slash: DRILL, feel: FEEL.tap },
      { at: 0.12, box: [0, -24, 36, -6], power: 0.5, kx: 20, ky: 0, slash: { ...DRILL, cy: -15 }, feel: FEEL.tap },
      {
        at: 0.18,
        box: [0, -26, 38, -6],
        power: 0.6,
        kx: 60,
        ky: 0,
        slash: { ...DRILL, cy: -17, R: 24, W: 5 },
        feel: { ...FEEL.light, pitch: 1.5 },
      },
    ],
    strides: [{ from: 0, to: 0.2, speed: 130 }],
  },
  airSpike: {
    id: "airSpike",
    turns: true,
    name: "Hammer fall",
    clip: "airHammer",
    pitch: 0.75,
    falls: true,
    hits: [
      {
        at: 0.16,
        box: [-4, -40, 36, 8],
        power: 2,
        kx: 90,
        ky: ENEMY_AIR.spike,
        spike: true,
        big: true,
        slash: { cx: 8, cy: -18, R: 24, sy: 0.85, rot: 0.2, a0: -2.0, a1: 1.4, W: 11, hold: 0.06, trail: 0.26 },
        feel: FEEL.heavy,
      },
    ],
    afterHit: gravityPull,
    // the hammer ends the air string: no air attack is left until Kael lands
    enter: () => {
      hero.airHits = airHitLimit(true);
    },
    // a small rise under the raised blade, then a dive after the foe it spikes
    step: (t) => {
      if (hero.ground) return;
      hero.vy = t < HAMMER_DIVE ? Math.min(hero.vy, -20) : HAMMER_DIVE_SPEED;
    },
  },
  whirl: {
    id: "whirl",
    name: "Whirlwind",
    clip: "spin",
    pitch: 1.2,
    hits: [
      {
        at: 0.06,
        box: [-4, -42, 28, 6],
        power: 0.7,
        kx: 30,
        ky: 0,
        launch: -150,
        around: true,
        slash: WHIRL,
        feel: FEEL.tap,
      },
      {
        at: 0.14,
        box: [-4, -42, 28, 6],
        power: 0.7,
        kx: 30,
        ky: 0,
        launch: -150,
        around: true,
        slash: { ...WHIRL, a0: 1.5, a1: 4.6 },
        feel: FEEL.tap,
      },
      {
        at: 0.22,
        box: [-4, -42, 28, 6],
        power: 0.7,
        kx: 30,
        ky: 0,
        launch: -170,
        around: true,
        slash: WHIRL,
        feel: FEEL.light,
      },
    ],
    lift: 14,
    enter: () => {
      hero.whirled = true;
    },
  },
  meteor: {
    id: "meteor",
    name: "Meteor drop",
    clip: "plunge",
    hits: [],
    guard: 9,
    untilLanding: true,
    falls: true,
    pitch: 0.6,
    lift: 6,
    enter: () => {
      hero.vx = hero.face * 30;
    },
    step: (t) => {
      if (t > 0.1) hero.vy = 460;
    },
    land: meteorLanding,
  },
} satisfies Record<string, MoveDef>;
