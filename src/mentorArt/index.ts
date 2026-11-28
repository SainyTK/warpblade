import { decodeSheet } from "../foeArt";
import type { SpriteImage } from "../types/sprite";
import atlasUrl from "./assets/atlas.webp?url";
import portraitUrl from "./assets/portrait.webp?url";
import sheetJson from "./assets/sheet.json";
import type { MentorArtSheet } from "./types";

const sheet = sheetJson as unknown as MentorArtSheet;
let frames: SpriteImage[] = [];

const disabled = (): boolean => new URLSearchParams(location.search).get("mentorart") === "off";

export async function preloadMentorArt(): Promise<void> {
  if (disabled()) return;
  try {
    frames = await decodeSheet(atlasUrl, sheet);
  } catch {
    frames = [];
  }
}

export const mentorPortraitUrl = (): string | null => (frames.length ? portraitUrl : null);
