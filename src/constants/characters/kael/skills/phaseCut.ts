import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` of the phase cut, `reach` how far it travels, `guard` untouchable and guard-breaking, `line` every foe
 *  passed is cut, `back` added damage of back attacks for `backTime` after a phase, `echo` share an afterimage repeats */
const LEVELS = levelRows([
  { text: "The 3rd hit passes through the foe, so the 4th lands from behind.", values: { power: 3.5, reach: 80 } },
  { text: "New: Kael cannot be hurt in the pass, and it breaks guards.", values: { guard: 1 } },
  { text: "Phase cut power 3.5 to 5.", values: { power: 5 } },
  { text: "New: every foe passed through is cut.", values: { line: 1 } },
  { text: "New: back attacks deal +40% for 1.5 s after a phase.", values: { back: 0.4, backTime: 1.5 } },
  { text: "Reach 80 to 120 px.", values: { reach: 120 } },
  { text: "New: an afterimage repeats the phase cut.", values: { echo: 0.6 } },
  { text: "Phase cut power 5 to 12; back attacks +150% for 2 s.", values: { power: 12, back: 1.5, backTime: 2 } },
]);

export const PHASE_CUT: SkillDef = {
  id: "k_phase",
  name: "Phase Cut",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "The third hit cuts through the foe and turns, so the finisher lands on its back.",
  levels: LEVELS,
  evolution: {
    partner: "k_blink",
    name: "Phantom Passage",
    text: "The phase cut runs through every foe within 160 px ahead, and the finisher strikes them all from behind.",
    row: evolvedRow(LEVELS[7], "The phase passes every foe ahead; the finisher hits all.", { reach: 160, passage: 1 }),
  },
};
