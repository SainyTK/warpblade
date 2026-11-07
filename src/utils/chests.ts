import { CHARMS } from "../constants/charms";
import { CHEST, SKILL_MAX_LEVEL } from "../constants/growth";
import type { Build, CharmId, ChestReward } from "../types/build";
import type { CharacterDef } from "../types/character";
import type { Rng } from "./rng";
import { readyEvolutions } from "./skills";

/** how many upgrades a chest gives: 1, 3 with chance `three x luck`, 5 with chance `five x luck` */
function upgradeCount(luck: number, rng: Rng): number {
  if (rng.chance(CHEST.five * luck)) return 5;
  return rng.chance(CHEST.three * luck) ? 3 : 1;
}

/**
 * What a chest gives: from `CHEST.evolveFromWave` it evolves a ready skill; otherwise it raises random held skills and
 * charms below their top level, one at a time, and heals fully when nothing can be raised.
 */
export function rollChest(c: CharacterDef, b: Build, wave: number, luck: number, rng: Rng): ChestReward[] {
  const ready = readyEvolutions(c, b);
  if (wave >= CHEST.evolveFromWave && ready.length) return [{ type: "evolve", id: rng.pick(ready) }];
  const skills: Record<string, number> = { ...b.skills };
  const charms: Partial<Record<CharmId, number>> = { ...b.charms };
  const rewards: ChestReward[] = [];
  for (let n = upgradeCount(luck, rng); n > 0; n--) {
    const open: ChestReward[] = [
      ...Object.entries(skills)
        .filter(([id, level]) => level < SKILL_MAX_LEVEL && !b.evolved.includes(id))
        .map(([id, level]): ChestReward => ({ type: "skill", id, level: level + 1 })),
      ...(Object.entries(charms) as [CharmId, number][])
        .filter(([id, level]) => level < CHARMS[id].maxLevel)
        .map(([id, level]): ChestReward => ({ type: "charm", id, level: level + 1 })),
    ];
    if (!open.length) break;
    const up = rng.pick(open);
    if (up.type === "skill") skills[up.id] = up.level;
    else if (up.type === "charm") charms[up.id] = up.level;
    rewards.push(up);
  }
  return rewards.length ? rewards : [{ type: "heal" }];
}
