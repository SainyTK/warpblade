import { CHARACTERS } from "../../heroes/roster";
import { sfx } from "../../services/audio";
import { bank } from "../../store/meta";
import { buyUnlock } from "../../store/unlocks";
import type { UnlockDef, UnlockReward } from "../../types/unlock";
import { findSkill } from "../../utils/skills";
import { coinAmount } from "../coinIcon";
import { el } from "../dom";
import { shakeNode } from "../menu/shakeNode";
import { iconUrl } from "../skills/icons/iconImage";
import { iconImage } from "../unlocks/unlockIcon";

function priceTag(price: number): HTMLSpanElement {
  const tag = coinAmount(price, "row-price");
  if (price > bank()) tag.classList.add("short");
  return tag;
}

export type SkillSale = UnlockDef & { reward: Extract<UnlockReward, { kind: "skill" }>; price: number };

export const isSkillSale = (def: UnlockDef): def is SkillSale => def.reward.kind === "skill" && def.price !== undefined;

export function skillSaleRow(def: SkillSale): HTMLElement | null {
  const skill = findSkill(def.reward.skill);
  const hero = CHARACTERS.find((c) => c.id === def.reward.hero);
  if (!skill || !hero) return null;
  const row = el("div", "list-row armory-item");
  row.tabIndex = -1;
  row.dataset.nav = "";
  row.dataset.kind = "skill";
  row.setAttribute("role", "button");
  row.style.setProperty("--accent", hero.accent);
  const frame = el("span", "row-icon");
  frame.append(iconImage(iconUrl(skill.id)));
  const head = el("span", "row-head");
  head.append(el("span", "row-name", skill.name), el("span", "armory-hero", hero.name));
  const body = el("span", "row-body");
  body.append(head, el("span", "row-text", skill.text));
  let tag = priceTag(def.price);
  row.append(frame, body, tag);
  row.setAttribute("aria-label", `${skill.name}, ${hero.name}'s skill. ${skill.text}`);
  row.addEventListener("click", () => {
    if (def.price > bank()) {
      sfx.denied();
      shakeNode(tag);
      return;
    }
    if (row.dataset.armed === undefined) {
      row.dataset.armed = "";
      tag.replaceChildren("Buy?");
      return;
    }
    if (buyUnlock(def.id)) sfx.learn();
  });
  row.addEventListener("blur", () => {
    if (row.dataset.armed === undefined) return;
    delete row.dataset.armed;
    const fresh = priceTag(def.price);
    tag.replaceWith(fresh);
    tag = fresh;
  });
  return row;
}
