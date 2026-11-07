import { CHARMS } from "../constants/charms";
import { CARD_WEIGHT, PICK_COUNT, SKILL_MAX_LEVEL, SKILL_SLOTS } from "../constants/growth";
import type { Build, Card, CharmId } from "../types/build";
import type { CharacterDef } from "../types/character";
import type { Boon } from "../types/skill";
import type { Rng } from "./rng";

/** what the player has unlocked across runs: the charms that may be dealt and the charm slots they have */
export interface CardUnlocks {
  charm(id: CharmId): boolean;
  charmSlots: number;
}

/** what a deal reads from the hero's build and the player's unlocks */
export interface CardView {
  build: Build;
  unlocks: CardUnlocks;
}

/** a card offered with its weight in the draw */
interface Weighted {
  card: Card;
  weight: number;
}

export const CHARM_IDS = Object.keys(CHARMS) as CharmId[];

/** what a card offers, the same for every level of it: `skill:<id>`, `charm:might`, `boon:<id>` */
export const cardKey = (card: Card): string => `${card.type}:${card.id}`;

const skillCount = (b: Build): number => Object.keys(b.skills).length;
const charmCount = (b: Build): number => Object.keys(b.charms).length;

/** an ultimate skill held already: no other is dealt */
const holdsUltimate = (c: CharacterDef, b: Build): boolean =>
  c.skills.some((s) => s.kind === "ultimate" && b.skills[s.id]);

/**
 * Skills that can be dealt: a new one while a slot is free (no second ultimate), weighing `CARD_WEIGHT.newSkill`, and
 * the next level of a held one below the top, weighing `CARD_WEIGHT.skillLevel`. Evolved skills are done.
 */
function skillCards(c: CharacterDef, b: Build): Weighted[] {
  const out: Weighted[] = [];
  const full = skillCount(b) >= SKILL_SLOTS;
  const ultimate = holdsUltimate(c, b);
  for (const s of c.skills) {
    const level = b.skills[s.id] ?? 0;
    if (level >= SKILL_MAX_LEVEL || (!level && (full || (s.kind === "ultimate" && ultimate)))) continue;
    const weight = level ? CARD_WEIGHT.skillLevel : CARD_WEIGHT.newSkill;
    out.push({ card: { type: "skill", id: s.id, level: level + 1 }, weight });
  }
  return out;
}

/** charms that can be dealt: a new unlocked one while a slot is free, a held one below its top level */
function charmCards(b: Build, u: CardUnlocks): Weighted[] {
  const out: Weighted[] = [];
  for (const id of CHARM_IDS) {
    const level = b.charms[id] ?? 0;
    const def = CHARMS[id];
    if (level >= def.maxLevel || (!level && (!u.charm(id) || charmCount(b) >= u.charmSlots))) continue;
    const weight = def.weight * (level ? CARD_WEIGHT.ownedCharm : 1);
    out.push({ card: { type: "charm", id, level: level + 1 }, weight });
  }
  return out;
}

/** every skill or charm card that may be dealt now, banished ones left out */
export function availableCards(c: CharacterDef, v: CardView): Card[] {
  return [...skillCards(c, v.build), ...charmCards(v.build, v.unlocks)]
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

/**
 * Deal `count` cards by weight from the hero's skills and the charms (see `skillCards` and `charmCards`). Cards whose
 * keys are banished or in `without` are left out (a reroll leaves out the cards shown); boons fill what is left.
 */
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
  const pool = [...skillCards(c, v.build), ...charmCards(v.build, v.unlocks)].filter(open);
  const fill = boons.map((boon): Card => ({ type: "boon", id: boon.id }));
  return [...drawWeighted(pool, count, rng), ...fill].slice(0, count);
}
