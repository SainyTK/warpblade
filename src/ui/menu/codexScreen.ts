import "../shop/shop.css";
import "../achievements/achievements.css";
import "../unlocks/unlocks.css";
import { CHARACTERS } from "../../constants/characters/index";
import { CHARMS } from "../../constants/charms";
import { EVOLVE_PARTNER_LEVEL, SKILL_MAX_LEVEL } from "../../constants/growth";
import { charmUnlocked, isFound, knowsRecipe } from "../../store/unlocks";
import type { CharmId } from "../../types/build";
import type { CharacterDef } from "../../types/character";
import type { MenuView } from "../../types/menu";
import type { SkillDef } from "../../types/skill";
import { skillOf } from "../../utils/skills";
import { slotUnlocks, unlockName, unlockOf, unlockText } from "../../utils/unlocks";
import { iconUrl, skillIcon } from "../skills/icons/iconImage";
import { type CodexEntry, codexRow, entryOf } from "../unlocks/codexRow";
import { targetIconUrl } from "../unlocks/unlockIcon";
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

const charmEntry = (id: CharmId): CodexEntry => {
  const c = CHARMS[id];
  return entryOf(unlockOf(id), charmUnlocked(id), iconUrl(`charm_${id}`), c.name, c.text);
};

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
  const charms = (Object.keys(CHARMS) as CharmId[]).map((id) => codexRow(charmEntry(id)));
  const slots = slotUnlocks().map((u) =>
    codexRow(entryOf(u, isFound(u.id), targetIconUrl(u.target), unlockName(u.target), unlockText(u.target))),
  );
  const scroll = document.createElement("div");
  scroll.className = "menu-scroll shop";
  scroll.append(
    ...heroes.map(({ c, rows }) => section(`${c.name}'s skills`, rows.skills)),
    section("Charms", charms),
    section("Charm slots", slots),
  );
  const counted = [...heroes.flatMap(({ rows }) => rows.evolutions), ...charms, ...slots];
  const count = counted.filter((row) => row.dataset.state === "found").length;
  const content = document.createElement("div");
  content.className = "menu-sub";
  content.append(scroll, backItem());
  return { title: "Codex", subtitle: `${count} of ${counted.length} found`, content };
}
