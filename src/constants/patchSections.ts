import type { PatchKind, PatchSectionId, PatchTag } from "../types/patch";

export interface PatchSectionInfo {
  id: PatchSectionId;
  title: string;
  /** the colour token that marks the section */
  accent: string;
}

/** the sections of a patch, in the order the page shows them */
export const PATCH_SECTIONS: readonly PatchSectionInfo[] = [
  { id: "heroes", title: "Heroes", accent: "--crystal" },
  { id: "foes", title: "Foes and bosses", accent: "--hp" },
  { id: "stages", title: "Stages", accent: "--volt" },
  { id: "systems", title: "Systems", accent: "--ice" },
  { id: "items", title: "Shop and boons", accent: "--brass" },
  { id: "art", title: "Art and effects", accent: "--fire" },
  { id: "bugfixes", title: "Bug fixes", accent: "--heal" },
];

/** the label of each tag chip and its colour token */
export const PATCH_TAGS: Record<PatchTag, { label: string; accent: string }> = {
  new: { label: "New", accent: "--crystal" },
  buff: { label: "Buff", accent: "--heal" },
  nerf: { label: "Nerf", accent: "--hp" },
  adjusted: { label: "Adjusted", accent: "--mist" },
  rework: { label: "Rework", accent: "--volt" },
  fix: { label: "Fix", accent: "--mist" },
};

export const PATCH_KIND_LABELS: Record<PatchKind, string> = {
  big: "Big patch",
  small: "Small patch",
};
