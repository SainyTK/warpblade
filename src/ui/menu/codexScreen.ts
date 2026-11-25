import "../shop/shop.css";
import "../achievements/achievements.css";
import "../unlocks/unlocks.css";
import { ELEMENT_ORDER, ELEMENTS } from "../../constants/elements";
import { EVOLVE_PARTNER_LEVEL, SKILL_MAX_LEVEL } from "../../constants/growth";
import { FUSION_RANK, FUSIONS, type FusionDef } from "../../constants/resonance";
import { CHARACTERS } from "../../heroes/roster";
import { ARTS } from "../../stages/arts";
import { knowsFusion, knowsRecipe } from "../../store/unlocks";
import type { ArtId } from "../../types/campaign";
import type { CharacterDef } from "../../types/character";
import type { MenuView } from "../../types/menu";
import type { SkillDef } from "../../types/skill";
import { skillOf } from "../../utils/skills";
import { iconUrl, skillIcon } from "../skills/icons/iconImage";
import { type CodexEntry, codexRow } from "../unlocks/codexRow";
import { backItem } from "./backItem";

function section(heading: string, rows: readonly HTMLElement[]): HTMLElement {
  const box = document.createElement("section");
  box.className = "shop-section";
  const h = document.createElement("h3");
  h.textContent = heading;
  box.append(h, ...rows);
  return box;
}

const skillEntry = (s: SkillDef): CodexEntry => ({ state: "found", icon: iconUrl(s.id), name: s.name, text: s.text });

/** an evolution shows its name and partner once it has been made; until then a silhouette and "Evolves with ???" */
function evolutionEntry(c: CharacterDef, s: SkillDef): CodexEntry {
  const icon = iconUrl(skillIcon(s.id, true));
  if (!knowsRecipe(s.id)) return { state: "locked", icon, hint: "Evolves with ???" };
  const partner = skillOf(c, s.evolution.partner)?.name ?? "???";
  const recipe = `${s.name} level ${SKILL_MAX_LEVEL} with ${partner} level ${EVOLVE_PARTNER_LEVEL}`;
  return { state: "found", icon, name: s.evolution.name, text: s.evolution.text, recipe };
}

const ELEMENT_TEXT = {
  blaze: "Hits burn. Burning foes explode at rank 12. Each rank widens skill areas.",
  frost:
    "Hits chill and then freeze. Frozen foes take more. Chilled foes shatter at rank 12. Each rank lengthens skill effects.",
  storm: "Hits may arc to nearby foes. More foes every 8 ranks, sure crits at rank 12. Each rank shortens cooldowns.",
  venom: "Hits poison. Each poison stack makes the foe take more from everything. Poison spreads on death at rank 12.",
  void: "Hits may echo a moment later. Echoes repeat twice at rank 16. Every 8 ranks adds one more projectile or summon.",
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
function heroRows(c: CharacterDef): { skills: HTMLElement[]; evolutions: HTMLElement[] } {
  const skills: HTMLElement[] = [];
  const evolutions: HTMLElement[] = [];
  for (const s of c.skills) {
    const evolution = codexRow(evolutionEntry(c, s), true);
    skills.push(codexRow(skillEntry(s)), evolution);
    evolutions.push(evolution);
  }
  return { skills, evolutions };
}

/**
 * Everything to find across runs: each hero's skills with their evolutions under them, the charms and the extra charm
 * slots. Found ones show their icon and text, locked ones a dark silhouette and a hint, secret ones only ???. Under the
 * title, how many of the evolutions, charms and slots are found.
 */
export function codexScreen(): MenuView {
  const heroes = CHARACTERS.map((c) => ({ c, rows: heroRows(c) }));
  const elements = ELEMENT_ORDER.map((id) => codexRow(elementEntry(id)));
  const fusions = FUSIONS.map((f) => codexRow(fusionEntry(f)));
  const arts = (Object.keys(ARTS) as ArtId[]).map((id) => codexRow(artEntry(id)));
  const scroll = document.createElement("div");
  scroll.className = "menu-scroll shop";
  scroll.append(
    section("Resonance", elements),
    section("Fusions", fusions),
    section("Rift Arts", arts),
    ...heroes.map(({ c, rows }) => section(`${c.name}'s skills`, rows.skills)),
  );
  const counted = [...heroes.flatMap(({ rows }) => rows.evolutions), ...fusions];
  const count = counted.filter((row) => row.dataset.state === "found").length;
  const content = document.createElement("div");
  content.className = "menu-sub";
  content.append(scroll, backItem());
  return { title: "Codex", subtitle: `${count} of ${counted.length} found`, content };
}
