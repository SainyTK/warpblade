import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `behind` short blows cut behind too, `shortPower` short blows' damage more, `wave` long blows' wave in attack
 *  damage, `scissor` the scissor turn's long blow cuts all round, `pierce` foes a wave cuts, `waveTempo` a wave that lands
 *  adds Tempo; evolved, every blow sends a wave both ways */
const LEVELS = levelRows([
  { text: "Short-blade blows also cut behind you.", values: { behind: 1 } },
  { text: "Short blows deal 25% more.", values: { shortPower: 0.25 } },
  { text: "New: long-blade blows send a small wave ahead.", values: { wave: 0.4, pierce: 1 } },
  { text: "Wave 0.4 to 0.6.", values: { wave: 0.6 } },
  { text: "New: the scissor turn's long blow cuts all round you.", values: { scissor: 1 } },
  { text: "New: waves pierce on to a second foe.", values: { pierce: 2 } },
  { text: "Short blows deal 50% more; wave 0.6 to 0.8.", values: { shortPower: 0.5, wave: 0.8 } },
  { text: "New: each foe a wave cuts adds a Tempo stack.", values: { waveTempo: 1 } },
]);

export const CROSSING_STORM: SkillDef = {
  id: "ve_storm",
  name: "Crossing Storm",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "Your string cuts behind you and sends small waves into the crowd.",
  levels: LEVELS,
  evolution: {
    partner: "ve_shade",
    name: "Thousand Crossings",
    text: "Every blow of the string sends a wave both ways.",
    row: evolvedRow(LEVELS[7], "Every blow sends a wave both ways.", { wave: 1 }),
  },
};
