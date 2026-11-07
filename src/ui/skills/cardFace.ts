import { BOONS } from "../../constants/boons";
import { CHARMS } from "../../constants/charms";
import { RELIC_MAX_LEVEL } from "../../constants/growth";
import { RELIC_IDS, RELICS } from "../../constants/relics";
import { BOON_KIND, CARD_KIND } from "../../constants/skillLabels";
import { knowsRecipe } from "../../store/unlocks";
import type { Build, Card, CharmId, RelicId } from "../../types/build";
import type { CharacterDef } from "../../types/character";
import { branchOf } from "../../utils/skillPicks";
import { branchLine, lockNote, rankLine, recipeNotes } from "./pickText";

/** a line under a card's text: a warning, an evolution the hero is on the way to (gold), or an evolution partner
 *  not held yet */
export interface CardNote {
  text: string;
  tone: "lock" | "recipe" | "partner";
}

/** what a card shows, whatever it offers */
export interface CardFace {
  /** the colour family: a skill path, `relic`, `charm` or `boon` */
  branch: string;
  /** the skill kind, for skills */
  kind?: string;
  path: string;
  icon: string;
  name: string;
  /** the kind and the level or rank it reaches */
  line?: string;
  /** level pips: how many in all and how many are held before this card */
  pips?: { total: number; had: number };
  text: string;
  notes: CardNote[];
  isNew: boolean;
}

/** the relic a charm evolves; shown only once the recipe is known */
export const relicOfCharm = (id: CharmId): RelicId | undefined =>
  RELIC_IDS.find((r) => RELICS[r].evolution.charm === id);

/** the level line of a relic or charm card */
const levelLine = (kind: string, level: number, top: number): string =>
  level === 1 ? `New ${kind.toLowerCase()}` : `Level ${level} of ${top}`;

function relicFace(id: RelicId, level: number, build: Build): CardFace {
  const def = RELICS[id];
  const partner = def.evolution.charm;
  return {
    branch: "relic",
    path: CARD_KIND.relic,
    icon: `relic_${id}`,
    name: def.name,
    line: levelLine(CARD_KIND.relic, level, RELIC_MAX_LEVEL),
    pips: { total: RELIC_MAX_LEVEL, had: level - 1 },
    text: level === 1 ? def.text : def.levels[level - 1].text,
    notes: [
      knowsRecipe(id)
        ? { text: `Evolves with ${CHARMS[partner].name}`, tone: build.charms[partner] ? "recipe" : "partner" }
        : { text: "Evolves with ???", tone: "partner" },
    ],
    isNew: level === 1,
  };
}

function charmFace(id: CharmId, level: number, build: Build): CardFace {
  const def = CHARMS[id];
  const relic = relicOfCharm(id);
  const known = relic && knowsRecipe(relic);
  return {
    branch: "charm",
    path: CARD_KIND.charm,
    icon: `charm_${id}`,
    name: def.name,
    line: levelLine(CARD_KIND.charm, level, def.maxLevel),
    pips: def.maxLevel > 1 ? { total: def.maxLevel, had: level - 1 } : undefined,
    text: def.text,
    notes: known ? [{ text: `Evolves ${RELICS[relic].name}`, tone: build.relics[relic] ? "recipe" : "partner" }] : [],
    isNew: level === 1,
  };
}

/** what one card shows, from the hero's skills and build */
export function cardFace(c: CharacterDef, card: Card, ranks: Readonly<Record<string, number>>, build: Build): CardFace {
  if (card.type === "relic") return relicFace(card.id, card.level, build);
  if (card.type === "charm") return charmFace(card.id, card.level, build);
  if (card.type === "boon") {
    const boon = BOONS.find((b) => b.id === card.id) ?? BOONS[0];
    return {
      branch: "boon",
      path: BOON_KIND,
      icon: boon.id,
      name: boon.name,
      text: boon.text,
      notes: [],
      isNew: false,
    };
  }
  const { node } = card;
  const rank = ranks[node.id] ?? 0;
  const lock = lockNote(c, node, rank);
  return {
    branch: branchOf(c, node).id,
    kind: node.kind,
    path: branchLine(branchOf(c, node)),
    icon: node.id,
    name: node.name,
    line: rankLine(node, rank),
    pips: node.ranks > 1 ? { total: node.ranks, had: rank } : undefined,
    text: node.text,
    notes: [
      ...(lock ? [{ text: lock, tone: "lock" as const }] : []),
      ...recipeNotes(c, node, ranks).map((text) => ({ text, tone: "recipe" as const })),
    ],
    isNew: !rank,
  };
}
