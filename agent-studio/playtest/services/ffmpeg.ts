import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { FFMPEG_PATH } from "../constants/capture";

const run = promisify(execFile);
const MAX_OUTPUT = 16 * 1024 * 1024;

export async function ffmpeg(args: readonly string[]): Promise<void> {
  try {
    await run(FFMPEG_PATH, ["-hide_banner", "-loglevel", "error", "-y", ...args], { maxBuffer: MAX_OUTPUT });
  } catch (error) {
    const stderr = (error as { stderr?: string }).stderr ?? "";
    throw new Error(`ffmpeg failed: ${stderr || String(error)}`);
  }
}
