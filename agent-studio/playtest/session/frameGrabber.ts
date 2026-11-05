import { join } from "node:path";
import type { Page } from "playwright-core";
import type { Rect } from "../utils/rect";

/** Grabs a PNG of the stage each time a frame of the clip is due, by game time. */
export interface FrameGrabber {
  /** game ms until the next frame is due */
  untilNext(): number;
  /** game time moved on by this much; grab a frame if one is due */
  passed(ms: number): Promise<void>;
  count(): number;
  seconds(): number;
}

export const framePattern = (dir: string): string => join(dir, "f%05d.png");
export const framePath = (dir: string, index: number): string => join(dir, `f${String(index).padStart(5, "0")}.png`);

export async function createFrameGrabber(page: Page, box: Rect, dir: string, fps: number): Promise<FrameGrabber> {
  let frames = 0;
  let at = 0;
  const due = (index: number): number => Math.round((index * 1000) / fps);
  const grab = async (): Promise<void> => {
    await page.screenshot({ path: framePath(dir, frames), clip: box, type: "png" });
    frames += 1;
  };
  await grab();
  return {
    untilNext: () => Math.max(1, due(frames) - at),
    async passed(ms) {
      at += ms;
      if (at >= due(frames)) {
        await grab();
      }
    },
    count: () => frames,
    seconds: () => frames / fps,
  };
}
