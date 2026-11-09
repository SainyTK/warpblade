import "./heroScreen.css";
import { CHARACTERS } from "../../constants/characters";
import { character, chooseCharacter, previewCharacter } from "../../game/state";
import { sfx } from "../../services/audio";
import { saveHeroChoice } from "../../services/heroChoice";
import { bank, buyHero, heroUnlocked } from "../../store/meta";
import type { CharacterDef } from "../../types/character";
import type { MenuView } from "../../types/menu";
import { coinAmount } from "../coinIcon";
import { el } from "../dom";
import { backItem } from "./backItem";
import { type HeroPage, heroPage } from "./heroPage";
import { heroTile } from "./heroTile";
import { startGame } from "./menuActions";
import { focusEntry, onAdjust } from "./menuNav";

/**
 * A press on the panel: an unlocked hero starts the run. For a locked one the first press asks again, the second one
 * unlocks with coins and makes the hero the choice, and a press the bank cannot pay for is refused with a shake. The run never starts with a locked hero.
 */
function act(panel: HTMLButtonElement, c: CharacterDef, page: HeroPage): void {
  if (!page.lock) {
    chooseCharacter(c);
    saveHeroChoice(c.id);
    startGame();
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
  chooseCharacter(c);
  saveHeroChoice(c.id);
  if (buyHero(c.id)) sfx.learn();
}

/** after Start: a roster of every hero over one panel for the hero in focus, starting at the one chosen last */
export function heroScreen(): MenuView {
  const pages = CHARACTERS.map(heroPage);
  const panel = el("button", "hero-panel");
  panel.type = "button";
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
    at = i;
    const c = CHARACTERS[i];
    tiles[i].setAttribute("aria-current", "true");
    pages[i].root.dataset.shown = "";
    panel.dataset.hero = c.id;
    content.style.setProperty("--accent", c.accent);
    // the hero behind the menu changes to the one in focus, in that hero's own rest pose
    previewCharacter(c);
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
  const subtitle = locked ? coinAmount(bank(), "bank") : "A D or arrows to look, J or Enter to begin";
  return { title: "Choose a hero", subtitle, content, focus: panel };
}
