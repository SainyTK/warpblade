import "./listRows.css";
import "../achievements/achievements.css";
import "../unlocks/unlocks.css";
import { ARMORY_ITEMS } from "../../constants/armory";
import { ELEMENT_ORDER, ELEMENTS } from "../../constants/elements";
import { EVOLVE_PARTNER_LEVEL, SKILL_MAX_LEVEL } from "../../constants/growth";
import {
  BLAZE,
  ELEMENT_STATS,
  FROST,
  FUSION_RANK,
  FUSIONS,
  type FusionDef,
  STORM,
  VENOM,
  VOID,
} from "../../constants/resonance";
import { CHARACTERS } from "../../heroes/roster";
import { ARTS } from "../../stages/arts";
import { itemUnlock, knowsFusion, knowsRecipe, skillUnlock } from "../../store/unlocks";
import type { ArmoryItem } from "../../types/armory";
import type { ArtId } from "../../types/campaign";
import type { CharacterDef } from "../../types/character";
import type { MenuView } from "../../types/menu";
import type { SkillDef } from "../../types/skill";
import { skillOf } from "../../utils/skills";
import { iconUrl, skillIcon } from "../skills/icons/iconImage";
import { type CodexEntry, codexRow } from "../unlocks/codexRow";
import { unlockEntry } from "../unlocks/unlockEntry";
import { backItem } from "./backItem";

function section(heading: string, rows: readonly HTMLElement[]): HTMLElement {
  const box = document.createElement("section");
  box.className = "list-section";
  const h = document.createElement("h3");
  h.textContent = heading;
  box.append(h, ...rows);
  return box;
}

const skillEntry = (s: SkillDef): CodexEntry =>
  unlockEntry(skillUnlock(s.id), { icon: iconUrl(s.id), name: s.name, text: s.text });

const itemEntry = (item: ArmoryItem): CodexEntry =>
  unlockEntry(itemUnlock(item.id), { icon: iconUrl(item.id), name: item.name, text: item.levelText });

/** an evolution shows its name and partner once it has been made; until then a silhouette and "Evolves with ???" */
function evolutionEntry(c: CharacterDef, s: SkillDef): CodexEntry {
  const icon = iconUrl(skillIcon(s.id, true));
  if (!knowsRecipe(s.id)) return { state: "locked", icon, hint: "Evolves with ???" };
  const partner = skillOf(c, s.evolution.partner)?.name ?? "???";
  const recipe = `${s.name} level ${SKILL_MAX_LEVEL} with ${partner} level ${EVOLVE_PARTNER_LEVEL}`;
  return { state: "found", icon, name: s.evolution.name, text: s.evolution.text, recipe };
}

const ELEMENT_TEXT = {
  blaze: `Hits burn. Burning foes explode at rank ${BLAZE.wildfireRank}. Each rank widens skill areas.`,
  frost: `Hits chill, then freeze. Frozen foes take more. Chilled foes shatter at rank ${FROST.shatterRank}. Each rank lengthens skill effects.`,
  storm: `Hits may arc to nearby foes, one more every ${STORM.ranksPerTarget} ranks, with sure crits at rank ${STORM.overchargeRank}. Each rank shortens cooldowns.`,
  venom: `Hits poison. Each poison stack makes the foe take more from everything. Poison spreads on death at rank ${VENOM.plagueRank}.`,
  void: `Hits may echo a moment later, twice from rank ${VOID.riftRank}. Every ${ELEMENT_STATS.voidAmountRanks} ranks adds a projectile or summon.`,
} as const;

const elementEntry = (id: (typeof ELEMENT_ORDER)[number]): CodexEntry => ({
  state: "found",
  icon: iconUrl(`el_${id}`),
  name: ELEMENTS[id].name,
  text: ELEMENT_TEXT[id],
});

function fusionEntry(f: FusionDef): CodexEntry {
  const icon = iconUrl(`el_${f.pair[0]}`);
  const recipe = `${ELEMENTS[f.pair[0]].name} ${FUSION_RANK} and ${ELEMENTS[f.pair[1]].name} ${FUSION_RANK}`;
  if (!knowsFusion(f.id)) return { state: "locked", icon, hint: recipe };
  return { state: "found", icon, name: f.name, text: f.text, recipe };
}

const artEntry = (id: ArtId): CodexEntry => ({
  state: "found",
  icon: iconUrl(`art_${id}`),
  name: ARTS[id].name,
  text: `${ELEMENTS[ARTS[id].element].name}. ${ARTS[id].levels[0].cardText}`,
});

/** each skill of a hero with its evolution under it */
function heroRows(c: CharacterDef): { rows: HTMLElement[]; counted: HTMLElement[] } {
  const rows: HTMLElement[] = [];
  const counted: HTMLElement[] = [];
  for (const s of c.skills) {
    const skill = codexRow(skillEntry(s));
    const evolution = codexRow(evolutionEntry(c, s), true);
    rows.push(skill, evolution);
    counted.push(skill, evolution);
  }
  return { rows, counted };
}

/**
 * Everything to find across runs: the Armory's items, the Fusions, and each hero's skills with their evolutions under
 * them. Found ones show their icon and text, locked ones a dark silhouette with what opens them and how far it has
 * come, secret ones only ???. Under the title, how many of the items, Fusions, skills and evolutions are found.
 */
export function codexScreen(): MenuView {
  const heroes = CHARACTERS.map((c) => ({ c, rows: heroRows(c) }));
  const elements = ELEMENT_ORDER.map((id) => codexRow(elementEntry(id)));
  const fusions = FUSIONS.map((f) => codexRow(fusionEntry(f)));
  const arts = (Object.keys(ARTS) as ArtId[]).map((id) => codexRow(artEntry(id)));
  const items = ARMORY_ITEMS.map((item) => codexRow(itemEntry(item)));
  const scroll = document.createElement("div");
  scroll.className = "menu-scroll rows";
  scroll.append(
    section("Armory", items),
    section("Resonance", elements),
    section("Fusions", fusions),
    section("Rift Arts", arts),
    ...heroes.map(({ c, rows }) => section(`${c.name}'s skills`, rows.rows)),
  );
  const counted = [...items, ...fusions, ...heroes.flatMap(({ rows }) => rows.counted)];
  const count = counted.filter((row) => row.dataset.state === "found").length;
  const content = document.createElement("div");
  content.className = "menu-sub";
  content.append(scroll, backItem());
  return { title: "Codex", subtitle: `${count} of ${counted.length} found`, content };
}
