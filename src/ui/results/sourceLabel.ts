import { CHARACTERS } from "../../constants/characters/index";
import { HERO_SOURCE_ICONS } from "../../constants/damageSources";
import type { CharacterDef } from "../../types/character";
import type { RunReport, SourceResult } from "../../types/run";
import { skillOf } from "../../utils/skills";
import { isHeroSource } from "../../utils/sources";
import { skillIcon } from "../skills/icons/iconImage";

const heroOf = (report: RunReport): CharacterDef | undefined => CHARACTERS.find((c) => c.id === report.hero);

/** a source's name: "Kael's attacks", "Ultimate", a skill's name, or its evolution's once evolved */
export function sourceName(s: SourceResult, report: RunReport): string {
  const { id } = s;
  const hero = heroOf(report);
  if (!isHeroSource(id)) {
    const def = hero && skillOf(hero, id);
    return (s.evolved ? def?.evolution.name : def?.name) ?? id;
  }
  if (id === "ultimate") return "Ultimate";
  return `${hero?.name ?? "Hero"}'s ${id}`;
}

/** the icon id of a source: the hero's own kit icons, the held ultimate skill's, or the skill's (evolved art once evolved) */
export function sourceIcon(s: SourceResult, report: RunReport): string {
  const { id } = s;
  if (!isHeroSource(id)) return skillIcon(id, !!s.evolved);
  const hero = heroOf(report);
  const icons = HERO_SOURCE_ICONS[report.hero] ?? HERO_SOURCE_ICONS.kael;
  if (id !== "ultimate" || !hero) return icons[id];
  return hero.skills.find((n) => n.ultimate && n.ultimate === report.ultimate)?.id ?? icons.ultimate;
}
