import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** Hot Wax. Design: docs/skills/wenna.md. Values: stacks: Hot Wax stacks a splash adds; damage: ability power a stack
 *  deals a second; life: seconds stacks last; radius: the splash's radius; chill: 1 splashed foes are chilled; block: 1 a
 *  blocked blow splashes the attacker; warp: 1 a warp's arrival splashes round her; candle: 1 splashed foes that die drip
 *  double Wax (evolution) */
const LEVELS = levelRows([
  {
    text: "Flare Back and each Wick you light splash 2 Hot Wax.",
    values: { stacks: 2, damage: 0.15, life: 4, radius: 24, chill: 0, block: 0, warp: 0, candle: 0 },
  },
  { text: "The splash reaches 32 px.", values: { radius: 32 } },
  { text: "New: splashed foes are chilled.", values: { chill: 1 } },
  { text: "Hot Wax burns for 0.2x.", values: { damage: 0.2 } },
  { text: "New: a blocked blow splashes the attacker.", values: { block: 1 } },
  { text: "New: a warp's arrival splashes round you.", values: { warp: 1 } },
  { text: "Hot Wax burns for 0.27x.", values: { damage: 0.27 } },
  { text: "Hot Wax burns for 0.35x.", values: { damage: 0.35 } },
]);

export const HOT_WAX: SkillDef = {
  id: "w_hotWax",
  name: "Hot Wax",
  kind: "dot",
  risk: "timed",
  button: "K",
  text: "Your lantern spills hot wax: Flare Back and each Wick you light splash the foes round them.",
  levels: LEVELS,
  evolution: {
    partner: "w_singe",
    name: "Candlemaker",
    text: "Splashed foes that die drip double Wax.",
    row: evolvedRow(LEVELS[7], "Splashed foes drip double Wax.", { candle: 1 }),
  },
};
