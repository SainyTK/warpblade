import type { Page } from "playwright-core";
import { CAPTURE_FPS, OUTPUT_WIDTH } from "../constants/capture";
import { ensureDirFor, makeTempDir, removeDir } from "../services/files";
import { readStageBox } from "../services/pageStageBox";
import type { RecordOptions, RecordResult } from "../types/session";
import { evenHeight } from "../utils/rect";
import { encodeGif, encodeMp4, encodePoster } from "./encodeClip";
import { createFrameGrabber, type FrameGrabber } from "./frameGrabber";

/** the session's clock hands each stretch of game time to the grabber while a recording runs */
export type GrabberSlot = { current: FrameGrabber | null };

/**
 * Record the stage and HUD while play runs. Frames are taken by game time, so the clip plays at the speed of the game
 * whatever the machine's speed, and it starts on the first frame of play: nothing from loading gets in.
 */
export async function record(
  page: Page,
  slot: GrabberSlot,
  basePath: string,
  play: () => Promise<void>,
  options: RecordOptions = {},
): Promise<RecordResult> {
  if (slot.current) {
    throw new Error("A recording is already running in this session.");
  }
  const box = await readStageBox(page);
  const dir = await makeTempDir("playtest-frames-");
  try {
    slot.current = await createFrameGrabber(page, box, dir, CAPTURE_FPS);
    await play();
    const grabber = slot.current;
    slot.current = null;
    if (grabber.count() < 2) {
      throw new Error("The recording let no game time pass. Use press, hold, advance or waitFor inside it.");
    }
    const width = options.width ?? OUTPUT_WIDTH;
    const clip = { dir, fps: CAPTURE_FPS, frames: grabber.count(), width, height: evenHeight(box, width) };
    const paths = { mp4: `${basePath}.mp4`, gif: `${basePath}.gif`, poster: `${basePath}.png` };
    await ensureDirFor(paths.mp4);
    const bytes = {
      mp4: await encodeMp4(clip, paths.mp4),
      gif: await encodeGif(clip, paths.gif),
      poster: await encodePoster(clip, paths.poster),
    };
    return { ...paths, width: clip.width, height: clip.height, seconds: grabber.seconds(), bytes };
  } finally {
    slot.current = null;
    await removeDir(dir);
  }
}
