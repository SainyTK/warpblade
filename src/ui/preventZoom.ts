/**
 * Keep the page still on phones and tablets: no pinch or double-tap zoom, no long-press menu, callout or selection.
 * The CSS in styles.css does most of it; these listeners cover what iOS Safari ignores there,
 * such as user-scalable=no in the viewport meta and pinches that start on a scrollable list.
 */
export function preventZoom(): void {
  const block = (ev: Event) => ev.preventDefault();
  const active = { passive: false };
  // iOS Safari's own pinch events
  for (const type of ["gesturestart", "gesturechange", "gestureend"]) document.addEventListener(type, block, active);
  document.addEventListener("dblclick", block, active);
  document.addEventListener("contextmenu", block);
  document.addEventListener("selectstart", block);
  document.addEventListener("dragstart", block);
  // a second finger on the page would pinch; one finger still scrolls the Controls list and taps buttons
  document.addEventListener(
    "touchmove",
    (ev) => {
      if (ev.touches.length > 1) ev.preventDefault();
    },
    active,
  );
}
