import type { KitId } from "../../types/kit";
import type { SkillBehavior, SkillMemory, SkillState } from "../../types/skillBehavior";
import { eachHero, eachStanding } from "../coopHooks";
import { rememberPerSeat } from "../seatMemory";
import { character, progress } from "../state";
import { BRANNOC_SKILLS } from "./brannoc/index";
import { HULDA_SKILLS } from "./hulda/index";
import { JORY_SKILLS } from "./jory/index";
import { KAEL_SKILLS } from "./kael/index";
import { MIREL_SKILLS } from "./mirel/index";
import { ORRIN_SKILLS } from "./orrin/index";
import { SABLE_SKILLS } from "./sable/index";
import { TALLIS_SKILLS } from "./tallis/index";
import { WENNA_SKILLS } from "./wenna/index";
import { YSRA_SKILLS } from "./ysra/index";

const BEHAVIORS: Readonly<Record<KitId, Readonly<Record<string, SkillBehavior>>>> = {
  kael: KAEL_SKILLS,
  ysra: YSRA_SKILLS,
  sable: SABLE_SKILLS,
  hulda: HULDA_SKILLS,
  orrin: ORRIN_SKILLS,
  mirel: MIREL_SKILLS,
  wenna: WENNA_SKILLS,
  tallis: TALLIS_SKILLS,
  jory: JORY_SKILLS,
  brannoc: BRANNOC_SKILLS,
};

/** each held skill's live state for the hero in play: projectiles, summons, timers, foes in reach. Kept to the host,
 *  since it can hold foes and many projectiles and a guest's HUD never reads it. */
let memory: Record<string, SkillMemory> = {};
rememberPerSeat({
  hostOnly: true,
  save: () => memory,
  load(saved) {
    memory = (saved as typeof memory | undefined) ?? {};
  },
});

/** a new run: no skill remembers anything */
export function forgetSkills(): void {
  memory = {};
}

/** each skill with code that the hero in play holds, with its memory made on first use */
export function eachHeldBehavior(run: (b: SkillBehavior, memory: SkillMemory, state: SkillState) => void): void {
  const build = progress.build;
  const behaviors = BEHAVIORS[character.kit];
  for (const [id, level] of Object.entries(build.skills)) {
    const b = behaviors[id];
    if (!b) continue;
    memory[id] ??= b.create();
    run(b, memory[id], { level, evolved: build.evolved.includes(id) });
  }
}

/** every standing hero's skills act */
export function updateSkills(dt: number): void {
  eachStanding(() => eachHeldBehavior((b, m, s) => b.update?.(m, s, dt)));
}

/** every hero's skills, behind the heroes and foes */
export function drawSkillsBack(): void {
  eachHero(() => eachHeldBehavior((b, m, s) => b.drawBack?.(m, s)));
}

/** every hero's skills, in front of the heroes */
export function drawSkills(): void {
  eachHero(() => eachHeldBehavior((b, m, s) => b.draw?.(m, s)));
}
