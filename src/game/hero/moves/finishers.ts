import { FEEL, PHANTOM_RAMP } from "../../../constants/combo";
import { W } from "../../../constants/stage";
import type { MoveDef } from "../../../types/move";
import { clamp, lerp } from "../../../utils/math";
import { createSlash } from "../../effects/slash";
import { enemyCenter } from "../../enemies/enemy";
import { game, hero } from "../../state";
import { leaveAfterimages } from "../afterimages";
import { THRUST_SLASH, UPPERCUT } from "./slashes";

const PHASE_REACH = 80;
/** the phase cut runs from here to there in its first frames */
const phase = { from: 0, to: 0, turned: false };

function phaseEnter(): void {
  const ahead = game.enemies
    .filter((e) => e.hp > 0 && (e.x - hero.x) * hero.face > -4 && Math.abs(e.x - hero.x) < PHASE_REACH)
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x))[0];
  const past = ahead ? ahead.x + hero.face * (Math.abs(enemyCenter(ahead)[0] - ahead.x) + 18) : hero.x + hero.face * 50;
  phase.from = hero.x;
  phase.to = clamp(past, 10, W - 10);
  phase.turned = false;
  leaveAfterimages(hero.x, hero.y, phase.to, hero.y);
}
function phaseStep(t: number): void {
  if (t < 0.07) {
    hero.x = lerp(phase.from, phase.to, t / 0.07);
    hero.vx = 0;
  } else if (!phase.turned) {
    phase.turned = true;
    hero.x = phase.to;
    hero.face = -hero.face;
  }
}

/** finishers and dash attacks: they move Kael as much as they hurt */
export const FINISHER_MOVES = {
  phaseCut: {
    id: "phaseCut",
    name: "Phase cut",
    clip: "phase",
    pitch: 1.3,
    finisher: true,
    guard: 0.25,
    hits: [
      {
        at: 0.09,
        box: [-6, -38, 30, 0],
        power: 1.8,
        kx: 60,
        ky: -30,
        big: true,
        wall: true,
        slash: { ...THRUST_SLASH, R: 28, W: 8, ramp: PHANTOM_RAMP },
        feel: FEEL.heavy,
      },
    ],
    enter: phaseEnter,
    step: phaseStep,
  },
  backflip: {
    id: "backflip",
    name: "Back flip",
    clip: "flip",
    pitch: 0.9,
    finisher: true,
    guard: 0.4,
    falls: true,
    hits: [
      {
        at: 0.05,
        box: [-2, -38, 36, 0],
        power: 1.4,
        kx: 320,
        ky: -80,
        big: true,
        wall: true,
        slash: { cx: 4, cy: -21, R: 24, sy: 0.62, rot: -0.35, a0: -2.5, a1: 0.95, W: 10 },
        feel: FEEL.heavy,
      },
    ],
    enter: () => {
      hero.ground = false;
      hero.vy = -230;
    },
    step: (t) => {
      if (t > 0.05) hero.vx = -hero.face * 170;
    },
  },
  skybreaker: {
    id: "skybreaker",
    name: "Skybreaker",
    clip: "skyRend",
    pitch: 0.7,
    falls: true,
    finisher: true,
    hits: [
      {
        at: 0.1,
        box: [-6, -58, 34, 2],
        power: 1.6,
        kx: 30,
        ky: 0,
        launch: -430,
        big: true,
        slash: { ...UPPERCUT, R: 27, W: 11 },
        feel: FEEL.crush,
      },
    ],
    enter: () => {
      hero.ground = false;
      hero.vy = -200;
    },
    afterHit: () => {
      game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...UPPERCUT, R: 20, W: 5, t0: 0.02 }));
    },
  },
  dashStrike: {
    id: "dashStrike",
    name: "Dash strike",
    clip: "dashCut",
    pitch: 1.2,
    guard: 0.3,
    ghosts: 0.14,
    hits: [
      {
        at: 0.05,
        box: [-16, -36, 22, 0],
        power: 1,
        kx: 40,
        ky: -20,
        slash: { cx: 6, cy: -20, R: 22, sy: 0.6, rot: 0.1, a0: -2.2, a1: 1.1, W: 7 },
        feel: FEEL.light,
      },
      {
        at: 0.14,
        box: [-8, -46, 26, 0],
        power: 1,
        kx: 30,
        ky: -60,
        slash: { ...UPPERCUT, W: 7 },
        feel: { ...FEEL.firm, pitch: 1.2 },
      },
    ],
    step: (t) => {
      hero.vx = t < 0.14 ? hero.face * 320 : hero.vx * 0.85;
    },
  },
} satisfies Record<string, MoveDef>;
