import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { power: 3.85, reach: 80 } },
  { values: { guard: 1 } },
  { values: { power: 5.5 } },
  { values: { line: 1 } },
  { values: { back: 0.4, backTime: 1.5 } },
  { values: { reach: 120 } },
  { values: { echo: 0.6 } },
  { values: { power: 13.2, back: 1.5, backTime: 2 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "The second slash phases Kael behind the foe.", drill: { cut: 0 } },
  { text: "New: the phase cuts the foe for 0.5 AD.", drill: { cut: 0.5 } },
  { text: "New: Kael is untouchable through the phase.", drill: { inv: 0.25 } },
  { text: "Phase cut 0.5 to 1 AD.", drill: { cut: 1 } },
  { text: "New: the third slash after a phase cuts 0.5 AD more.", drill: { after: 0.5 } },
  { text: "Phase cut 1 to 1.8 AD.", drill: { cut: 1.8 } },
  { text: "After-phase cut 0.5 to 1.5 AD; untouchable longer.", drill: { after: 1.5, inv: 0.4 } },
  { text: "Phase cut 1.8 to 4 AD.", drill: { cut: 4 } },
]);

export const PHASE_CUT: SkillDef = {
  id: "k_phase",
  name: "Phase Cut",
  kind: "attack",
  element: "void",
  risk: "timed",
  button: "J",
  text: "When the second slash lands, Kael phases through the foe, so the third slash strikes its back.",
  levels: LEVELS,
  evolution: {
    partner: "k_blink",
    name: "Phantom Passage",
    text: "The phase runs through every foe up to 160 px ahead and cuts them all.",
    row: evolvedRow(LEVELS[7], "The phase runs through foes up to 160 px ahead.", {
      ...drillValues({ passage: 160 }),
      reach: 160,
      passage: 1,
    }),
  },
};
