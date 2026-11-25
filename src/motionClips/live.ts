/** Sent by the dev server when a hero's motion clip file changes, in place of a page reload. */
export const CLIP_CHANGED = "warpblade:clip-changed";

/** Sent by the dev server when a studio draft is saved, and in answer to DRAFTS_WANTED. */
export const DRAFT_CHANGED = "warpblade:draft-changed";

/** Sent by a page to get the current studio drafts of a hero's clips it names. */
export const DRAFTS_WANTED = "warpblade:drafts-wanted";

export interface ClipChange {
  hero: string;
  clip: string;
  /** The file's JSON, to read with parseClip. */
  data: unknown;
}

export interface DraftsWanted {
  hero: string;
  clips: string[];
}

export const EVERY_DRAFT = "all";
