import { isTouchMode } from "./touchMode";

const TOUCH_EVENTS = ["touchstart", "touchmove", "touchend", "touchcancel"] as const;
/** Safari's pinch events and the double-tap that zooms on a mashed button */
const PAGE_GESTURES = ["gesturestart", "gesturechange", "gestureend", "dblclick"] as const;

const cancel = (ev: Event): void => {
  if (ev.cancelable) ev.preventDefault();
};

/**
 * iOS and iPadOS Safari run their own long-press gestures (the magnifier, text selection, the callout) even under
 * `touch-action: none` and `user-select: none`. A held button zooms in, and once the gesture is recognised Safari
 * cancels the finger's pointer, so a held stick stops walking. Cancelling the touch events on an element stops those
 * gestures there; its pointer events still arrive.
 */
export function ownTouches(el: HTMLElement): void {
  for (const type of TOUCH_EVENTS) el.addEventListener(type, cancel, { passive: false });
}

/**
 * Page-wide: no pinch or double-tap zoom anywhere, and no long-press menu while playing by touch. Calls `allLifted`
 * when the last finger leaves the screen, so a hold whose pointer end the browser never sent cannot stay stuck.
 */
export function guardPage(allLifted: () => void): void {
  for (const type of PAGE_GESTURES) document.addEventListener(type, cancel, { passive: false });
  document.addEventListener("contextmenu", (ev) => {
    if (isTouchMode()) ev.preventDefault();
  });
  const lifted = (ev: TouchEvent) => {
    if (ev.touches.length === 0) allLifted();
  };
  document.addEventListener("touchend", lifted, { capture: true });
  document.addEventListener("touchcancel", lifted, { capture: true });
}
