import { menuItem } from "./menuItem";
import { showScreen } from "./menuState";

/** the way back to the main menu screen, at the foot of the other screens */
export function backItem(): HTMLButtonElement {
  const item = menuItem("Back", () => showScreen("main"));
  item.classList.add("menu-back");
  return item;
}
