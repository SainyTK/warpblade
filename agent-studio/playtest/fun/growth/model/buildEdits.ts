import type { Build, Card, GrowthRules } from "../types/game";

export const cloneBuild = (build: Build): Build => ({
  ...build,
  skills: { ...build.skills },
  arts: { ...build.arts },
  mastery: { ...build.mastery },
  attunement: { ...build.attunement },
  honing: { ...build.honing },
  evolved: [...build.evolved],
  banished: [...build.banished],
});

const raised = (levels: Record<string, number>, id: string, top: number): number =>
  Math.min(top, (levels[id] ?? 0) + 1);

export function applyCard(build: Build, card: Card, rules: GrowthRules): void {
  if (card.type === "skill") {
    build.skills[card.id] = raised(build.skills, card.id, rules.skillMaxLevel);
  } else if (card.type === "mastery") {
    build.mastery[card.id] = raised(build.mastery, card.id, rules.masteryLevels);
  } else if (card.type === "charge") {
    build.chargeRank = Math.min(rules.chargeRanks, build.chargeRank + 1);
  } else if (card.type === "attunement") {
    build.attunement[card.id] = raised(build.attunement, card.id, rules.attunementLevels);
  } else if (card.type === "honing") {
    build.honing[card.id] = (build.honing[card.id] ?? 0) + 1;
  }
}

export function canGrow(build: Build, rules: GrowthRules, skillPool: number): boolean {
  const held = Object.entries(build.skills);
  return (
    held.length < Math.min(rules.skillSlots, skillPool) ||
    held.some(([id, level]) => level < rules.skillMaxLevel || (build.mastery[id] ?? 0) < rules.masteryLevels)
  );
}
