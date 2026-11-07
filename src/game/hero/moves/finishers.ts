import { FEEL, PHANTOM_RAMP } from "../../../constants/combo";
import { W } from "../../../constants/stage";
import type { Enemy } from "../../../types/enemy";
import type { MoveDef } from "../../../types/move";
import { clamp, lerp } from "../../../utils/math";
import { createSlash } from "../../effects/slash";
import { enemyCenter } from "../../enemies/enemy";
import { objectMemory, rememberPerSeat } from "../../seatMemory";
import { skillEvolved, skillValues, withCharms } from "../../skills/query";
import { game, hero } from "../../state";
import { leaveAfterimages } from "../afterimages";
import { kael } from "../kael/state";
import { THRUST_SLASH, UPPERCUT } from "./slashes";

/** the phase cut runs from here to there in its first frames */
const phase = { from: 0, to: 0, turned: false };
rememberPerSeat(objectMemory(phase));
/** Phase Cut keeps Kael out of harm's way this long in the pass, from its second level */
const PHASE_GUARD = 0.25;

/** the foe the phase cut passes: the nearest ahead within reach, or as Phantom Passage the farthest */
function phaseFoe(reach: number, passage: boolean): Enemy | undefined {
  const ahead = game.enemies
    .filter((e) => e.hp > 0 && (e.x - hero.x) * hero.face > -4 && Math.abs(e.x - hero.x) < reach)
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x));
  return passage ? ahead[ahead.length - 1] : ahead[0];
}

function phaseEnter(): void {
  const v = skillValues("k_phase");
  const passage = skillEvolved("k_phase");
  const ahead = phaseFoe(withCharms("area", v.reach ?? 80), passage);
  kael.passage = passage;
  if (v.guard) hero.inv = Math.max(hero.inv, PHASE_GUARD);
  const past = ahead ? ahead.x + hero.face * (Math.abs(enemyCenter(ahead)[0] - ahead.x) + 18) : hero.x + hero.face * 50;
  phase.from = hero.x;
  phase.to = clamp(past, 10, W - 10);
  phase.turned = false;
  leaveAfterimages(hero.x, hero.y, phase.to, hero.y);
}
/** how far the last phase cut carried Kael, for Phase Cut's cut along the whole pass */
export const phaseLength = (): number => Math.abs(phase.to - phase.from);

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

/** moves that carry Kael through or up: Phase Cut's pass and Skybreaker's launch */
export const FINISHER_MOVES = {
  phaseCut: {
    id: "phaseCut",
    name: "Phase cut",
    clip: "phase",
    pitch: 1.3,
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
    lift: 22,
    afterHit: () => {
      game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...UPPERCUT, R: 20, W: 5, t0: 0.02 }));
    },
  },
} satisfies Record<string, MoveDef>;
