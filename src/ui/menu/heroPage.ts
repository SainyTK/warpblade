import { ULT_LABEL } from "../../constants/skillLabels";
import { heroPrice, heroUnlocked, metaBonus } from "../../store/meta";
import type { CharacterDef } from "../../types/character";
import type { Stats } from "../../types/stats";
import { allNodes, computeStats } from "../../utils/stats";
import { el } from "../dom";
import { type HeroLock, heroLock } from "./heroLock";
import { heroPortrait } from "./heroPortrait";

/** each stat as a share of this, for the bars; full is about the strongest hero with every shop level bought */
const STAT_BARS: readonly { label: string; value: (s: Stats) => number; full: number }[] = [
  { label: "HP", value: (s) => s.hp, full: 180 },
  { label: "Attack", value: (s) => s.ad, full: 18 },
  { label: "Magic", value: (s) => s.ap, full: 15 },
  { label: "MP", value: (s) => s.mp, full: 150 },
  { label: "Speed", value: (s) => s.move * s.aspd, full: 1.15 },
];

const titleCase = (s: string): string => s.toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase());

const share = (value: number, full: number): string => `${Math.round(Math.min(1, value / full) * 100)}%`;

/** the hero's own stats at level 1, and in a lighter part what the shop adds, which every hero gets alike */
function statBars(c: CharacterDef): HTMLElement {
  const list = el("dl", "hero-stats");
  const own = computeStats(c, 1, c.startRanks ?? {});
  const bought = computeStats(c, 1, c.startRanks ?? {}, metaBonus());
  for (const s of STAT_BARS) {
    const row = el("div", "");
    const bar = el("dd", "hero-bar");
    const fill = el("span", "");
    fill.style.width = share(s.value(own), s.full);
    const extra = el("i", "");
    extra.style.width = share(s.value(bought), s.full);
    bar.append(extra, fill);
    row.append(el("dt", "", s.label), bar);
    list.append(row);
  }
  return list;
}

/** what the hero brings to a run besides stats: their special, and any skill known from the start */
function traits(c: CharacterDef): HTMLElement {
  const box = el("p", "hero-traits");
  box.append(`Special: ${titleCase(ULT_LABEL[c.special])}`);
  const known = allNodes(c).filter((n) => c.startRanks?.[n.id]);
  if (known.length) box.append(el("br", ""), `Starts with: ${known.map((n) => n.name).join(", ")}`);
  return box;
}

export interface HeroPage {
  root: HTMLElement;
  /** the padlock and price, for a hero still to unlock */
  lock: HeroLock | null;
}

/** everything the hero screen tells about one hero: portrait, name, stats, traits, and the price while locked */
export function heroPage(c: CharacterDef): HeroPage {
  const root = el("section", "hero-page");
  root.style.setProperty("--accent", c.accent);
  const img = el("img", "hero-portrait");
  img.src = heroPortrait(c);
  img.alt = `${c.name}, ${c.title.toLowerCase()}`;
  const name = el("strong", "hero-name", c.name);
  root.append(img, name, el("span", "hero-title", c.title), statBars(c), traits(c), el("p", "hero-blurb", c.blurb));
  const price = heroPrice(c.id);
  if (price === null || heroUnlocked(c.id)) return { root, lock: null };
  root.dataset.locked = "";
  img.alt = `${c.name}, locked`;
  const lock = heroLock(price);
  root.append(lock.root);
  return { root, lock };
}
