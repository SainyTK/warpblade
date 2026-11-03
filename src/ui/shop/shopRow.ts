import { sfx } from "../../services/audio";
import { bank, buy, ownedLevel } from "../../store/meta";
import type { ShopItem } from "../../types/shop";
import { maxLevel, nextPrice } from "../../utils/shop";
import { coinAmount } from "../coinIcon";
import { iconUrl } from "../skills/icons/iconImage";

/** how long a refused press shakes the price */
const DENY_MS = 400;

function span(cls: string, text = ""): HTMLSpanElement {
  const el = document.createElement("span");
  el.className = cls;
  el.textContent = text;
  return el;
}

/** level pips for a stat: one per level, lit for each one bought */
function levelPips(level: number, levels: number): HTMLSpanElement {
  const el = span("shop-pips");
  for (let i = 0; i < levels; i++) {
    const pip = document.createElement("i");
    if (i < level) pip.className = "on";
    el.append(pip);
  }
  return el;
}

/** the price of the next level, or that there is nothing left to buy */
function priceTag(item: ShopItem, level: number): HTMLSpanElement {
  const price = nextPrice(item, level);
  if (price === null) return span("shop-price done", item.kind === "stat" ? "Max" : "Owned");
  const tag = coinAmount(price, "shop-price");
  if (price > bank()) tag.classList.add("short");
  return tag;
}

/**
 * One item of the shop. The first press asks again in the price's place and the second one buys, the way Restart
 * asks before it acts; a press the bank cannot pay for is refused with a shake.
 */
export function shopRow(item: ShopItem): HTMLButtonElement {
  const level = ownedLevel(item.id);
  const price = nextPrice(item, level);
  const b = document.createElement("button");
  b.type = "button";
  b.className = "shop-item";
  b.dataset.nav = "";
  b.dataset.kind = item.kind;
  if (price === null) b.dataset.done = "";
  const icon = document.createElement("img");
  icon.src = iconUrl(item.id);
  icon.alt = "";
  icon.width = 16;
  icon.height = 16;
  const frame = span("shop-icon");
  frame.append(icon);
  const name = span("shop-name", item.name);
  const head = span("shop-head");
  head.append(name);
  if (item.kind === "stat") head.append(levelPips(level, maxLevel(item)));
  const body = span("shop-body");
  body.append(head, span("shop-text", item.text));
  const tag = priceTag(item, level);
  b.append(frame, body, tag);
  b.addEventListener("click", () => {
    if (price === null) return;
    if (price > bank()) {
      sfx.denied();
      tag.classList.remove("deny");
      void tag.offsetWidth;
      tag.classList.add("deny");
      setTimeout(() => tag.classList.remove("deny"), DENY_MS);
      return;
    }
    if (b.dataset.armed === undefined) {
      b.dataset.armed = "";
      tag.replaceChildren("Buy?");
      return;
    }
    if (buy(item)) sfx.learn();
  });
  b.addEventListener("blur", () => {
    if (b.dataset.armed === undefined) return;
    delete b.dataset.armed;
    tag.replaceWith(priceTag(item, level));
  });
  return b;
}
