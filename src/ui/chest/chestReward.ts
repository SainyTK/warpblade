import { BOONS } from "../../constants/boons";
import { CHARMS } from "../../constants/charms";
import { RELIC_MAX_LEVEL } from "../../constants/growth";
import { RELICS } from "../../constants/relics";
import type { ChestReward } from "../../types/build";
import { el } from "../dom";
import { iconUrl } from "../skills/icons/iconImage";

/** the icon, name and what changed for one reward */
function rewardFace(r: ChestReward): { kind: string; icon: string; name: string; line: string } {
  if (r.type === "evolve") {
    const evo = RELICS[r.id].evolution;
    return {
      kind: "evolve",
      icon: `relic_${r.id}_evo`,
      name: evo.name,
      line: `${RELICS[r.id].name} evolved. ${evo.text}`,
    };
  }
  if (r.type === "relic")
    return {
      kind: "relic",
      icon: `relic_${r.id}`,
      name: RELICS[r.id].name,
      line: `Level ${r.level} of ${RELIC_MAX_LEVEL}`,
    };
  if (r.type === "charm") {
    const def = CHARMS[r.id];
    return { kind: "charm", icon: `charm_${r.id}`, name: def.name, line: `Level ${r.level} of ${def.maxLevel}` };
  }
  const wind = BOONS[0];
  return { kind: "heal", icon: wind.id, name: "Full heal", line: "Nothing left to raise: HP and MP filled." };
}

/** one reward of a chest, as a row with its icon */
export function chestReward(r: ChestReward, index: number): HTMLElement {
  const face = rewardFace(r);
  const row = el("li", "chest-reward");
  row.dataset.kind = face.kind;
  row.style.setProperty("--delay", `${120 + index * 90}ms`);
  const frame = el("span", "chest-icon");
  const img = el("img", "");
  img.alt = "";
  img.width = 16;
  img.height = 16;
  img.src = iconUrl(face.icon);
  frame.append(img);
  const body = el("span", "chest-body");
  body.append(el("span", "chest-name", face.name), el("span", "chest-line", face.line));
  row.append(frame, body);
  return row;
}
