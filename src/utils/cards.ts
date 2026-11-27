import { ATTUNEMENT, CARD_WEIGHT, CHARGE_RANK, MASTERY, PICK_COUNT, SKILL_MAX_LEVEL } from "../constants/growth";
import { HONING_IDS } from "../constants/honing";
import { ARTS } from "../stages/arts";
import type { Build, Card } from "../types/build";
import type { ArtId, ElementId } from "../types/campaign";
import type { CharacterDef } from "../types/character";
import type { Boon } from "../types/skill";
import { skillSlots } from "./cardSupply";
import { type Ranks, resonanceRanks } from "./resonance";
import type { Rng } from "./rng";

export interface CardView {
  build: Build;
  level: number;
  charged: boolean;
  isAvailable?: (skillId: string) => boolean;
}

/** a card offered with its weight in the draw */
interface Weighted {
  card: Card;
  weight: number;
}

const ART_MAX_LEVEL = 5;

const allAvailable = (): boolean => true;

export const cardKey = (card: Card): string => `${card.type}:${card.id}`;

const skillCount = (b: Build): number => Object.keys(b.skills).length;

/** an ultimate skill held already: no other is dealt */
const holdsUltimate = (c: CharacterDef, b: Build): boolean =>
  c.skills.some((s) => s.kind === "ultimate" && b.skills[s.id]);

const pullOf = (ranks: Ranks, element: ElementId): number => 1 + CARD_WEIGHT.resonancePull * ranks[element];

function skillCards(c: CharacterDef, v: CardView, ranks: Ranks): Weighted[] {
  const b = v.build;
  const out: Weighted[] = [];
  const full = skillCount(b) >= skillSlots(v.level);
  const ultimate = holdsUltimate(c, b);
  const isAvailable = v.isAvailable ?? allAvailable;
  for (const s of c.skills) {
    const level = b.skills[s.id] ?? 0;
    const pull = pullOf(ranks, s.element);
    if (level >= SKILL_MAX_LEVEL) {
      const mastery = b.mastery[s.id] ?? 0;
      if (mastery < MASTERY.levels)
        out.push({ card: { type: "mastery", id: s.id, level: mastery + 1 }, weight: CARD_WEIGHT.mastery * pull });
    } else if (level) {
      out.push({ card: { type: "skill", id: s.id, level: level + 1 }, weight: CARD_WEIGHT.skillLevel * pull });
    } else if (!full && !(s.kind === "ultimate" && ultimate) && isAvailable(s.id)) {
      out.push({ card: { type: "skill", id: s.id, level: 1 }, weight: CARD_WEIGHT.newSkill * pull });
    }
  }
  return out;
}

function artCards(b: Build): Weighted[] {
  const out: Weighted[] = [];
  for (const [id, level] of Object.entries(b.arts) as [ArtId, number][]) {
    if (!level || level >= ART_MAX_LEVEL || !(id in ARTS)) continue;
    out.push({ card: { type: "art", id, level: level + 1 }, weight: CARD_WEIGHT.artLevel });
  }
  return out;
}

function chargeCards(v: CardView): Weighted[] {
  const rank = v.build.chargeRank;
  if (!v.charged || rank >= CHARGE_RANK.ranks) return [];
  return [{ card: { type: "charge", id: "rank", level: rank + 1 }, weight: CARD_WEIGHT.chargeRank }];
}

function attunementCards(b: Build, ranks: Ranks): Weighted[] {
  const out: Weighted[] = [];
  for (const element of Object.keys(ranks) as ElementId[]) {
    const level = b.attunement[element] ?? 0;
    if (ranks[element] - level * ATTUNEMENT.resonance <= 0 || level >= ATTUNEMENT.levels) continue;
    out.push({ card: { type: "attunement", id: element, level: level + 1 }, weight: CARD_WEIGHT.attunement });
  }
  return out;
}

const honingCards = (b: Build): Weighted[] =>
  HONING_IDS.map((id) => ({
    card: { type: "honing", id, level: (b.honing[id] ?? 0) + 1 },
    weight: CARD_WEIGHT.honing,
  }));

function weightedCards(c: CharacterDef, v: CardView): Weighted[] {
  const ranks = resonanceRanks(v.build, c, ARTS);
  return [
    ...skillCards(c, v, ranks),
    ...artCards(v.build),
    ...chargeCards(v),
    ...attunementCards(v.build, ranks),
    ...honingCards(v.build),
  ];
}

export function availableCards(c: CharacterDef, v: CardView): Card[] {
  return weightedCards(c, v)
    .map((w) => w.card)
    .filter((card) => !v.build.banished.includes(cardKey(card)));
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

export function dealCards(
  c: CharacterDef,
  v: CardView,
  rng: Rng,
  count: number,
  boons: readonly Boon[],
  without: readonly string[] = [],
): Card[] {
  const open = (w: Weighted): boolean => {
    const key = cardKey(w.card);
    return !v.build.banished.includes(key) && !without.includes(key);
  };
  const fill = boons.map((boon): Card => ({ type: "boon", id: boon.id }));
  return [...drawWeighted(weightedCards(c, v).filter(open), count, rng), ...fill].slice(0, count);
}
