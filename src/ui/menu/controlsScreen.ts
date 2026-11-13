import { ACTION_TEXT, HOLD_ACTIONS, KEYMAP } from "../../constants/input";
import { character } from "../../game/state";
import type { HeldAction, InputAction } from "../../types/input";
import type { MenuView } from "../../types/menu";
import { keysByAction } from "../../utils/keymap";
import { touchLegend } from "../touch/touchLegend";
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

/** the keys of one row, after the word Hold for a long press */
function capsOf(codes: readonly string[], hold: boolean): HTMLElement {
  const caps = document.createElement("span");
  caps.className = "caps";
  if (hold) {
    const word = document.createElement("span");
    word.className = "cap-hold";
    word.textContent = "Hold";
    caps.append(word);
  }
  caps.append(...codes.map(keycap));
  return caps;
}

const isHeldAction = (a: InputAction): a is HeldAction => a in HOLD_ACTIONS;

/** each action's keys and what it does; a key with a long press gets a second row for it, Hold J under J */
function keyboardRows(): [HTMLElement, string][] {
  const text = ACTION_TEXT[character.kit];
  return [...keysByAction(KEYMAP)].flatMap(([action, codes]): [HTMLElement, string][] => {
    const row: [HTMLElement, string] = [capsOf(codes, false), text[action]];
    if (!isHeldAction(action)) return [row];
    return [row, [capsOf(codes, true), text[HOLD_ACTIONS[action]]]];
  });
}

/** every action with its keys from the key map, and on touch screens the on-screen buttons, as the chosen hero plays them */
export function controlsScreen(): MenuView {
  const coarse = matchMedia("(any-pointer: coarse)").matches;
  const keyboard = !coarse || matchMedia("(any-pointer: fine)").matches;
  const scroll = document.createElement("div");
  scroll.className = "menu-scroll";
  if (coarse) scroll.append(section("Touch", touchLegend()));
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
