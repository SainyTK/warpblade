import { decodeSheet } from "../foeArt";
import type { SpriteImage } from "../types/sprite";
import atlasUrl from "./assets/atlas.webp?url";
import portraitUrl from "./assets/portrait.webp?url";
import sheetJson from "./assets/sheet.json";
import type { MentorArtSheet, MentorFrame, MentorPose } from "./types";

export type { MentorFrame, MentorPose } from "./types";

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

export const mentorArtHeight = (): number | null => {
  const image = frames[0];
  return image ? image.oy / image.res : null;
};

export const mentorPortraitUrl = (): string | null => (frames.length ? portraitUrl : null);

export function mentorFrame(pose: MentorPose, age: number): MentorFrame | null {
  const clip = sheet.clips[pose];
  const step = Math.floor(Math.max(0, age) * clip.fps);
  const image = frames[clip.frames[step % clip.frames.length]];
  if (!image) return null;
  const [x, y] = sheet.crystals[pose];
  return { image, crystalX: x / image.res, crystalY: y / image.res };
}
