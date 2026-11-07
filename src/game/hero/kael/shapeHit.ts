import type { MoveHit, MoveId } from "../../../types/move";
import type { Box } from "../../../types/world";
import { skillValues, withCharms } from "../../skills/query";
import { hero, progress } from "../../state";
import { phaseLength } from "../moves/finishers";
import { kael } from "./state";

/** Skybreaker's launch reaches a short way ahead until its second level, then a tall box far ahead */
const LAUNCH_BOX: Readonly<Record<"narrow" | "wide", Box>> = { narrow: [-4, -50, 24, 0], wide: [-6, -62, 40, 2] };
/** the low sweep pulls foes in this hard for each pixel of Reaping Sweep's drag */
const DRAG_KICK = 7.5;
/** Phantom Passage's finisher: it cuts this far on each side */
const PASSAGE_REACH = 60;

/** the 4th hit: Skybreaker's launch */
function launch(hit: MoveHit): MoveHit {
  const v = skillValues("k_skyward");
  return {
    ...hit,
    power: v.launch,
    box: LAUNCH_BOX[v.wide ? "wide" : "narrow"],
    around: !!v.behind || kael.passage,
  };
}

/** the 1st hit: Reaping Sweep's low sweep */
function sweep(hit: MoveHit): MoveHit {
  const v = skillValues("k_reap");
  const reach = withCharms("area", v.reach);
  return { ...hit, power: v.power, box: [-2, -16, reach, 2], kx: -v.drag * DRAG_KICK, around: !!v.behind };
}

/** the 3rd hit: Phase Cut, which cuts every foe on its pass from its fourth level */
function phaseCut(hit: MoveHit): MoveHit {
  const v = skillValues("k_phase");
  const pass = v.line ? phaseLength() : 0;
  return { ...hit, power: v.power, big: !!v.guard, box: [-6, -38, Math.max(30, pass + 6), 0] };
}

/** the last hit after Phantom Passage strikes every foe around Kael from its back */
function passageFinish(hit: MoveHit): MoveHit {
  return { ...hit, around: true, box: [-4, hit.box[1], PASSAGE_REACH, hit.box[3]] };
}

/** a combo move's blow as Kael's skills shape it: power, reach, guard break */
export function shapeHit(id: MoveId, hit: MoveHit): MoveHit {
  let shaped = hit;
  if (id === "skybreaker") shaped = launch(hit);
  else if (id === "sweep") shaped = sweep(hit);
  else if (id === "phaseCut") shaped = phaseCut(hit);
  else if (id === "hopCleave" && hero.chain >= progress.comboLimit)
    shaped = { ...hit, power: skillValues("k_keen").cleave, stun: 0.8 };
  if (kael.passage && id === "smash") shaped = passageFinish(shaped);
  if (hero.keen && skillValues("k_keen").guardBreak) shaped = { ...shaped, big: true };
  return shaped;
}
