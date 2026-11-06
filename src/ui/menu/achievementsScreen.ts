import "../shop/shop.css";
import "../achievements/achievements.css";
import { ACHIEVEMENT_GROUPS } from "../../constants/achievements";
import { allAchievements, earnedIds, goalSource } from "../../store/achievements";
import type { MenuView } from "../../types/menu";
import { achievementRow } from "../achievements/achievementRow";
import { backItem } from "./backItem";

/** every achievement by group, earned ones lit and the rest with their goals; the count earned is under the title */
export function achievementsScreen(): MenuView {
  const list = allAchievements();
  const earned = earnedIds();
  const src = goalSource();
  const scroll = document.createElement("div");
  scroll.className = "menu-scroll shop";
  for (const group of ACHIEVEMENT_GROUPS) {
    const items = list.filter((a) => a.group === group);
    if (!items.length) continue;
    const box = document.createElement("section");
    box.className = "shop-section";
    const h = document.createElement("h3");
    h.textContent = group;
    box.append(h, ...items.map((a) => achievementRow(a, earned, src)));
    scroll.append(box);
  }
  const content = document.createElement("div");
  content.className = "menu-sub";
  content.append(scroll, backItem());
  const count = list.filter((a) => earned.has(a.id)).length;
  return { title: "Achievements", subtitle: `${count} of ${list.length} earned`, content };
}
