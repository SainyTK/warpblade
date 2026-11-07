import { MAX_LEVEL } from "../constants/growth";
import { PAL } from "../constants/palette";
import { LEVEL_UP_RESTORE } from "../constants/progression";
import { sfx } from "../services/audio";
import { metaBonus } from "../store/meta";
import type { Card } from "../types/build";
import { PK } from "../types/particle";
import type { PickAnswer } from "../types/pick";
import type { Perk } from "../types/skill";
import { buildStats } from "../utils/build";
import { cardKey } from "../utils/cards";
import { xpToNext } from "../utils/progression";
import { heldRows } from "../utils/skills";
import { collectPerks, computeStats, heldUltimate } from "../utils/stats";
import { raiseCharm, raiseSkill } from "./build/raise";
import { createFloorRing } from "./effects/floorRing";
import { forgetEvolutions } from "./evolve";
import { airLimit } from "./skills/airLimit";
import { character, freshProgress, game, hero, lights, particles, progress, rng, showBanner } from "./state";

export const hasPerk = (p: Perk): boolean => progress.perks.has(p);

/** recompute everything derived from the level and the build, keeping HP and MP inside the new maxima */
export function refreshProgress(): void {
  const build = progress.build;
  progress.stats = computeStats(character, progress.level, heldRows(character, build), metaBonus(), buildStats(build));
  progress.perks = collectPerks(character, build);
  progress.ultimate = heldUltimate(character, build);
  progress.comboLimit = character.comboHits;
  progress.airLimit = airLimit();
  hero.hp = Math.min(hero.hp, progress.stats.hp);
  hero.mp = Math.min(hero.mp, progress.stats.mp);
  hero.stamina = Math.min(hero.stamina, progress.stats.stamina);
}

function celebrateLevel(): void {
  game.fx.push(createFloorRing(hero.x, hero.y, 34, PAL.heal, 0.6));
  lights.add(hero.x, hero.y - 18, 60, PAL.heal[3], 0.8, 0.6);
  for (let i = 0; i < 18; i++)
    particles.spawn(
      PK.STAR,
      hero.x + rng.range(-10, 10),
      hero.y - rng.range(0, 30),
      0,
      -rng.range(20, 60),
      rng.range(0.5, 1),
      {
        col: rng.pick([PAL.heal[3], PAL.heal[4]]),
        size: rng.range(1, 2.5),
      },
    );
  sfx.levelUp();
}

export function gainXp(amount: number): void {
  if (progress.level >= MAX_LEVEL) return;
  progress.xp += amount;
  const from = progress.level;
  while (progress.level < MAX_LEVEL && progress.xp >= xpToNext(progress.level)) {
    progress.xp -= xpToNext(progress.level);
    progress.level++;
  }
  if (progress.level >= MAX_LEVEL) progress.xp = 0;
  if (progress.level === from) return;
  const before = progress.stats;
  const restore = LEVEL_UP_RESTORE * (progress.level - from);
  refreshProgress();
  hero.hp = Math.min(progress.stats.hp, hero.hp + (progress.stats.hp - before.hp) + progress.stats.hp * restore);
  hero.mp = Math.min(progress.stats.mp, hero.mp + progress.stats.mp * restore);
  showBanner(`Level ${progress.level}`, 1.4);
  celebrateLevel();
  progress.picks += progress.level - from;
}

/** experience from play: Insight adds to it */
export function earnXp(amount: number): void {
  gainXp(amount * buildStats(progress.build).growth);
}

/** a cleared wave: the game pauses on a pick for every point waiting, if any */
export function openPicks(): void {
  if (progress.picks > 0 && game.mode === "play") game.mode = "pick";
}

/** recompute after something grew: a higher maximum also fills by what it adds */
export function refreshGrowing(): void {
  const before = progress.stats;
  refreshProgress();
  hero.hp = Math.min(progress.stats.hp, hero.hp + Math.max(0, progress.stats.hp - before.hp));
  hero.mp = Math.min(progress.stats.mp, hero.mp + Math.max(0, progress.stats.mp - before.mp));
  hero.stamina = Math.min(progress.stats.stamina, hero.stamina + Math.max(0, progress.stats.stamina - before.stamina));
}

/** Second Wind: HP and MP filled */
function takeBoon(): void {
  hero.hp = progress.stats.hp;
  hero.mp = progress.stats.mp;
}

/** one point is spent; the game plays on once none is left */
function spendPick(): void {
  progress.picks = Math.max(0, progress.picks - 1);
  if (!progress.picks && game.mode === "pick") game.mode = "play";
}

/** spend one point on a card */
function choosePick(card: Card): void {
  if (card.type === "boon") takeBoon();
  else {
    if (card.type === "skill") raiseSkill(card.id);
    else raiseCharm(card.id);
    refreshGrowing();
  }
  spendPick();
}

/** Skip: the point is spent for nothing */
function skipPick(): void {
  if (progress.build.skips <= 0) return;
  progress.build.skips--;
  spendPick();
}

/** Banish: the card's skill or charm is never dealt again this run */
function banishCard(card: Card): void {
  if (progress.build.banishes <= 0 || card.type === "boon") return;
  progress.build.banishes--;
  progress.build.banished = [...progress.build.banished, cardKey(card)];
}

/** the chest screen was seen: its rewards are put away and play goes on */
export function seeChest(): void {
  progress.build.chest = [];
  if (game.mode === "chest") game.mode = "play";
}

/** a player's answer to the cards; a reroll or banish only spends the tool, and the cards are dealt again by the dialog */
export function answerPick(answer: PickAnswer<Card>): void {
  if (progress.picks <= 0) return;
  if (answer.t === "take") choosePick(answer.card);
  else if (answer.t === "skip") skipPick();
  else if (answer.t === "banish") banishCard(answer.card);
  else if (progress.build.rerolls > 0) progress.build.rerolls--;
}

export function resetProgress(): void {
  Object.assign(progress, freshProgress());
  forgetEvolutions();
}
