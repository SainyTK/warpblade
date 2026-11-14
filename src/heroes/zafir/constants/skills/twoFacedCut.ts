import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `behind` added damage share on a foe behind him, `wounds` extra wounds a cut behind opens, `both` Whirl a spin adds when it cuts both sides at once, `keenBoth` that spin makes the next one Keen, `bothWounds` it opens a wound on every foe it cut, `backAll` foes behind him take his cuts as back attacks */
const LEVELS = levelRows([
  { text: "Spins deal 20% more to foes behind you.", values: { behind: 0.2 } },
  { text: "Behind 20% to 35%.", values: { behind: 0.35 } },
  { text: "New: a cut behind you opens an extra wound.", values: { wounds: 1 } },
  { text: "New: a spin that cuts both sides at once adds 10 Whirl.", values: { both: 10 } },
  { text: "Behind 35% to 55%.", values: { behind: 0.55 } },
  { text: "New: a spin that cuts both sides makes the next spin Keen.", values: { keenBoth: 1 } },
  { text: "New: cutting both sides opens a wound on every foe cut.", values: { bothWounds: 1 } },
  { text: "Behind 55% to 90%; 20 Whirl for both sides.", values: { behind: 0.9, both: 20 } },
]);

export const TWO_FACED_CUT: SkillDef = {
  id: "za_twofaced",
  name: "Two-Faced Cut",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "Your spins hit harder on foes behind you, and cutting both sides at once pays off.",
  levels: LEVELS,
  evolution: {
    partner: "za_dune",
    name: "Mirror Dance",
    text: "Foes behind you take your cuts as back attacks, half again as hard.",
    row: evolvedRow(LEVELS[7], "Foes behind you take back attacks.", { backAll: 0.5 }),
  },
};
