import { ENEMIES } from "../constants/enemies";
import { CHARACTERS } from "../heroes/roster";
import { STAGES } from "../stages";
import type { BestStat, CountStat, Goal, HeroStat } from "../types/achievement";

const plural = (n: number, one: string, many: string): string => `${n.toLocaleString("en-US")} ${n === 1 ? one : many}`;

const heroName = (id: string): string => CHARACTERS.find((c) => c.id === id)?.name ?? id;

const COUNT_TEXT: Readonly<Partial<Record<CountStat, (n: number) => string>>> = {
  kills: (n) => `Slay ${plural(n, "foe", "foes")}`,
  miniKills: (n) => (n === 1 ? "Defeat a mini boss" : `Defeat ${n} mini bosses`),
  bossKills: (n) => (n === 1 ? "Defeat a stage boss" : `Defeat ${n} stage bosses`),
  coinsBanked: (n) => `Bank ${plural(n, "gold", "gold")} from runs`,
  falls: (n) => `Fall in ${plural(n, "run", "runs")}`,
  evolutions: (n) => (n === 1 ? "Evolve a skill" : `Evolve ${n} skills`),
};

const BEST_TEXT: Readonly<Partial<Record<BestStat, (n: number) => string>>> = {
  level: (n) => `Reach level ${n}`,
};

const HERO_TEXT: Readonly<Record<HeroStat, (n: number, hero: string) => string>> = {
  kills: (n, hero) => `Slay ${plural(n, "foe", "foes")} with ${hero}`,
  level: (n, hero) => `Reach level ${n} with ${hero}`,
  minis: (n, hero) => (n === 1 ? `Defeat a mini boss with ${hero}` : `Defeat ${n} mini bosses with ${hero}`),
  bosses: (n, hero) => (n === 1 ? `Defeat a stage boss with ${hero}` : `Defeat ${n} stage bosses with ${hero}`),
  evolutions: (n, hero) => (n === 1 ? `Evolve a skill with ${hero}` : `Evolve ${n} skills with ${hero}`),
  clears: (n, hero) => (n === 1 ? `Clear a stage with ${hero}` : `Clear ${n} stages with ${hero}`),
};

function listed(names: readonly string[], joiner: string): string {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} ${joiner} ${names[names.length - 1]}`;
}

function clearsText(g: Extract<Goal, { kind: "goalsMet" }>): string | null {
  const stages = g.of.flatMap((goal) => (goal.kind === "stageClears" ? [goal] : []));
  if (stages.length !== g.of.length) return null;
  const hyper = stages.every((goal) => goal.hyper);
  const names = stages.map((goal) => STAGES[goal.stage].name);
  if (g.need === 1 && names.length > 3) return hyper ? "Clear a Hyper stage" : "Clear a stage";
  if (g.need === 1) return `Clear ${listed(names, "or")}`;
  if (g.need === names.length) return `Clear ${listed(names, "and")}`;
  return `Clear ${g.need} different ${hyper ? "Hyper stages" : "stages"}`;
}

export function goalText(g: Goal): string {
  switch (g.kind) {
    case "count":
      return COUNT_TEXT[g.stat]?.(g.need) ?? `${g.stat} ${g.need}`;
    case "best":
      return BEST_TEXT[g.stat]?.(g.need) ?? `${g.stat} ${g.need}`;
    case "heroWave":
      return `Reach wave ${g.need} with ${heroName(g.hero)}`;
    case "foeKills":
      return `Slay ${g.need.toLocaleString("en-US")} ${ENEMIES[g.foe].name}${g.need === 1 ? "" : "s"}`;
    case "hero":
      return `${g.stat} ${g.need}`;
    case "heroStat":
      return HERO_TEXT[g.stat](g.need, heroName(g.hero));
    case "armoryLevels":
      return `Buy ${plural(g.need, "level", "levels")} in the Armory`;
    case "heroesBought":
      return g.need === 1 ? "Unlock a hero with gold" : `Unlock ${g.need} heroes with gold`;
    case "skillsFound":
      return `Unlock ${plural(g.need, "skill", "skills")}`;
    case "fusionsFound":
      return g.need === 1 ? "Make a Fusion" : `Make ${g.need} different Fusions`;
    case "goldSpent":
      return `Spend ${plural(g.need, "gold", "gold")}`;
    case "stageClears":
      return `Clear ${STAGES[g.stage].name}${g.hyper ? " Hyper" : ""}`;
    case "goalsMet":
      return clearsText(g) ?? g.of.map(goalText).join(", ");
  }
}
