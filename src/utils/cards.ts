import { CHARMS } from "../constants/charms";
import { CARD_WEIGHT, PICK_COUNT, RELIC_MAX_LEVEL } from "../constants/growth";
import { RELIC_IDS } from "../constants/relics";
import type { Build, Card, CharmId, RelicId } from "../types/build";
import type { CharacterDef } from "../types/character";
import type { Boon } from "../types/skill";
import type { Rng } from "./rng";
import { isAvailable } from "./skillPicks";

/** what the player has unlocked across runs: the relics and charms that may be dealt, and the slots they have */
export interface CardUnlocks {
  relic(id: RelicId): boolean;
  charm(id: CharmId): boolean;
  relicSlots: number;
  charmSlots: number;
}

/** what a deal reads from the hero's progress and the player's unlocks */
export interface CardView {
  level: number;
  ranks: Readonly<Record<string, number>>;
  build: Build;
  unlocks: CardUnlocks;
}

/** a card offered with its weight in the draw */
interface Weighted {
  card: Card;
  weight: number;
}

export const CHARM_IDS = Object.keys(CHARMS) as CharmId[];

/** what a card offers, the same for every level of it: `relic:wisp`, `charm:might`, `skill:<node id>`, `boon:<id>` */
export function cardKey(card: Card): string {
  if (card.type === "skill") return `skill:${card.node.id}`;
  return `${card.type}:${card.id}`;
}

const relicCount = (b: Build): number => Object.keys(b.relics).length;
const charmCount = (b: Build): number => Object.keys(b.charms).length;

/** a hero skill evolution is ready and takes the first card */
const isSkillEvolution = (card: Card): boolean => card.type === "skill" && card.node.kind === "evolution";

/** relics and charms that can be dealt: a new unlocked one while a slot is free, an owned one below its top level */
function buildCards(b: Build, u: CardUnlocks): Weighted[] {
  const out: Weighted[] = [];
  for (const id of RELIC_IDS) {
    const level = b.relics[id] ?? 0;
    if (level >= RELIC_MAX_LEVEL || (!level && (!u.relic(id) || relicCount(b) >= u.relicSlots))) continue;
    out.push({
      card: { type: "relic", id, level: level + 1 },
      weight: CARD_WEIGHT.relic * (level ? CARD_WEIGHT.owned : 1),
    });
  }
  for (const id of CHARM_IDS) {
    const level = b.charms[id] ?? 0;
    const def = CHARMS[id];
    if (level >= def.maxLevel || (!level && (!u.charm(id) || charmCount(b) >= u.charmSlots))) continue;
    out.push({ card: { type: "charm", id, level: level + 1 }, weight: def.weight * (level ? CARD_WEIGHT.owned : 1) });
  }
  return out;
}

/** skills the hero can learn now; together they weigh `CARD_WEIGHT.skills` */
function skillCards(c: CharacterDef, v: CardView): Card[] {
  return c.branches.flatMap((branch) =>
    branch.nodes.filter((node) => isAvailable(c, node, v)).map((node): Card => ({ type: "skill", node })),
  );
}

/** every card that may be dealt now, banished ones left out */
export function availableCards(c: CharacterDef, v: CardView): Card[] {
  return [...buildCards(v.build, v.unlocks).map((w) => w.card), ...skillCards(c, v)].filter(
    (card) => !v.build.banished.includes(cardKey(card)),
  );
}

/** draw up to `count` cards by weight, without repeats */
function drawWeighted(pool: Weighted[], count: number, rng: Rng): Card[] {
  const left = [...pool];
  const out: Card[] = [];
  while (out.length < count && left.length) {
    const total = left.reduce((sum, w) => sum + w.weight, 0);
    let roll = rng.next() * total;
    let i = 0;
    while (i < left.length - 1 && roll >= left[i].weight) {
      roll -= left[i].weight;
      i++;
    }
    out.push(left[i].card);
    left.splice(i, 1);
  }
  return out;
}

/** cards in a pick: three, and a fourth at `1 - 1/luck` */
export const cardCount = (luck: number, rng: Rng): number => PICK_COUNT + (rng.chance(1 - 1 / luck) ? 1 : 0);

/**
 * Deal `count` cards by weight: a relic 100, a charm its own weight, owned relics and charms three times that, and all
 * the skills on offer sharing 300. A ready skill evolution takes the first card and no other evolution is dealt with
 * it. Cards whose keys are in `without` are left out (a reroll leaves out the cards shown); boons fill what is left.
 */
export function dealCards(
  c: CharacterDef,
  v: CardView,
  rng: Rng,
  count: number,
  boons: readonly Boon[],
  without: readonly string[] = [],
): Card[] {
  const open = (card: Card): boolean => {
    const key = cardKey(card);
    return !v.build.banished.includes(key) && !without.includes(key);
  };
  const skills = skillCards(c, v).filter(open);
  const evolutions = skills.filter(isSkillEvolution);
  const first = evolutions.length ? [rng.pick(evolutions)] : [];
  const rest = skills.filter((card) => !isSkillEvolution(card));
  const pool: Weighted[] = [
    ...buildCards(v.build, v.unlocks).filter((w) => open(w.card)),
    ...rest.map((card) => ({ card, weight: CARD_WEIGHT.skills / rest.length })),
  ];
  const fill = boons.map((boon): Card => ({ type: "boon", id: boon.id }));
  return [...first, ...drawWeighted(pool, count - first.length, rng), ...fill].slice(0, count);
}
