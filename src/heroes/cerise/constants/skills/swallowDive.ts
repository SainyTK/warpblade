import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, withDrill } from "./drillRows";

/** values: `power` added share of the diving thrust, level 2 adds an air thrust before it, `land` AD of the landing cut
 *  on both sides, `pin` seconds the dive pins, `points` a dive that strikes gives, `ring` px the landing reaches
 *  farther; evolved `lines` Rose Lines the landing sends each way, at `linePower` AP */
const NATIVE = levelRows([
  { text: "The diving thrust deals +60% damage.", values: { power: 0.6 } },
  { text: "New: an air thrust before the dive.", values: { air: 1 } },
  { text: "New: the landing cuts both sides for 1.2 AD.", values: { land: 1.2 } },
  { text: "Dive damage +60% to +150%.", values: { power: 1.5 } },
  { text: "New: the dive pins its foe for 1.2 s.", values: { pin: 1.2 } },
  { text: "New: a dive that strikes gives a Point.", values: { points: 1 } },
  { text: "New: the landing cut reaches 16 px farther.", values: { ring: 16 } },
  { text: "Dive damage +150% to +400%; landing 1.2 to 3 AD.", values: { power: 4, land: 3 } },
]);

const LEVELS = withDrill(NATIVE, [
  { text: "One more air thrust a jump.", drill: { airSlashes: 1, stomp: 0 } },
  { text: "New: the wall kick cuts foes beside you for 1.2 AD.", drill: { kick: 1.2 } },
  { text: "New: landing after an air thrust stomps both sides for 1.2 AD.", drill: { stomp: 1.2 } },
  { text: "One more air dash.", drill: { airDashes: 1 } },
  { text: "Stomp 1.2 to 2.5 AD.", drill: { stomp: 2.5 } },
  { text: "New: the stomp pins for 0.6 s.", drill: { pin: 0.6 } },
  { text: "Two more air thrusts a jump.", drill: { airSlashes: 2 } },
  { text: "Stomp 2.5 to 5 AD; kick 3 AD.", drill: { stomp: 5, kick: 3 } },
]);

export const SWALLOW_DIVE: SkillDef = {
  id: "ce_dive",
  name: "Swallow Dive",
  kind: "movement",
  risk: "timed",
  button: "jump",
  text: "More air thrusts, a cutting wall kick and a stomp after an air thrust.",
  levels: LEVELS,
  evolution: {
    partner: "ce_step",
    name: "Swallow Storm",
    text: "The stomp reaches 70 px and draws foes in.",
    row: evolvedRow(LEVELS[7], "The stomp reaches 70 px and draws foes in.", {
      ...drillValues({ storm: 70 }),
      lines: 1,
      linePower: 1.5,
    }),
  },
};
