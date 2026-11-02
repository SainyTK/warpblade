/** the start menu before a run, or the pause menu during one */
export type MenuContext = "title" | "pause";
export type MenuScreen = "main" | "controls" | "options";

/** what a menu screen shows: a heading, a line under it and its body */
export interface MenuView {
  title: string;
  subtitle: string;
  content: HTMLElement;
}
