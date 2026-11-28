import { ELEMENTS } from "../../constants/elements";
import { CHARACTERS } from "../../heroes/roster";
import { ARTS } from "../../stages/arts";
import type { ArtId, ElementId } from "../../types/campaign";
import type { CharacterDef } from "../../types/character";
import type { RunReport, SourceResult } from "../../types/run";
import { skillOf } from "../../utils/skills";
import { isHeroSource } from "../../utils/sources";
import { skillIcon } from "../skills/icons/iconImage";

const isElement = (id: string): id is ElementId => id in ELEMENTS;

const isArt = (id: string): id is ArtId => id in ARTS;

const heroOf = (report: RunReport): CharacterDef | undefined => CHARACTERS.find((c) => c.id === report.hero);

/** a source's name: "Kael's attacks", "Ultimate", a skill's name, or its evolution's once evolved */
export function sourceName(s: SourceResult, report: RunReport): string {
  const { id } = s;
  const hero = heroOf(report);
  if (isElement(id)) return `${ELEMENTS[id].name} resonance`;
  if (isArt(id)) return ARTS[id].name;
  if (!isHeroSource(id)) {
    const def = hero && skillOf(hero, id);
    return (s.evolved ? def?.evolution.name : def?.name) ?? id;
  }
  if (id === "ultimate") return "Ultimate";
  return `${hero?.name ?? "Hero"}'s ${id}`;
}

/** the icon id of a source: the hero's own kit icons, or the skill's (evolved art once evolved) */
export function sourceIcon(s: SourceResult, report: RunReport): string {
  const { id } = s;
  if (isElement(id)) return `el_${id}`;
  if (isArt(id)) return `art_${id}`;
  if (!isHeroSource(id)) return skillIcon(id, !!s.evolved);
  return (heroOf(report) ?? CHARACTERS[0]).sourceIcons[id];
}
