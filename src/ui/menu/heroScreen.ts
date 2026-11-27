import "./heroScreen.css";
import { character, chooseCharacter, previewCharacter } from "../../game/state";
import { CHARACTERS } from "../../heroes/roster";
import { sfx } from "../../services/audio";
import { saveHeroChoice } from "../../services/heroChoice";
import { chosenJob } from "../../store/jobs";
import { bank, buyHero, heroUnlocked } from "../../store/meta";
import type { CharacterDef } from "../../types/character";
import type { MenuView } from "../../types/menu";
import { coinAmount } from "../coinIcon";
import { el } from "../dom";
import { backItem } from "./backItem";
import { type HeroPage, heroPage } from "./heroPage";
import { heroPortrait } from "./heroPortrait";
import { heroTile } from "./heroTile";
import { focusEntry, onAdjust } from "./menuNav";
import { showScreen } from "./menuState";

function act(panel: HTMLElement, c: CharacterDef, page: HeroPage): void {
  if (!page.lock) {
    chooseCharacter(c, chosenJob(c.id));
    saveHeroChoice(c.id);
    showScreen("stage");
    return;
  }
  if (page.lock.price > bank()) {
    sfx.denied();
    page.lock.deny();
    return;
  }
  if (panel.dataset.armed === undefined) {
    panel.dataset.armed = "";
    page.lock.show(true);
    return;
  }
  // the hero just bought becomes the choice, so the screen redraws on them, ready to start
  chooseCharacter(c, chosenJob(c.id));
  saveHeroChoice(c.id);
  if (buyHero(c.id)) sfx.learn();
}

export function heroScreen(): MenuView {
  const pages = CHARACTERS.map((c, i) =>
    heroPage(c, (job) => {
      const face = tiles[i].querySelector<HTMLImageElement>(".hero-face");
      if (face) face.src = heroPortrait(c, job);
      previewCharacter(c, job);
    }),
  );
  // the panel holds the job row's chips, so it is a button by role, since a button may not hold buttons
  const panel = el("div", "hero-panel");
  panel.tabIndex = 0;
  panel.setAttribute("role", "button");
  panel.dataset.nav = "";
  panel.append(...pages.map((p) => p.root));
  const content = el("div", "menu-main hero-screen");
  let at = 0;
  const disarm = (): void => {
    if (panel.dataset.armed === undefined) return;
    delete panel.dataset.armed;
    pages[at].lock?.show(false);
  };
  const show = (i: number): void => {
    disarm();
    tiles[at].removeAttribute("aria-current");
    pages[at].root.removeAttribute("data-shown");
    pages[at].jobs?.removeAttribute("data-nav");
    at = i;
    const c = CHARACTERS[i];
    tiles[i].setAttribute("aria-current", "true");
    pages[i].root.dataset.shown = "";
    pages[i].jobs?.setAttribute("data-nav", "");
    panel.dataset.hero = c.id;
    content.style.setProperty("--accent", c.accent);
    // the hero behind the menu changes to the one in focus, in the job chosen for them and their own rest pose
    previewCharacter(c, chosenJob(c.id));
  };
  const tiles = CHARACTERS.map((_, i) =>
    heroTile(CHARACTERS[i], () => {
      show(i);
      focusEntry(panel);
    }),
  );
  onAdjust(panel, (step) => show((at + step + CHARACTERS.length) % CHARACTERS.length));
  panel.addEventListener("click", () => act(panel, CHARACTERS[at], pages[at]));
  panel.addEventListener("blur", disarm);
  const roster = el("div", "hero-roster");
  roster.setAttribute("aria-label", "Heroes");
  roster.append(...tiles);
  content.append(roster, panel, backItem());
  show(CHARACTERS.indexOf(character));
  // with a hero still to unlock, the bank takes the place of the keys
  const locked = CHARACTERS.some((c) => !heroUnlocked(c.id));
  const keys = matchMedia("(any-pointer: fine)").matches
    ? "A D or arrows to look, J or Enter to choose"
    : "Tap a hero to look, tap the panel to choose";
  const subtitle = locked ? coinAmount(bank(), "bank") : keys;
  return { title: "Choose a hero", subtitle, content, focus: panel };
}
