import "../shop/shop.css";
import "../achievements/achievements.css";
import "../unlocks/unlocks.css";
import { CHARMS } from "../../constants/charms";
import { RELIC_MAX_LEVEL } from "../../constants/growth";
import { RELIC_IDS, RELICS } from "../../constants/relics";
import { charmUnlocked, isFound, knowsRecipe, relicUnlocked } from "../../store/unlocks";
import type { CharmId, RelicId } from "../../types/build";
import type { MenuView } from "../../types/menu";
import { slotUnlocks, unlockName, unlockOf, unlockText } from "../../utils/unlocks";
import { iconUrl } from "../skills/icons/iconImage";
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

const relicEntry = (id: RelicId): CodexEntry => {
  const r = RELICS[id];
  return entryOf(unlockOf("relic", id), relicUnlocked(id), iconUrl(`relic_${id}`), r.name, r.text);
};

/** an evolution shows its recipe once it has been made; until then only that it evolves with something, or ??? under a secret relic */
function evolutionEntry(id: RelicId, relic: CodexEntry): CodexEntry {
  const evo = RELICS[id].evolution;
  const icon = iconUrl(`relic_${id}_evo`);
  if (relic.state === "secret") return relic;
  if (!knowsRecipe(id)) return { state: "locked", icon, hint: "Evolves with ???" };
  const recipe = `${RELICS[id].name} level ${RELIC_MAX_LEVEL} with ${CHARMS[evo.charm].name}`;
  return { state: "found", icon, name: evo.name, text: evo.text, recipe };
}

const charmEntry = (id: CharmId): CodexEntry => {
  const c = CHARMS[id];
  return entryOf(unlockOf("charm", id), charmUnlocked(id), iconUrl(`charm_${id}`), c.name, c.text);
};

/**
 * Everything to find across runs: each relic with its evolution under it, the charms and the extra slots. Found ones
 * show their icon and text, locked ones a dark silhouette and a hint, secret ones only ???. The count found is under
 * the title.
 */
export function codexScreen(): MenuView {
  const relics = RELIC_IDS.flatMap((id) => {
    const relic = relicEntry(id);
    return [codexRow(relic), codexRow(evolutionEntry(id, relic), true)];
  });
  const charms = (Object.keys(CHARMS) as CharmId[]).map((id) => codexRow(charmEntry(id)));
  const slots = slotUnlocks().map((u) =>
    codexRow(entryOf(u, isFound(u.id), targetIconUrl(u.target), unlockName(u.target), unlockText(u.target))),
  );
  const scroll = document.createElement("div");
  scroll.className = "menu-scroll shop";
  scroll.append(section("Relics", relics), section("Charms", charms), section("Slots", slots));
  const all = [...relics, ...charms, ...slots];
  const count = all.filter((row) => row.dataset.state === "found").length;
  const content = document.createElement("div");
  content.className = "menu-sub";
  content.append(scroll, backItem());
  return { title: "Codex", subtitle: `${count} of ${all.length} found`, content };
}
