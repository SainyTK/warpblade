export const FFMPEG_PATH = "/opt/homebrew/bin/ffmpeg";
/** frames grabbed per second of game time while recording; the GIF keeps fewer */
export const CAPTURE_FPS = 30;
export const OUTPUT_WIDTH = 640;
export const GIF_FPS = 15;
/** GIFs over this are made again with fewer frames and colors */
export const GIF_MAX_BYTES = 4 * 1024 * 1024;
/** fewer frames and colors to try, in order, until the GIF fits */
export const GIF_FALLBACKS = [
  { fps: GIF_FPS, colors: 256 },
  { fps: 12, colors: 128 },
  { fps: 12, colors: 64 },
] as const;
/** MP4 budget: this many bytes for every 8 seconds of clip */
export const MP4_BYTES_PER_8S = 1.2 * 1024 * 1024;
/** H.264 quality steps to try, best first, until the MP4 fits its budget */
export const MP4_CRF_STEPS = [20, 24, 28, 32] as const;
/** the poster is the frame this far into the clip */
export const POSTER_AT_SECONDS = 0.5;
