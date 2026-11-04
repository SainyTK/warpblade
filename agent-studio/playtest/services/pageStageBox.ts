import type { Page } from "playwright-core";
import { SELECTORS } from "../constants/game";
import { type Rect, unionRect } from "../utils/rect";

/** the stage with its HUD and boss bar, which sit outside the stage when the window has room above it */
export async function readStageBox(page: Page): Promise<Rect> {
  const rects = await page.evaluate(
    (selectors) =>
      selectors
        .map((selector) => document.querySelector(selector))
        .filter((el): el is HTMLElement => el instanceof HTMLElement && !el.hidden)
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height };
        }),
    [SELECTORS.stage, SELECTORS.hud, SELECTORS.boss],
  );
  return unionRect(rects);
}
