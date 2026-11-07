import "../shop/shop.css";
import { SHOP_ITEMS } from "../../constants/shop";
import { bank } from "../../store/meta";
import type { MenuView } from "../../types/menu";
import type { ShopItem } from "../../types/shop";
import { coinAmount } from "../coinIcon";
import { shopRow } from "../shop/shopRow";
import { backItem } from "./backItem";

function section(heading: string, items: readonly ShopItem[]): HTMLElement {
  const box = document.createElement("section");
  box.className = "shop-section";
  const h = document.createElement("h3");
  h.textContent = heading;
  box.append(h, ...items.map(shopRow));
  return box;
}

/** stats and pick tools bought in levels and skills bought once, kept for every run; the bank is under the title */
export function shopScreen(): MenuView {
  const scroll = document.createElement("div");
  scroll.className = "menu-scroll shop";
  scroll.append(
    section(
      "Stats",
      SHOP_ITEMS.filter((i) => i.kind === "stat"),
    ),
    section(
      "Picks",
      SHOP_ITEMS.filter((i) => i.kind === "tool"),
    ),
    section(
      "Skills",
      SHOP_ITEMS.filter((i) => i.kind === "skill"),
    ),
  );
  const content = document.createElement("div");
  content.className = "menu-sub";
  content.append(scroll, backItem());
  return { title: "Shop", subtitle: coinAmount(bank(), "bank"), content };
}
