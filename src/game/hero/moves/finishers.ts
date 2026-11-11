import { onFrame, PHANTOM_RAMP } from "../../../constants/combo";
import { frame } from "../../../constants/hero";
import { PHASE, SKILL_CANCEL, SKILL_FEEL, SKYBREAKER } from "../../../constants/kael/skillBlows";
import { STRING_CANCEL } from "../../../constants/kael/string";
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
import { lift } from "../lift";
import { UPPERCUT } from "./slashes";

/** the phase cut runs from here to there between `PHASE.from` and `PHASE.to`, then turns to the foe it passed */
const phase = { from: 0, to: 0, passed: false, turned: false };
rememberPerSeat(objectMemory(phase));
/** Phase Cut keeps Kael out of harm's way this long from the start of the move, through the pass, from its second level */
const PHASE_GUARD = 0.25;
/** the cut shown along the pass, behind Kael as he lands on the far side */
const PHASE_SLASH = { cx: -12, cy: -18, R: 24, sy: 0.16, rot: 0, a0: -0.5, a1: -3.39, W: 8, ramp: PHANTOM_RAMP };

/** the foe the phase cut passes: the nearest ahead within reach, or as Phantom Passage the farthest */
function phaseFoe(reach: number, passage: boolean): Enemy | undefined {
  const ahead = game.enemies
    .filter((e) => e.hp > 0 && (e.x - hero.x) * hero.face > -4 && Math.abs(e.x - hero.x) < reach)
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x));
  return passage ? ahead[ahead.length - 1] : ahead[0];
}

function phaseEnter(): void {
  const v = skillValues("k_phase");
  kael.passage = skillEvolved("k_phase");
  if (v.guard) hero.inv = Math.max(hero.inv, PHASE_GUARD);
  phase.passed = false;
  phase.turned = false;
}

/** the coil is over: the pass is aimed past the foe ahead as it stands now, and the afterimages trail along it */
function startPass(): void {
  const v = skillValues("k_phase");
  const ahead = phaseFoe(withCharms("area", v.reach ?? 80), kael.passage);
  const past = ahead ? ahead.x + hero.face * (Math.abs(enemyCenter(ahead)[0] - ahead.x) + 18) : hero.x + hero.face * 50;
  phase.from = hero.x;
  phase.to = clamp(past, 10, W - 10);
  phase.passed = true;
  leaveAfterimages(phase.from, hero.y, phase.to, hero.y);
}
/** how far the last phase cut carried Kael, for Phase Cut's cut along the whole pass */
export const phaseLength = (): number => Math.abs(phase.to - phase.from);

/** planted through the coil, through the foe in a blink, then the turn to face it */
function phaseStep(t: number): void {
  hero.vx = 0;
  if (t < PHASE.from) return;
  if (!phase.passed) startPass();
  hero.x = lerp(phase.from, phase.to, Math.min(1, (t - PHASE.from) / (PHASE.to - PHASE.from)));
  if (phase.turned || t < PHASE.turn) return;
  phase.turned = true;
  hero.face = -hero.face;
}

/** moves that carry Kael through or up: Phase Cut's pass and Skybreaker's launch */
export const FINISHER_MOVES = {
  phaseCut: {
    id: "phaseCut",
    name: "Phase cut",
    clip: "phase",
    pitch: 1.3,
    cancel: SKILL_CANCEL.phaseCut,
    // dealt as Kael lands on the far side, still facing on: the foe is behind him
    hits: [
      {
        at: onFrame(5),
        box: [-30, -38, 6, 0],
        power: 1.8,
        kx: 20,
        ky: -20,
        big: true,
        wall: true,
        slash: PHASE_SLASH,
        feel: SKILL_FEEL.phaseCut,
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
    cancel: STRING_CANCEL.finisher,
    hits: [
      {
        at: onFrame(7),
        box: [-6, -58, 34, 2],
        power: 1.6,
        kx: 30,
        ky: 0,
        launch: SKYBREAKER.launch,
        big: true,
        slash: { ...UPPERCUT, R: 27, W: 11 },
        feel: SKILL_FEEL.skybreaker,
      },
    ],
    strides: [{ from: frame(3), to: frame(7), speed: SKYBREAKER.step }],
    // Kael rises with the foe off the blow itself, so the crouch before it stays on the floor
    afterHit: () => {
      lift(SKYBREAKER.rise, false);
      game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...UPPERCUT, R: 20, W: 5, t0: 0.02 }));
    },
  },
} satisfies Record<string, MoveDef>;
