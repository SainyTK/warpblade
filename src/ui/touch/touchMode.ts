/**
 * Whether the player is on a touch screen right now: true on coarse pointers and after any touch,
 * false again after a key press, so keyboard play hides the controller.
 */
let touching = matchMedia("(pointer: coarse)").matches;

export const isTouchMode = (): boolean => touching;

export function watchTouchMode(): void {
  addEventListener(
    "pointerdown",
    (ev) => {
      if (ev.pointerType === "touch") touching = true;
    },
    { capture: true },
  );
  addEventListener("keydown", () => {
    touching = false;
  });
}
