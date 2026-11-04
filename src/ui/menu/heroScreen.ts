import { CHARACTERS } from "../../constants/characters";
import { ULT_LABEL } from "../../constants/skillLabels";
import { applySkin } from "../../game/hero/skin";
import { setCharacter } from "../../game/state";
import { saveHeroChoice } from "../../services/heroChoice";
import type { CharacterDef } from "../../types/character";
import type { MenuView } from "../../types/menu";
import { allNodes } from "../../utils/stats";
import { backItem } from "./backItem";
import { heroPortrait } from "./heroPortrait";
import { startGame } from "./menuActions";
import { focusEntry, onAdjust } from "./menuNav";

/** each stat as a share of this, for the bars */
const STAT_BARS: readonly { label: string; value: (c: CharacterDef) => number; full: number }[] = [
  { label: "HP", value: (c) => c.base.hp, full: 140 },
  { label: "Attack", value: (c) => c.base.ad, full: 14 },
  { label: "Magic", value: (c) => c.base.ap, full: 14 },
  { label: "MP", value: (c) => c.base.mp, full: 110 },
  { label: "Speed", value: (c) => c.base.move * c.base.aspd, full: 1.05 },
];

const titleCase = (s: string): string => s.toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase());

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text = ""): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text) node.textContent = text;
  return node;
}

function statBars(c: CharacterDef): HTMLElement {
  const list = el("dl", "hero-stats");
  for (const s of STAT_BARS) {
    const row = el("div", "");
    const bar = el("dd", "hero-bar");
    const fill = el("span", "");
    fill.style.width = `${Math.round(Math.min(1, s.value(c) / s.full) * 100)}%`;
    bar.append(fill);
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

function card(c: CharacterDef): HTMLButtonElement {
  const button = el("button", "hero-card");
  button.type = "button";
  button.dataset.nav = "";
  button.dataset.hero = c.id;
  const img = el("img", "hero-portrait");
  img.src = heroPortrait(c);
  img.alt = `${c.name}, ${c.title.toLowerCase()}`;
  button.append(img, el("strong", "hero-name", c.name), el("span", "hero-title", c.title), statBars(c), traits(c));
  button.append(el("span", "hero-blurb", c.blurb));
  // the hero behind the menu changes to the one in focus
  button.addEventListener("focus", () => applySkin(c.skin));
  button.addEventListener("click", () => {
    setCharacter(c);
    saveHeroChoice(c.id);
    startGame();
  });
  return button;
}

/** after Start: pick the hero for this run */
export function heroScreen(): MenuView {
  const cards = CHARACTERS.map(card);
  cards.forEach((c, i) => {
    onAdjust(c, (step) => focusEntry(cards[(i + step + cards.length) % cards.length]));
  });
  const row = el("div", "hero-cards");
  row.append(...cards);
  const content = el("div", "menu-main");
  content.append(row, backItem());
  return { title: "Choose a hero", subtitle: "A D or arrows to look, J or Enter to begin", content };
}
