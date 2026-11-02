import type { Insets, StageLayout } from "../types/layout";

/**
 * The largest whole number of device pixels per art pixel that fits the safe area, the stage centered in it,
 * and a backdrop of whole art pixels on the same grid that reaches every edge of the screen.
 */
export function stageLayout(
  art: { w: number; h: number },
  view: { w: number; h: number },
  safe: Insets,
  dpr: number,
): StageLayout {
  const screenW = Math.round(view.w * dpr);
  const screenH = Math.round(view.h * dpr);
  const left = Math.round(safe.left * dpr);
  const top = Math.round(safe.top * dpr);
  const availW = screenW - left - Math.round(safe.right * dpr);
  const availH = screenH - top - Math.round(safe.bottom * dpr);
  const scale = Math.max(1, Math.floor(Math.min(availW / art.w, availH / art.h)));
  const stageX = left + Math.floor((availW - scale * art.w) / 2);
  const stageY = top + Math.floor((availH - scale * art.h) / 2);
  const artLeft = Math.max(0, Math.ceil(stageX / scale));
  const artTop = Math.max(0, Math.ceil(stageY / scale));
  const artRight = Math.max(0, Math.ceil((screenW - stageX - scale * art.w) / scale));
  const artBottom = Math.max(0, Math.ceil((screenH - stageY - scale * art.h) / scale));
  return {
    scale,
    stageX,
    stageY,
    cols: artLeft + art.w + artRight,
    rows: artTop + art.h + artBottom,
    artLeft,
    artTop,
    backdropX: stageX - artLeft * scale,
    backdropY: stageY - artTop * scale,
  };
}
