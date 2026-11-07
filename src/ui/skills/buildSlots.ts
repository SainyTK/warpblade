import "./buildSlots.css";
import { CHARMS } from "../../constants/charms";
import { RELICS } from "../../constants/relics";
import { charmSlots, relicSlots } from "../../store/unlocks";
import type { Build, CharmId, RelicId } from "../../types/build";
import { el } from "../dom";
import { iconUrl } from "./icons/iconImage";

/** one held relic or charm: its icon and level, gold once evolved */
function slot(kind: "relic" | "charm", icon: string, label: string, level: number, evolved: boolean): HTMLElement {
  const box = el("span", "build-slot");
  box.dataset.kind = kind;
  box.title = label;
  if (evolved) box.dataset.evolved = "";
  const img = el("img", "");
  img.alt = label;
  img.width = 16;
  img.height = 16;
  img.src = iconUrl(icon);
  box.append(img, el("b", "", evolved ? "EVO" : String(level)));
  return box;
}

/** a free slot */
const empty = (kind: "relic" | "charm"): HTMLElement => {
  const box = el("span", "build-slot empty");
  box.dataset.kind = kind;
  return box;
};

/** a row of slots: those held, then the free ones */
function row(kind: "relic" | "charm", held: HTMLElement[], slots: number): HTMLElement {
  const line = el("span", "build-row");
  line.dataset.kind = kind;
  line.append(...held, ...Array.from({ length: Math.max(0, slots - held.length) }, () => empty(kind)));
  return line;
}

/** the relics and charms a build holds, in the slots the player has unlocked, filled and free */
export function buildSlots(build: Build): HTMLElement[] {
  const relics = (Object.entries(build.relics) as [RelicId, number][]).map(([id, level]) => {
    const evolved = build.evolved.includes(id);
    const def = RELICS[id];
    const name = evolved ? def.evolution.name : `${def.name}, level ${level}`;
    return slot("relic", evolved ? `relic_${id}_evo` : `relic_${id}`, name, level, evolved);
  });
  const charms = (Object.entries(build.charms) as [CharmId, number][]).map(([id, level]) =>
    slot("charm", `charm_${id}`, `${CHARMS[id].name}, level ${level}`, level, false),
  );
  return [row("relic", relics, relicSlots()), row("charm", charms, charmSlots())];
}

/** a key that changes whenever the slots would show something else */
export const buildKey = (build: Build): string =>
  `${JSON.stringify(build.relics)}${JSON.stringify(build.charms)}${build.evolved.join()}`;
