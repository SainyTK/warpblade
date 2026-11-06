import { heroUnlocked } from "../../store/meta";
import type { CharacterDef } from "../../types/character";
import { el } from "../dom";
import { heroPortrait } from "./heroPortrait";
import { lockIcon } from "./lockIcon";

/** one hero in the roster strip: the head and shoulders, black with a padlock while locked; a press picks the hero */
export function heroTile(c: CharacterDef, pick: () => void): HTMLButtonElement {
  const tile = el("button", "hero-tile");
  tile.type = "button";
  // the panel under the roster is the one entry the keys move to; the tiles are for pointers and touch
  tile.tabIndex = -1;
  tile.style.setProperty("--accent", c.accent);
  tile.setAttribute("aria-label", c.name);
  const img = el("img", "hero-face");
  img.src = heroPortrait(c);
  img.alt = "";
  tile.append(img);
  if (!heroUnlocked(c.id)) {
    tile.dataset.locked = "";
    tile.append(lockIcon());
  }
  tile.addEventListener("click", pick);
  return tile;
}
