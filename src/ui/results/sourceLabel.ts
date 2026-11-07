import { CHARACTERS } from "../../constants/characters/index";
import { HERO_SOURCE_ICONS, HERO_SOURCES, type HeroSource } from "../../constants/damageSources";
import { RELICS } from "../../constants/relics/index";
import type { CharacterDef } from "../../types/character";
import type { RunReport, SourceResult } from "../../types/run";
import { allNodes } from "../../utils/stats";

const isHeroSource = (id: SourceResult["id"]): id is HeroSource => HERO_SOURCES.has(id);

const heroOf = (report: RunReport): CharacterDef | undefined => CHARACTERS.find((c) => c.id === report.hero);

/** a source's name: "Kael's attacks", "Ultimate", a relic's name, or its evolution's once evolved */
export function sourceName(s: SourceResult, report: RunReport): string {
  const { id } = s;
  if (!isHeroSource(id)) return s.evolved ? RELICS[id].evolution.name : RELICS[id].name;
  if (id === "ultimate") return "Ultimate";
  return `${heroOf(report)?.name ?? "Hero"}'s ${id}`;
}

/** the icon id of a source: the hero's own kit icons, the learned ultimate's, or the relic's (evolved art once evolved) */
export function sourceIcon(s: SourceResult, report: RunReport): string {
  const { id } = s;
  if (!isHeroSource(id)) return s.evolved ? `relic_${id}_evo` : `relic_${id}`;
  const hero = heroOf(report);
  const icons = HERO_SOURCE_ICONS[report.hero] ?? HERO_SOURCE_ICONS.kael;
  if (id !== "ultimate" || !hero) return icons[id];
  return allNodes(hero).find((n) => n.ultimate && n.ultimate === report.ultimate)?.id ?? icons.ultimate;
}
