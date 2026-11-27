import { HOLD_ACTIONS, KEYMAP } from "../../constants/input";
import { DRILL_KEYMAP, drillActionText, heroDrill } from "../../drill";
import { isAdventure } from "../../game/adventure";
import { heroJob } from "../../game/hero/job";
import { character } from "../../game/state";
import { inRoom } from "../../store/coop";
import type { HeldAction, InputAction } from "../../types/input";
import type { MenuContext, MenuView } from "../../types/menu";
import { actionText } from "../../utils/controls";
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
  caps.append(...codes.filter((code) => code !== "ShiftRight").map(keycap));
  return caps;
}

const isHeldAction = (a: InputAction): a is HeldAction => a in HOLD_ACTIONS;

/** each action's keys and what it does; a key with a long press gets a second row for it, Hold J under J */
function keyboardRows(adventure: boolean): [HTMLElement, string][] {
  const profile = adventure ? heroDrill() : undefined;
  const drill = profile !== undefined;
  const text = actionText(character, heroJob());
  if (adventure) {
    text.up = "Jump or double jump. Jump upward along a wall or hold away to kick off.";
    text.down = "Drop through a ledge.";
    text.dash = `${text.dash}. Jump during the dodge to keep your speed.`;
  }
  if (profile) Object.assign(text, drillActionText(profile));
  return [...keysByAction(drill ? DRILL_KEYMAP : KEYMAP)].flatMap(([action, codes]): [HTMLElement, string][] => {
    if (!adventure && action === "interact") return [];
    const row: [HTMLElement, string] = [capsOf(codes, false), text[action]];
    if (drill) {
      if (action === "ultimate") return [];
      return action === "attack" ? [row, [capsOf(codes, true), text.ultimate]] : [row];
    }
    if (!isHeldAction(action)) return [row];
    return [row, [capsOf(codes, true), text[HOLD_ACTIONS[action]]]];
  });
}

/** every action with its keys from the key map, and on touch screens the on-screen buttons, as the chosen hero plays them */
export function controlsScreen(context: MenuContext): MenuView {
  const coarse = matchMedia("(any-pointer: coarse)").matches;
  const keyboard = !coarse || matchMedia("(any-pointer: fine)").matches;
  const adventure = context === "title" || isAdventure() || inRoom();
  const scroll = document.createElement("div");
  scroll.className = "menu-scroll";
  if (coarse) scroll.append(section("Touch", touchLegend(adventure)));
  if (keyboard) scroll.append(section("Keyboard", keyboardRows(adventure)));
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
