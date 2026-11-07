import "./buildSlots.css";
import { CHARMS } from "../../constants/charms";
import { SKILL_SLOTS } from "../../constants/growth";
import { character } from "../../game/state";
import { charmSlots } from "../../store/unlocks";
import type { Build, CharmId } from "../../types/build";
import { skillOf } from "../../utils/skills";
import { el } from "../dom";
import { iconUrl, skillIcon } from "./icons/iconImage";

type SlotKind = "skill" | "charm";

/** one held skill or charm: its icon and level; an evolved skill shows its evolved icon in gold instead of a level */
function slot(kind: SlotKind, icon: string, label: string, level: number, evolved: boolean): HTMLElement {
  const box = el("span", "build-slot");
  box.dataset.kind = kind;
  box.title = label;
  if (evolved) box.dataset.evolved = "";
  const img = el("img", "");
  img.alt = label;
  img.width = 16;
  img.height = 16;
  img.src = iconUrl(icon);
  box.append(img);
  if (!evolved) box.append(el("b", "", String(level)));
  return box;
}

/** a free slot */
const empty = (kind: SlotKind): HTMLElement => {
  const box = el("span", "build-slot empty");
  box.dataset.kind = kind;
  return box;
};

/** a row of slots: those held, then the free ones */
function row(kind: SlotKind, held: HTMLElement[], slots: number): HTMLElement {
  const line = el("span", "build-row");
  line.dataset.kind = kind;
  line.append(...held, ...Array.from({ length: Math.max(0, slots - held.length) }, () => empty(kind)));
  return line;
}

/** the skills and the charms a build holds, one slot each, in the order taken */
function held(build: Build): { skills: HTMLElement[]; charms: HTMLElement[] } {
  const skills = Object.entries(build.skills).map(([id, level]) => {
    const evolved = build.evolved.includes(id);
    const def = skillOf(character, id);
    const name = evolved ? (def?.evolution.name ?? id) : `${def?.name ?? id}, level ${level}`;
    return slot("skill", skillIcon(id, evolved), name, level, evolved);
  });
  const charms = (Object.entries(build.charms) as [CharmId, number][]).map(([id, level]) =>
    slot("charm", `charm_${id}`, `${CHARMS[id].name}, level ${level}`, level, false),
  );
  return { skills, charms };
}

/** the skills and charms a build holds, in their slots, filled and free */
export function buildSlots(build: Build): HTMLElement[] {
  const { skills, charms } = held(build);
  return [row("skill", skills, SKILL_SLOTS), row("charm", charms, charmSlots())];
}

/** only the skills and charms held, a row each, for the HUD */
export function heldSlots(build: Build): HTMLElement[] {
  const { skills, charms } = held(build);
  return [row("skill", skills, 0), row("charm", charms, 0)].filter((line) => line.childElementCount);
}

/** a key that changes whenever the slots would show something else */
export const buildKey = (build: Build): string =>
  `${JSON.stringify(build.skills)}${JSON.stringify(build.charms)}${build.evolved.join()}`;
