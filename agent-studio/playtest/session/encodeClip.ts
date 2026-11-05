import { GIF_FALLBACKS, GIF_MAX_BYTES, MP4_BYTES_PER_8S, MP4_CRF_STEPS, POSTER_AT_SECONDS } from "../constants/capture";
import { ffmpeg } from "../services/ffmpeg";
import { fileBytes } from "../services/files";
import { framePath, framePattern } from "./frameGrabber";

export interface Clip {
  dir: string;
  fps: number;
  frames: number;
  width: number;
  height: number;
}

const neighbour = (clip: Clip): string => `scale=${clip.width}:${clip.height}:flags=neighbor`;

/** H.264 High, yuv420p, silent, fast start; lower quality until it fits the budget for its length */
export async function encodeMp4(clip: Clip, out: string): Promise<number> {
  const budget = (MP4_BYTES_PER_8S * clip.frames) / clip.fps / 8;
  let bytes = 0;
  for (const crf of MP4_CRF_STEPS) {
    await ffmpeg(
      [
        ["-framerate", String(clip.fps)],
        ["-i", framePattern(clip.dir)],
        ["-vf", `${neighbour(clip)},format=yuv420p`],
        ["-c:v", "libx264", "-profile:v", "high", "-preset", "slow", "-crf", String(crf)],
        ["-an", "-movflags", "+faststart", out],
      ].flat(),
    );
    bytes = await fileBytes(out);
    if (bytes <= budget) {
      break;
    }
  }
  return bytes;
}

/** a palette made for the clip and no dithering, so pixel art stays flat; fewer frames and colors until it fits */
export async function encodeGif(clip: Clip, out: string): Promise<number> {
  let bytes = 0;
  for (const step of GIF_FALLBACKS) {
    const palette = `split[a][b];[a]palettegen=max_colors=${step.colors}:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle`;
    await ffmpeg(
      [
        ["-framerate", String(clip.fps)],
        ["-i", framePattern(clip.dir)],
        ["-vf", `fps=${step.fps},${neighbour(clip)},${palette}`],
        ["-loop", "0", out],
      ].flat(),
    );
    bytes = await fileBytes(out);
    if (bytes <= GIF_MAX_BYTES) {
      break;
    }
  }
  return bytes;
}

/** a frame from early in the clip, at the clip's size */
export async function encodePoster(clip: Clip, out: string): Promise<number> {
  const index = Math.min(clip.frames - 1, Math.round(POSTER_AT_SECONDS * clip.fps));
  await ffmpeg(["-i", framePath(clip.dir, index), "-vf", neighbour(clip), "-frames:v", "1", out]);
  return fileBytes(out);
}
