import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Frenzy calls a forebear: it swings on every third blow and at once on a parry, 1x.",
    values: { every: 3, power: 1, both: 0, answer: 0, stagger: 0, outlast: 0, host: 0 },
  },
  { text: "1.4x.", values: { power: 1.4 } },
  { text: "It swings on every second blow.", values: { every: 2 } },
  { text: "It cleaves both sides.", values: { both: 1 } },
  { text: "Blood Answer's free Frenzy lasts 2 s longer.", values: { answer: 2 } },
  { text: "Its swing staggers and marks minions; 1.8x.", values: { stagger: 1, power: 1.8 } },
  { text: "It stays 2 s after Frenzy.", values: { outlast: 2 } },
  { text: "2.4x.", values: { power: 2.4 } },
]);

/** Forebear. Design: docs/skills/brannoc.md. Values: every: his blows between the forebear's swings (a parry makes it swing at once); power: attack damage each swing deals; both: 1 it cleaves both sides; answer: seconds a parry's Blood Answer adds to its free Frenzy; stagger: 1 its swing staggers minions and marks them; outlast: seconds it stays after Frenzy ends; host: forebears that stand with him through Berserk (evolution) */
export const FOREBEAR: SkillDef = {
  id: "b_ancestor",
  name: "Forebear",
  kind: "summon",
  risk: "timed",
  button: "K",
  text: "Frenzy, from I or from a parry's Blood Answer (K), calls a ghostly forebear who swings with him and answers each parry.",
  levels: LEVELS,
  evolution: {
    partner: "b_berserk",
    name: "Host of Forebears",
    text: "Three forebears stand with him through Berserk too.",
    row: evolvedRow(LEVELS[7], "Three forebears stand with him through Berserk.", { host: 3 }),
  },
};
