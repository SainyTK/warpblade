import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `bonus` added damage of every riposte link, `window` the beat after a link in seconds, `mark` links set the
 *  Rose mark, `links` most links in a chain, `line` every this many links send a Rose Line of `linePower` AP,
 *  `parryPoints` Points a parry gives; evolved `fromBlock` a block starts the chain too */
const LEVELS = levelRows([
  { text: "Riposte links deal +100% damage.", values: { bonus: 1 } },
  { text: "Riposte beat 0.22 to 0.3 s.", values: { window: 0.3 } },
  { text: "New: each riposte link sets the Rose mark.", values: { mark: 1 } },
  { text: "Chain of 6 to 8 links.", values: { links: 8 } },
  { text: "Riposte damage +100% to +300%.", values: { bonus: 3 } },
  { text: "New: every third link sends a Rose Line.", values: { line: 3, linePower: 1 } },
  { text: "New: a parry gives 2 Points.", values: { parryPoints: 2 } },
  { text: "Riposte damage +300% to +900%.", values: { bonus: 9 } },
]);

export const RIPOSTE_CHAIN: SkillDef = {
  id: "ce_riposte",
  name: "Riposte Chain",
  kind: "attack",
  risk: "precise",
  button: "K",
  text: "Parry, then keep the beat: every riposte link hits far harder.",
  levels: LEVELS,
  evolution: {
    partner: "ce_measure",
    name: "Endless Riposte",
    text: "A blocked blow starts the riposte chain too, and the chain runs to 12 links.",
    row: evolvedRow(LEVELS[7], "A block starts the chain too; up to 12 links.", { fromBlock: 1, links: 12 }),
  },
};
