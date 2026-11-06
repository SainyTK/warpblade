/** the start menu before a run, or the pause menu during one */
export type MenuContext = "title" | "pause";
export type MenuScreen = "main" | "controls" | "options" | "shop" | "result" | "hero" | "coop";

/** what a menu screen shows: a heading, a line under it and its body */
export interface MenuView {
  title: string;
  /** a line of text, or an element such as an amount of coins */
  subtitle: string | HTMLElement;
  content: HTMLElement;
  /** the entry that takes focus when the screen opens, if not the first */
  focus?: HTMLElement;
  /** what the screen is showing, such as a lobby with others in it; a redraw that changes it focuses as a new screen */
  state?: string;
}
