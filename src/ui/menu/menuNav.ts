import type { MenuCommand } from "../../types/input";

/** Moving through a menu screen: the entries marked data-nav, in document order. */
const adjusters = new WeakMap<HTMLElement, (step: -1 | 1) => void>();
/** how far Up and Down scroll a screen that has only one entry to move to */
const SCROLL_STEP = 48;

/** left and right change this entry's value */
export function onAdjust(el: HTMLElement, adjust: (step: -1 | 1) => void): void {
  adjusters.set(el, adjust);
}

const entries = (body: HTMLElement): HTMLElement[] => [...body.querySelectorAll<HTMLElement>("[data-nav]")];

export function focusEntry(el: HTMLElement | undefined): void {
  el?.focus({ preventScroll: true });
  el?.scrollIntoView({ block: "nearest" });
}

/** run a menu key; back is the screen's own way out */
export function runMenuCommand(body: HTMLElement, command: MenuCommand, repeat: boolean, back: () => void): void {
  const list = entries(body);
  const here = list.indexOf(document.activeElement as HTMLElement);
  const current = list[here];
  if (command === "up" || command === "down") {
    const step = command === "up" ? -1 : 1;
    const scroller = body.querySelector<HTMLElement>(".menu-scroll");
    if (list.length === 1 && scroller) scroller.scrollBy({ top: step * SCROLL_STEP });
    focusEntry(list[here < 0 ? 0 : (here + step + list.length) % list.length]);
    return;
  }
  if (command === "left" || command === "right") {
    if (current) adjusters.get(current)?.(command === "left" ? -1 : 1);
    return;
  }
  if (repeat) return;
  if (command === "select") {
    current?.click();
    return;
  }
  back();
}
