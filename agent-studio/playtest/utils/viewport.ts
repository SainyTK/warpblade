import type { Viewport } from "../types/session";

/** "1280x720" as a viewport */
export function parseViewport(text: string): Viewport {
  const match = /^(\d+)x(\d+)$/.exec(text);
  if (!match) {
    throw new Error(`A viewport is WIDTHxHEIGHT, such as 1280x720, not "${text}".`);
  }
  return { width: Number(match[1]), height: Number(match[2]) };
}
