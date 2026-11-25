import { CHEST, SKILL_MAX_LEVEL } from "../constants/growth";
import type { Build, ChestReward } from "../types/build";
import type { ArtId } from "../types/campaign";
import type { CharacterDef } from "../types/character";
import type { Rng } from "./rng";
import { readyEvolutions } from "./skills";

const ART_MAX_LEVEL = 5;

/** how many upgrades a chest gives: 1, 3 with chance `three x luck`, 5 with chance `five x luck` */
function upgradeCount(luck: number, rng: Rng, least: number): number {
  if (rng.chance(CHEST.five * luck)) return 5;
  return Math.max(least, rng.chance(CHEST.three * luck) ? 3 : 1);
}

/**
 * What a chest gives: from `CHEST.evolveFromWave` it evolves a ready skill; otherwise it raises random held skills and
 * charms below their top level, one at a time, and heals fully when nothing can be raised.
 */
export function rollChest(
  c: CharacterDef,
  b: Build,
  wave: number,
  luck: number,
  rng: Rng,
  least = 1,
): ChestReward[] {
  const ready = readyEvolutions(c, b);
  if (wave >= CHEST.evolveFromWave && ready.length) return [{ type: "evolve", id: rng.pick(ready) }];
  const skills: Record<string, number> = { ...b.skills };
  const arts: Partial<Record<ArtId, number>> = { ...b.arts };
  const rewards: ChestReward[] = [];
  for (let n = upgradeCount(luck, rng, least); n > 0; n--) {
    const open: ChestReward[] = [
      ...Object.entries(skills)
        .filter(([id, level]) => level < SKILL_MAX_LEVEL && !b.evolved.includes(id))
        .map(([id, level]): ChestReward => ({ type: "skill", id, level: level + 1 })),
      ...(Object.entries(arts) as [ArtId, number][])
        .filter(([, level]) => level < ART_MAX_LEVEL)
        .map(([id, level]): ChestReward => ({ type: "art", id, level: level + 1 })),
    ];
    if (!open.length) break;
    const up = rng.pick(open);
    if (up.type === "skill") skills[up.id] = up.level;
    else if (up.type === "art") arts[up.id] = up.level;
    rewards.push(up);
  }
  return rewards.length ? rewards : [{ type: "heal" }];
}
