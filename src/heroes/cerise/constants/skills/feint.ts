import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `open` added damage on a foe the rising thrust opened, for `openTime` seconds, `guardBreak`, `points` a
 *  feint that lands gives, `turn` the feint turns a minion to face away, `behind` it cuts behind too; evolved `phantom`
 *  AD of the glass rapier that strikes an opened foe from behind */
const LEVELS = levelRows([
  { text: "The rising thrust opens its foe: +15% from your blows for 2 s.", values: { open: 0.15, openTime: 2 } },
  { text: "New: the rising thrust breaks guards.", values: { guardBreak: 1 } },
  { text: "Open bonus +15% to +25%.", values: { open: 0.25 } },
  { text: "New: a feint that lands gives a Point.", values: { points: 1 } },
  { text: "New: the feint turns the foe away from you.", values: { turn: 1 } },
  { text: "Open 2 to 3.5 s.", values: { openTime: 3.5 } },
  { text: "New: the feint also cuts behind you.", values: { behind: 1 } },
  { text: "Open bonus +25% to +35%.", values: { open: 0.35 } },
]);

export const FEINT: SkillDef = {
  id: "ce_feint",
  name: "Feint",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "The rising thrust is a feint that opens the foe to your next blows.",
  levels: LEVELS,
  evolution: {
    partner: "ce_mirror",
    name: "Phantom Feint",
    text: "A glass rapier strikes every opened foe from behind.",
    row: evolvedRow(LEVELS[7], "A glass rapier strikes the opened foe from behind.", { phantom: 4 }),
  },
};
