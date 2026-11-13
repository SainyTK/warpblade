import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** Undertow, his parry skill. Design: docs/skills/orrin.md. Values: bind: seconds Chain Bind holds a minion; power:
 *  attack damage of the yank on the bound foe; drag: foes beside the bound one yanked in and bound with it; big: 1 mini
 *  bosses and bosses are yanked in and held still too; trip: seconds the chain line left on the floor trips foes, and
 *  tripPower its attack damage; mark: share more the bound foe takes from every source while bound; riptide: pixels
 *  round the bound foe within which every foe is yanked in and bound (evolution) */
const LEVELS = levelRows([
  { text: "Chain Bind holds 1.6 s; the yank deals 1.0x.", values: { bind: 1.6, power: 1 } },
  { text: "New: the foe nearest the bound one is yanked in too.", values: { drag: 1 } },
  { text: "The yank deals 1.8x.", values: { power: 1.8 } },
  { text: "New: mini bosses and bosses are yanked in and held.", values: { big: 1 } },
  { text: "New: the yank leaves a chain on the floor that trips.", values: { trip: 0.6, tripPower: 0.6 } },
  { text: "Chain Bind holds 2.2 s; the yank deals 2.6x.", values: { bind: 2.2, power: 2.6 } },
  { text: "New: the bound foe takes 30% more while bound.", values: { mark: 0.3 } },
  { text: "The yank deals 4.0x; two foes come in with it.", values: { power: 4, drag: 2 } },
]);

export const UNDERTOW: SkillDef = {
  id: "o_undertow",
  name: "Undertow",
  kind: "attack",
  risk: "precise",
  button: "K",
  text: "Chain Bind holds longer, its yank hits hard, and it drags more foes in with the one that struck.",
  levels: LEVELS,
  evolution: {
    partner: "o_anchorfall",
    name: "Riptide",
    text: "A parry yanks in every foe within 60 px of the one that struck, and binds them all.",
    row: evolvedRow(LEVELS[7], "Every foe round it is yanked in and bound.", { riptide: 60 }),
  },
};
