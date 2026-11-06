import type { Achievement, AchievementGroup } from "../types/achievement";

/** clear wave 10 with a hero; every new hero adds one of these below with the same reward */
function heroTrial(hero: string, heroName: string): Achievement {
  return {
    id: `trial-${hero}`,
    name: `${heroName}'s Trial`,
    text: `Clear wave 10 with ${heroName}.`,
    group: "Heroes",
    goal: { kind: "heroWave", hero, need: 10 },
    reward: 40,
  };
}

/**
 * Every achievement, in the order the Achievements page lists them within each group.
 * An achievement for a hero that is not in CHARACTERS yet is left out until the hero is.
 */
export const ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: "wave-5",
    name: "Into the Rift",
    text: "Reach wave 5.",
    group: "Waves",
    goal: { kind: "best", stat: "wave", need: 5 },
    reward: 15,
  },
  {
    id: "wave-10",
    name: "Night Watch",
    text: "Reach wave 10.",
    group: "Waves",
    goal: { kind: "best", stat: "wave", need: 10 },
    reward: 30,
  },
  {
    id: "wave-15",
    name: "Deep Rift",
    text: "Reach wave 15.",
    group: "Waves",
    goal: { kind: "best", stat: "wave", need: 15 },
    reward: 60,
  },
  {
    id: "wave-20",
    name: "Last Era",
    text: "Reach wave 20.",
    group: "Waves",
    goal: { kind: "best", stat: "wave", need: 20 },
    reward: 100,
  },
  {
    id: "stage-clear",
    name: "Warpblade",
    text: "Clear all 30 waves of the stage.",
    group: "Waves",
    goal: { kind: "count", stat: "clears", need: 1 },
    reward: 300,
    hiddenUntil: "wave-20",
  },
  heroTrial("kael", "Kael"),
  heroTrial("ysra", "Ysra"),
  heroTrial("sable", "Sable"),
  {
    id: "kills-100",
    name: "Culling",
    text: "Slay 100 foes.",
    group: "Foes",
    goal: { kind: "count", stat: "kills", need: 100 },
    reward: 20,
  },
  {
    id: "kills-1000",
    name: "Thinning the Night",
    text: "Slay 1,000 foes.",
    group: "Foes",
    goal: { kind: "count", stat: "kills", need: 1000 },
    reward: 80,
  },
  {
    id: "kills-5000",
    name: "Endless Blade",
    text: "Slay 5,000 foes.",
    group: "Foes",
    goal: { kind: "count", stat: "kills", need: 5000 },
    reward: 200,
    hiddenUntil: "kills-1000",
  },
  {
    id: "mini-10",
    name: "Giant Slayer",
    text: "Slay 10 mini bosses.",
    group: "Foes",
    goal: { kind: "count", stat: "miniKills", need: 10 },
    reward: 40,
  },
  {
    id: "warden",
    name: "Warden's End",
    text: "Slay the Rift Warden.",
    group: "Foes",
    goal: { kind: "count", stat: "bossKills", need: 1 },
    reward: 100,
    hiddenUntil: "wave-15",
  },
  {
    id: "combo-5",
    name: "Flowing Steel",
    text: "Land the fifth move of a combo.",
    group: "Skill",
    goal: { kind: "best", stat: "combo", need: 5 },
    reward: 40,
  },
  {
    id: "perfect-25",
    name: "Untouchable",
    text: "Make 25 perfect dodges or parries.",
    group: "Skill",
    goal: { kind: "count", stat: "perfects", need: 25 },
    reward: 40,
  },
  {
    id: "ultimate",
    name: "Final Art",
    text: "Learn an ultimate.",
    group: "Skill",
    goal: { kind: "count", stat: "ultimates", need: 1 },
    reward: 30,
  },
  {
    id: "evolution",
    name: "Evolved",
    text: "Learn an evolution.",
    group: "Skill",
    goal: { kind: "count", stat: "evolutions", need: 1 },
    reward: 50,
  },
  {
    id: "banked-500",
    name: "Coin Purse",
    text: "Bank 500 coins from runs.",
    group: "Coins",
    goal: { kind: "count", stat: "coinsBanked", need: 500 },
    reward: 25,
  },
  {
    id: "banked-3000",
    name: "Treasury",
    text: "Bank 3,000 coins from runs.",
    group: "Coins",
    goal: { kind: "count", stat: "coinsBanked", need: 3000 },
    reward: 100,
    hiddenUntil: "banked-500",
  },
  {
    id: "shop-10",
    name: "Outfitted",
    text: "Buy 10 levels or skills in the Shop.",
    group: "Coins",
    goal: { kind: "shopLevels", need: 10 },
    reward: 30,
  },
  {
    id: "hero-bought",
    name: "New Blood",
    text: "Unlock a hero with coins.",
    group: "Coins",
    goal: { kind: "heroesBought", need: 1 },
    reward: 50,
  },
];

/** the groups in the order the Achievements page shows them */
export const ACHIEVEMENT_GROUPS: readonly AchievementGroup[] = ["Waves", "Heroes", "Foes", "Skill", "Coins"];
