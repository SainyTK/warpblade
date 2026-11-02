import { ACTION_TEXT, KEYMAP } from "../../constants/input";
import type { InputAction } from "../../types/input";
import type { MenuView } from "../../types/menu";
import { keysByAction } from "../../utils/keymap";
import { backItem } from "./backItem";
import { keycap } from "./keycap";

function section(heading: string, rows: readonly [HTMLElement, string][]): HTMLElement {
  const box = document.createElement("section");
  box.className = "controls";
  const h = document.createElement("h3");
  h.textContent = heading;
  const list = document.createElement("dl");
  for (const [keys, text] of rows) {
    const dt = document.createElement("dt");
    dt.append(keys);
    const dd = document.createElement("dd");
    dd.textContent = text;
    list.append(dt, dd);
  }
  box.append(h, list);
  return box;
}

function keyboardRows(): [HTMLElement, string][] {
  return [...keysByAction(KEYMAP)].map(([action, codes]) => {
    const caps = document.createElement("span");
    caps.className = "caps";
    caps.append(...codes.map(keycap));
    return [caps, ACTION_TEXT[action]];
  });
}

/** read from the on-screen buttons themselves, so the list always matches what the player sees */
function touchRows(): [HTMLElement, string][] {
  return [...document.querySelectorAll<HTMLButtonElement>(".touch button[data-action]")].map((button) => {
    const face = document.createElement("span");
    face.className = "touch-face";
    face.textContent = button.textContent;
    return [face, ACTION_TEXT[button.dataset.action as InputAction]];
  });
}

/** every action with its keys from the key map, and on touch screens the on-screen buttons */
export function controlsScreen(): MenuView {
  const coarse = matchMedia("(any-pointer: coarse)").matches;
  const keyboard = !coarse || matchMedia("(any-pointer: fine)").matches;
  const scroll = document.createElement("div");
  scroll.className = "menu-scroll";
  if (coarse) scroll.append(section("On-screen buttons", touchRows()));
  if (keyboard) scroll.append(section("Keyboard", keyboardRows()));
  const content = document.createElement("div");
  content.className = "menu-sub";
  content.append(scroll, backItem());
  return {
    title: "Controls",
    subtitle: keyboard
      ? "In menus: arrows or W S to move, J or Enter to pick, Esc to go back."
      : "Tap an entry to pick it.",
    content,
  };
}
