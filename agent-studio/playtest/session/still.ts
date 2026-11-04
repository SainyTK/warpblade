import type { Page } from "playwright-core";
import { ensureDirFor } from "../services/files";
import { readStageBox } from "../services/pageStageBox";
import type { StillResult } from "../types/session";

/** a PNG of the stage and HUD at the page's own size: the stage scales by whole numbers, so every art pixel is a crisp square */
export async function still(page: Page, path: string): Promise<StillResult> {
  const box = await readStageBox(page);
  await ensureDirFor(path);
  await page.screenshot({ path, clip: box, type: "png" });
  return { path, width: box.width, height: box.height };
}
