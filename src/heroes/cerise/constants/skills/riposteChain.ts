import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, withDrill } from "./drillRows";

/** values: `bonus` added damage of every riposte link, `window` the beat after a link in seconds, `mark` links set the
 *  Rose mark, `links` most links in a chain, `guardBreak` links break guards, `line` every this many links send a Rose Line of `linePower` AP,
 *  `parryPoints` Points a parry gives; evolved `fromBlock` a block starts the chain too */
const NATIVE = levelRows([
  { text: "Riposte links deal +100% damage.", values: { bonus: 1 } },
  { text: "Riposte beat 0.22 to 0.3 s.", values: { window: 0.3 } },
  { text: "New: each riposte link sets the Rose mark.", values: { mark: 1 } },
  { text: "New: riposte links break guards; chains of up to 8 links.", values: { links: 8, guardBreak: 1 } },
  { text: "Riposte damage +100% to +300%.", values: { bonus: 3 } },
  { text: "New: every third link sends a Rose Line.", values: { line: 3, linePower: 1 } },
  { text: "New: a parry gives 2 Points.", values: { parryPoints: 2 } },
  { text: "Riposte damage +300% to +900%.", values: { bonus: 9 } },
]);

const LEVELS = withDrill(NATIVE, [
  {
    text: "Parry window +50%; a parry ripostes the foe ahead for 1.5 AD, a sure critical hit.",
    drill: { window: 0.5, riposte: 1.5 },
  },
  { text: "New: the riposte sets the Rose mark.", drill: { mark: 1 } },
  { text: "Riposte 1.5 to 2.5 AD.", drill: { riposte: 2.5 } },
  { text: "New: a parry readies the dash and an air dash.", drill: { refresh: 1 } },
  { text: "Parry window +50% to +100%.", drill: { window: 1 } },
  { text: "Riposte 2.5 to 4 AD.", drill: { riposte: 4 } },
  { text: "New: the riposte pierces every foe 64 px ahead.", drill: { pierce: 1 } },
  { text: "Riposte 4 to 8 AD.", drill: { riposte: 8 } },
]);

export const RIPOSTE_CHAIN: SkillDef = {
  id: "ce_riposte",
  name: "Riposte Chain",
  kind: "attack",
  element: "storm",
  risk: "precise",
  button: "K",
  text: "A parry answers at once with a riposte, and the parry window grows.",
  levels: LEVELS,
  evolution: {
    partner: "ce_measure",
    name: "Endless Riposte",
    text: "For 2 s after a parry every thrust hits twice as hard.",
    row: evolvedRow(LEVELS[7], "After a parry: 2 s of thrusts +100%.", {
      ...drillValues({ flow: 1, flowTime: 2 }),
      fromBlock: 1,
      links: 12,
    }),
  },
};
