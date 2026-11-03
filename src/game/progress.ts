import { PAL } from "../constants/palette";
import { LEVEL_UP_RESTORE, MAX_LEVEL } from "../constants/progression";
import { sfx } from "../services/audio";
import { PK } from "../types/particle";
import type { Perk, PickOption, SkillNode } from "../types/skill";
import { comboLimit, xpToNext } from "../utils/progression";
import { collectPerks, computeStats, learnedUltimate } from "../utils/stats";
import { createFloorRing } from "./effects/floorRing";
import { character, freshProgress, game, hero, lights, particles, progress, rng, showBanner } from "./state";

export const hasPerk = (p: Perk): boolean => progress.perks.has(p);

/** recompute everything derived from the level and the learned ranks, keeping HP and MP inside the new maxima */
export function refreshProgress(): void {
  progress.stats = computeStats(character, progress.level, progress.ranks);
  progress.perks = collectPerks(character, progress.ranks);
  progress.ultimate = learnedUltimate(character, progress.ranks);
  progress.comboLimit = comboLimit(progress.level, progress.perks.has("flowingChain"));
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
  let gained = 0;
  while (progress.level < MAX_LEVEL && progress.xp >= xpToNext(progress.level)) {
    progress.xp -= xpToNext(progress.level);
    progress.level++;
    gained++;
  }
  if (progress.level >= MAX_LEVEL) progress.xp = 0;
  if (!gained) return;
  const before = progress.stats;
  refreshProgress();
  hero.hp = Math.min(
    progress.stats.hp,
    hero.hp + (progress.stats.hp - before.hp) + progress.stats.hp * LEVEL_UP_RESTORE,
  );
  hero.mp = Math.min(progress.stats.mp, hero.mp + progress.stats.mp * LEVEL_UP_RESTORE);
  showBanner(`Level ${progress.level}`, 1.4);
  celebrateLevel();
  progress.picks += gained;
  if (game.mode === "play") game.mode = "pick";
}

function learnSkill(node: SkillNode): void {
  progress.ranks = { ...progress.ranks, [node.id]: (progress.ranks[node.id] ?? 0) + 1 };
  const before = progress.stats;
  refreshProgress();
  hero.hp = Math.min(progress.stats.hp, hero.hp + Math.max(0, progress.stats.hp - before.hp));
  hero.mp = Math.min(progress.stats.mp, hero.mp + Math.max(0, progress.stats.mp - before.mp));
  hero.stamina = Math.min(progress.stats.stamina, hero.stamina + Math.max(0, progress.stats.stamina - before.stamina));
}

/** take one card of a level-up pick; the game plays on once no level up waits for a pick */
export function choosePick(option: PickOption): void {
  if (option.type === "skill") learnSkill(option.node);
  else {
    hero.hp = progress.stats.hp;
    hero.mp = progress.stats.mp;
  }
  progress.picks = Math.max(0, progress.picks - 1);
  if (!progress.picks && game.mode === "pick") game.mode = "play";
}

export function resetProgress(): void {
  Object.assign(progress, freshProgress());
}
