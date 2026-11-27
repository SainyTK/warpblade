import { sfx } from "../../services/audio";
import { bank, buyLevel, isSwitchedOff, ownedLevel, priceOf, switchItem } from "../../store/meta";
import type { ArmoryItem } from "../../types/armory";
import { coinAmount } from "../coinIcon";
import { el } from "../dom";
import { onAdjust } from "../menu/menuNav";
import { shakeNode } from "../menu/shakeNode";
import { iconUrl } from "../skills/icons/iconImage";
import { iconImage } from "../unlocks/unlockIcon";

function levelPips(level: number, levels: number): HTMLSpanElement {
  const pips = el("span", "row-pips");
  for (let i = 0; i < levels; i++) pips.append(el("i", i < level ? "on" : ""));
  return pips;
}

function priceTag(item: ArmoryItem): HTMLSpanElement {
  const price = priceOf(item);
  if (price === null) return el("span", "row-price done", "Max");
  const tag = coinAmount(price, "row-price");
  if (price > bank()) tag.classList.add("short");
  return tag;
}

function switchChip(item: ArmoryItem): HTMLSpanElement {
  const on = !isSwitchedOff(item.id);
  const chip = el("span", "armory-switch", on ? "On" : "Off");
  chip.setAttribute("role", "switch");
  chip.setAttribute("aria-checked", String(on));
  chip.setAttribute("aria-label", `${item.name} ${on ? "on" : "off"}`);
  chip.addEventListener("click", (ev) => {
    ev.stopPropagation();
    sfx.menuMove();
    switchItem(item.id, !on);
  });
  return chip;
}

export function armoryRow(item: ArmoryItem): HTMLElement {
  const level = ownedLevel(item.id);
  const row = el("div", "list-row armory-item");
  row.tabIndex = -1;
  row.dataset.nav = "";
  row.dataset.kind = item.kind;
  row.setAttribute("role", "button");
  if (level && isSwitchedOff(item.id)) row.dataset.off = "";
  const frame = el("span", "row-icon");
  frame.append(iconImage(iconUrl(item.id)));
  const head = el("span", "row-head");
  head.append(el("span", "row-name", item.name));
  if (item.levels > 1) head.append(levelPips(level, item.levels));
  if (level) head.append(switchChip(item));
  const body = el("span", "row-body");
  body.append(head, el("span", "row-text", item.levelText));
  let tag = priceTag(item);
  row.append(frame, body, tag);
  row.setAttribute("aria-label", `${item.name}, level ${level} of ${item.levels}. ${item.levelText}`);
  const disarm = (): void => {
    if (row.dataset.armed === undefined) return;
    delete row.dataset.armed;
    const fresh = priceTag(item);
    tag.replaceWith(fresh);
    tag = fresh;
  };
  row.addEventListener("click", () => {
    const price = priceOf(item);
    if (price === null) return;
    if (price > bank()) {
      sfx.denied();
      shakeNode(tag);
      return;
    }
    if (row.dataset.armed === undefined) {
      row.dataset.armed = "";
      tag.replaceChildren("Buy?");
      return;
    }
    if (buyLevel(item)) sfx.learn();
  });
  row.addEventListener("blur", disarm);
  onAdjust(row, () => {
    if (!level) return;
    switchItem(item.id, isSwitchedOff(item.id));
  });
  return row;
}
