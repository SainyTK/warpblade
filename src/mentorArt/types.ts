import type { FoeArtClip, FoeArtSheet } from "../foeArt";
import type { SpriteImage } from "../types/sprite";

export type MentorPose = "idle" | "talk";

export interface MentorArtSheet extends FoeArtSheet {
  clips: Readonly<Record<MentorPose, FoeArtClip>>;
  crystals: Readonly<Record<MentorPose, readonly [x: number, y: number]>>;
}

export interface MentorFrame {
  image: SpriteImage;
  crystalX: number;
  crystalY: number;
}
