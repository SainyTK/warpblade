import type { MenuContext, MenuScreen } from "../../types/menu";

/** The one owner of the menu: whether it is open, as the start or the pause menu, and which screen it shows. */
const state: { context: MenuContext | null; screen: MenuScreen } = { context: null, screen: "main" };
const listeners = new Set<() => void>();

const changed = (): void => {
  for (const listener of listeners) listener();
};

export const menuContext = (): MenuContext | null => state.context;
export const menuScreen = (): MenuScreen => state.screen;
export const isMenuOpen = (): boolean => state.context !== null;

export function openMenu(context: MenuContext): void {
  state.context = context;
  state.screen = "main";
  changed();
}
export function showScreen(screen: MenuScreen): void {
  state.screen = screen;
  changed();
}
export function closeMenu(): void {
  state.context = null;
  changed();
}
export function onMenuChange(listener: () => void): void {
  listeners.add(listener);
}
