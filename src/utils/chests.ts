import { CHARMS } from "../constants/charms";
import { CHEST, RELIC_MAX_LEVEL } from "../constants/growth";
import { RELICS } from "../constants/relics";
import type { Build, CharmId, ChestReward, RelicId } from "../types/build";
import type { Rng } from "./rng";

/** relics ready to evolve: at their top level, not evolved yet, with their partner charm held at any level */
export function readyEvolutions(b: Build): RelicId[] {
  return (Object.entries(b.relics) as [RelicId, number][])
    .filter(
      ([id, level]) => level >= RELIC_MAX_LEVEL && !b.evolved.includes(id) && !!b.charms[RELICS[id].evolution.charm],
    )
    .map(([id]) => id);
}

/** how many upgrades a chest gives: 1, 3 with chance `three x luck`, 5 with chance `five x luck` */
function upgradeCount(luck: number, rng: Rng): number {
  if (rng.chance(CHEST.five * luck)) return 5;
  return rng.chance(CHEST.three * luck) ? 3 : 1;
}

/**
 * What a chest gives: from `CHEST.evolveFromWave` it evolves a ready relic; otherwise it raises random held relics and
 * charms below their top level, one at a time, and heals fully when nothing can be raised.
 */
export function rollChest(b: Build, wave: number, luck: number, rng: Rng): ChestReward[] {
  const ready = readyEvolutions(b);
  if (wave >= CHEST.evolveFromWave && ready.length) return [{ type: "evolve", id: rng.pick(ready) }];
  const relics: Partial<Record<RelicId, number>> = { ...b.relics };
  const charms: Partial<Record<CharmId, number>> = { ...b.charms };
  const rewards: ChestReward[] = [];
  for (let n = upgradeCount(luck, rng); n > 0; n--) {
    const open: ChestReward[] = [
      ...(Object.entries(relics) as [RelicId, number][])
        .filter(([id, level]) => level < RELIC_MAX_LEVEL && !b.evolved.includes(id))
        .map(([id, level]): ChestReward => ({ type: "relic", id, level: level + 1 })),
      ...(Object.entries(charms) as [CharmId, number][])
        .filter(([id, level]) => level < CHARMS[id].maxLevel)
        .map(([id, level]): ChestReward => ({ type: "charm", id, level: level + 1 })),
    ];
    if (!open.length) break;
    const up = rng.pick(open);
    if (up.type === "relic") relics[up.id] = up.level;
    else if (up.type === "charm") charms[up.id] = up.level;
    rewards.push(up);
  }
  return rewards.length ? rewards : [{ type: "heal" }];
}
