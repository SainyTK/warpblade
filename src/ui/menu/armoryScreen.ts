import "./listRows.css";
import "../armory/armory.css";
import { ARMORY_ITEMS, ARMORY_SECTION_OF, ARMORY_SECTIONS } from "../../constants/armory";
import { sfx } from "../../services/audio";
import { bank, refundAll, refundValue } from "../../store/meta";
import { forSale, itemShown } from "../../store/unlocks";
import type { MenuView } from "../../types/menu";
import { armoryRow } from "../armory/armoryRow";
import { isSkillSale, skillSaleRow } from "../armory/skillSaleRow";
import { coinAmount } from "../coinIcon";
import { el } from "../dom";
import { backItem } from "./backItem";
import { menuItem } from "./menuItem";

function section(heading: string, rows: readonly HTMLElement[]): HTMLElement {
  const box = el("section", "list-section");
  box.append(el("h3", "", heading), ...rows);
  return box;
}

function refundItem(value: number): HTMLButtonElement {
  return menuItem(
    "Refund all",
    () => {
      if (refundAll()) sfx.learn();
    },
    `Refund ${value.toLocaleString("en-US")} gold? Press again`,
  );
}

const KEYS_FINE = "J or Enter to buy, A or D to switch on or off";
const KEYS_TOUCH = "Tap to buy, tap On or Off to switch";

function foot(shown: number): HTMLElement | null {
  const value = refundValue();
  if (!shown && !value) return null;
  const box = el("div", "armory-foot");
  if (shown) box.append(el("p", "armory-keys", matchMedia("(any-pointer: fine)").matches ? KEYS_FINE : KEYS_TOUCH));
  if (value) box.append(refundItem(value));
  return box;
}

export function armoryScreen(): MenuView {
  const shown = ARMORY_ITEMS.filter((item) => itemShown(item.id));
  const scroll = el("div", "menu-scroll rows");
  for (const heading of ARMORY_SECTIONS) {
    const items = shown.filter((item) => ARMORY_SECTION_OF[item.kind] === heading);
    if (items.length) scroll.append(section(heading, items.map(armoryRow)));
  }
  const skills = forSale("skill")
    .filter(isSkillSale)
    .flatMap((def) => skillSaleRow(def) ?? []);
  if (skills.length) scroll.append(section("Skills", skills));
  const hidden = ARMORY_ITEMS.length - shown.length;
  if (!shown.length && !skills.length)
    scroll.append(el("p", "armory-note", "Nothing yet. The Codex shows what opens each item."));
  else if (hidden) scroll.append(el("p", "armory-note", `${hidden} more in the Codex, each with what opens it.`));
  const content = el("div", "menu-sub");
  const actions = foot(shown.length);
  content.append(scroll, ...(actions ? [actions] : []), backItem());
  return { title: "Armory", subtitle: coinAmount(bank(), "bank"), content };
}
