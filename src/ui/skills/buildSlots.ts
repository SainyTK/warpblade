import "./buildSlots.css";
import { ELEMENT_ORDER, ELEMENTS } from "../../constants/elements";
import { SKILL_SLOTS } from "../../constants/growth";
import { character, progress } from "../../game/state";
import { ARTS } from "../../stages/arts";
import type { Build } from "../../types/build";
import type { ArtId } from "../../types/campaign";
import { skillSlots } from "../../utils/cardSupply";
import { resonanceRanks } from "../../utils/resonance";
import { skillOf } from "../../utils/skills";
import { el } from "../dom";
import { iconUrl, skillIcon } from "./icons/iconImage";

type SlotKind = "skill" | "art" | "element";

const ART_SLOTS = 8;

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
function held(build: Build): { skills: HTMLElement[]; arts: HTMLElement[]; elements: HTMLElement[] } {
  const skills = Object.entries(build.skills).map(([id, level]) => {
    const evolved = build.evolved.includes(id);
    const def = skillOf(character, id);
    const name = evolved ? (def?.evolution.name ?? id) : `${def?.name ?? id}, level ${level}`;
    return slot("skill", skillIcon(id, evolved), name, level, evolved);
  });
  const arts = (Object.entries(build.arts) as [ArtId, number][]).map(([id, level]) =>
    slot("art", `art_${id}`, `${ARTS[id].name}, level ${level}`, level, false),
  );
  const ranks = resonanceRanks(build, character, ARTS);
  const elements = ELEMENT_ORDER.filter((id) => ranks[id] > 0).map((id) =>
    slot("element", `el_${id}`, `${ELEMENTS[id].name} resonance ${ranks[id]}`, ranks[id], false),
  );
  return { skills, arts, elements };
}

/** the skills and charms a build holds, in their slots, filled and free */
export function buildSlots(build: Build): HTMLElement[] {
  const { skills, arts, elements } = held(build);
  return [row("skill", skills, skillSlots(progress.level)), row("element", elements, 0), row("art", arts, 0)].filter(
    (line) => line.childElementCount,
  );
}

/** only the skills and charms held, a row each, for the HUD */
export function heldSlots(build: Build): HTMLElement[] {
  const { skills, arts, elements } = held(build);
  return [row("skill", skills, 0), row("element", elements, 0), row("art", arts, 0)].filter(
    (line) => line.childElementCount,
  );
}

/** every slot a run can fill, all free, for the HUD to keep room for its fullest strip */
export const allSlots = (): HTMLElement[] => [
  row("skill", [], SKILL_SLOTS),
  row("element", [], ELEMENT_ORDER.length),
  row("art", [], ART_SLOTS),
];

/** a key that changes whenever the slots would show something else */
export const buildKey = (build: Build): string =>
  `${JSON.stringify(build.skills)}${JSON.stringify(build.arts)}${build.evolved.join()}`;
