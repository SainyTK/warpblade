/** Patch notes data. One JSON file per patch in src/content/patches/<version>.json, written by the agent studio.
    The patch notes page and the GitHub release notes both render from this one shape. */

/** big patches add content or rework something; small patches fix and balance */
export type PatchKind = "big" | "small";

/** the sections of a patch, in the order the page shows them */
export type PatchSectionId = "heroes" | "foes" | "stages" | "systems" | "items" | "art" | "bugfixes";

/** how an entry changed, shown as a coloured tag */
export type PatchTag = "new" | "buff" | "nerf" | "adjusted" | "rework" | "fix";

/** a looping clip or a still under public/patches/<version>/, with its size so the page can reserve its box.
    Clips are short silent MP4 loops that play like GIFs; the GitHub release attaches a GIF of each clip. */
export interface PatchMedia {
  kind: "video" | "image";
  /** file name inside public/patches/<version>/ (.mp4 for video, .png for image) */
  file: string;
  /** a PNG first frame shown before a video plays and when motion is reduced */
  poster?: string;
  alt: string;
  width: number;
  height: number;
}

/** one line of an entry: a value that went from before to after, or a plain sentence */
export type PatchChange =
  | { kind: "stat"; label: string; before: string; after: string }
  | { kind: "note"; text: string };

/** one hero, foe, stage, system, item or bug, with why it changed and what changed */
export interface PatchEntry {
  name: string;
  tag: PatchTag;
  /** one sentence a player reads first: what this means for them */
  summary: string;
  /** the studio's reason, one to three sentences */
  context: string;
  changes: PatchChange[];
  media?: PatchMedia;
  /** feedback IDs this entry answers */
  feedback?: number[];
}

export interface PatchSection {
  id: PatchSectionId;
  entries: PatchEntry[];
}

/** a headline change of a big patch, shown large at the top with its media */
export interface PatchHighlight {
  title: string;
  text: string;
  media: PatchMedia;
}

/** player feedback this patch acted on */
export interface PatchFeedbackItem {
  id: number;
  summary: string;
}

export interface Patch {
  /** semver: big patches raise the minor number, small ones the patch number */
  version: string;
  kind: PatchKind;
  /** release day in Asia/Bangkok, YYYY-MM-DD */
  date: string;
  /** a name for big patches ("Ember and Ash"); small patches use a plain title ("Balance and fixes") */
  title: string;
  /** one or two sentences: the patch in brief */
  tagline: string;
  /** a short letter from the studio: what this patch is about and why */
  intro: string;
  /** big patches have one or more; small patches have none */
  highlights: PatchHighlight[];
  sections: PatchSection[];
  feedback: PatchFeedbackItem[];
}
