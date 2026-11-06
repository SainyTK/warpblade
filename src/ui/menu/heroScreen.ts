import { CHARACTERS } from "../../constants/characters";
import { ULT_LABEL } from "../../constants/skillLabels";
import { applySkin } from "../../game/hero/skin";
import { character, setCharacter } from "../../game/state";
import { sfx } from "../../services/audio";
import { saveHeroChoice } from "../../services/heroChoice";
import { bank, buyHero, heroPrice, heroUnlocked, metaBonus } from "../../store/meta";
import type { CharacterDef } from "../../types/character";
import type { MenuView } from "../../types/menu";
import type { Stats } from "../../types/stats";
import { allNodes, computeStats } from "../../utils/stats";
import { coinAmount } from "../coinIcon";
import { backItem } from "./backItem";
import { heroPortrait } from "./heroPortrait";
import { lockIcon } from "./lockIcon";
import { startGame } from "./menuActions";
import { focusEntry, onAdjust } from "./menuNav";

/** each stat as a share of this, for the bars; full is about the strongest hero with every shop level bought */
const STAT_BARS: readonly { label: string; value: (s: Stats) => number; full: number }[] = [
  { label: "HP", value: (s) => s.hp, full: 180 },
  { label: "Attack", value: (s) => s.ad, full: 18 },
  { label: "Magic", value: (s) => s.ap, full: 15 },
  { label: "MP", value: (s) => s.mp, full: 150 },
  { label: "Speed", value: (s) => s.move * s.aspd, full: 1.15 },
];

const titleCase = (s: string): string => s.toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase());

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text = ""): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text) node.textContent = text;
  return node;
}

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

/** how long a refused press shakes the price */
const DENY_MS = 400;

/** the padlock and the price of a locked hero, or the question in its place once a press asked */
function lockLine(price: number, armed: boolean): HTMLElement {
  const line = el("span", "hero-lock");
  if (armed) line.append(lockIcon(), "Unlock? Press again");
  else {
    const tag = coinAmount(price);
    if (price > bank()) tag.classList.add("short");
    line.append(lockIcon(), tag);
  }
  return line;
}

/**
 * A locked hero's press: the first one asks again, the second one unlocks with coins, and a press the bank cannot pay
 * for is refused with a shake. The run never starts with a locked hero.
 */
function bindUnlock(button: HTMLButtonElement, c: CharacterDef, price: number): void {
  let line = lockLine(price, false);
  button.append(line);
  const show = (armed: boolean): void => {
    const next = lockLine(price, armed);
    line.replaceWith(next);
    line = next;
  };
  button.addEventListener("click", () => {
    if (price > bank()) {
      sfx.denied();
      line.classList.remove("deny");
      void line.offsetWidth;
      line.classList.add("deny");
      setTimeout(() => line.classList.remove("deny"), DENY_MS);
      return;
    }
    if (button.dataset.armed === undefined) {
      button.dataset.armed = "";
      show(true);
      return;
    }
    if (buyHero(c.id)) sfx.learn();
  });
  button.addEventListener("blur", () => {
    if (button.dataset.armed === undefined) return;
    delete button.dataset.armed;
    show(false);
  });
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
  const price = heroPrice(c.id);
  if (price !== null && !heroUnlocked(c.id)) {
    button.dataset.locked = "";
    img.alt = `${c.name}, locked`;
    bindUnlock(button, c, price);
    return button;
  }
  button.addEventListener("click", () => {
    setCharacter(c);
    saveHeroChoice(c.id);
    startGame();
  });
  return button;
}

/** after Start: pick the hero for this run, starting at the one chosen last */
export function heroScreen(): MenuView {
  const cards = CHARACTERS.map(card);
  cards.forEach((c, i) => {
    onAdjust(c, (step) => focusEntry(cards[(i + step + cards.length) % cards.length]));
  });
  const row = el("div", "hero-cards");
  row.append(...cards);
  const content = el("div", "menu-main");
  content.append(row, backItem());
  const focus = cards[CHARACTERS.indexOf(character)];
  // with a hero still to unlock, the bank takes the place of the keys
  const locked = CHARACTERS.some((c) => !heroUnlocked(c.id));
  const subtitle = locked ? coinAmount(bank(), "bank") : "A D or arrows to look, J or Enter to begin";
  return { title: "Choose a hero", subtitle, content, focus };
}
