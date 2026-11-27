import { ELEMENTS } from "../constants/elements";
import { MAX_LEVEL } from "../constants/growth";
import { PAL } from "../constants/palette";
import { LEVEL_UP_RESTORE } from "../constants/progression";
import { FUSIONS, type FusionId, RESONANCE_MILESTONES } from "../constants/resonance";
import { sfx } from "../services/audio";
import { ARTS } from "../stages/arts";
import { metaBonus } from "../store/meta";
import { learnFusion } from "../store/unlocks";
import type { Card } from "../types/build";
import { PK } from "../types/particle";
import type { PickAnswer } from "../types/pick";
import { picksBetween } from "../utils/cardSupply";
import { cardKey } from "../utils/cards";
import { pactTotals } from "../utils/pacts";
import { xpToNext } from "../utils/progression";
import { activeFusions, type Ranks, resonanceRanks, resonanceStats } from "../utils/resonance";
import { withShards } from "../utils/shards";
import { growthRows, heldRows } from "../utils/skills";
import { computeStats } from "../utils/stats";
import { raiseCard } from "./build/raise";
import { currentBuildStats } from "./build/stats";
import { createFloorRing } from "./effects/floorRing";
import { forgetEvolutions } from "./evolve";
import { airLimit } from "./skills/airLimit";
import { character, freshProgress, fxRng, game, hero, lights, particles, progress, showBanner } from "./state";

/** recompute everything derived from the level and the build, keeping HP and MP inside the new maxima */
export function refreshProgress(): void {
  const build = progress.build;
  const before = progress.resonance;
  progress.resonance = resonanceRanks(build, character, ARTS);
  announceMilestones(before, progress.resonance);
  const fusions = activeFusions(progress.resonance);
  for (const id of fusions) if (!progress.fusions.includes(id)) announceFusion(id);
  progress.fusions = fusions;
  const stats = resonanceStats(progress.resonance);
  const pact = pactTotals(character, build);
  const rows = [...heldRows(character, build), ...growthRows(build), { scale: { ad: pact.power, ap: pact.power } }];
  const bonus = withShards(metaBonus(), progress.heartShards, progress.manaShards);
  progress.stats = computeStats(character, progress.level, rows, bonus, stats);
  progress.hpPerSecond = pact.hp;
  progress.mpPerSecond = pact.mp;
  // every hero keeps one ultimate all run; their ultimate skill upgrades it
  progress.ultimate = character.special.id;
  progress.comboLimit = character.comboHits;
  progress.airLimit = airLimit();
  hero.hp = Math.min(hero.hp, progress.stats.hp);
  hero.mp = Math.min(hero.mp, progress.stats.mp);
  hero.stamina = Math.min(hero.stamina, progress.stats.stamina);
}

function announceMilestones(before: Ranks, after: Ranks): void {
  for (const milestone of RESONANCE_MILESTONES) {
    if (before[milestone.element] < milestone.rank && after[milestone.element] >= milestone.rank)
      showBanner(`${ELEMENTS[milestone.element].name} ${milestone.rank}: ${milestone.name}`, 2);
  }
}

function announceFusion(id: FusionId): void {
  learnFusion(id);
  showBanner(`Fusion: ${FUSIONS.find((f) => f.id === id)?.name ?? id}`, 2);
}

function celebrateLevel(): void {
  game.fx.push(createFloorRing(hero.x, hero.y, 34, PAL.heal, 0.6));
  lights.add(hero.x, hero.y - 18, 60, PAL.heal[3], 0.8, 0.6);
  for (let i = 0; i < 18; i++)
    particles.spawn(
      PK.STAR,
      hero.x + fxRng.range(-10, 10),
      hero.y - fxRng.range(0, 30),
      0,
      -fxRng.range(20, 60),
      fxRng.range(0.5, 1),
      {
        col: fxRng.pick([PAL.heal[3], PAL.heal[4]]),
        size: fxRng.range(1, 2.5),
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
  const restore = LEVEL_UP_RESTORE * (progress.level - from);
  refreshProgress();
  hero.hp = Math.min(progress.stats.hp, hero.hp + progress.stats.hp * restore);
  hero.mp = Math.min(progress.stats.mp, hero.mp + progress.stats.mp * restore);
  showBanner(`Level ${progress.level}`, 1.4);
  celebrateLevel();
  progress.picks += picksBetween(from, progress.level);
}

/** experience from play: Insight adds to it */
export function earnXp(amount: number): void {
  gainXp(amount * currentBuildStats().growth);
}

export function openPicks(): void {
  if (progress.picks <= 0 || game.mode !== "play") return;
  game.mode = "pick";
}

export function leavePicks(): void {
  if (game.mode === "pick") game.mode = "play";
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
  if (!progress.picks) leavePicks();
}

/** spend one point on a card */
function choosePick(card: Card): void {
  if (card.type === "boon") takeBoon();
  else {
    raiseCard(card);
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
