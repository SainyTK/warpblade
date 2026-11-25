import type { StageDef } from "../../types/campaign";
import { archiveApproach, archiveSummit } from "./layout";

export const archive: StageDef = {
  id: "archive",
  name: "Drowned Archive",
  mapBlurb: "Every book here was written in ink that moves.",
  kind: "rift",
  era: "archive",
  ground: "inkling",
  flyer: "pagewing",
  boss: "pagewyrm",
  grantsArt: "inkwave",
  weakTo: "galecall",
  areas: [archiveApproach, archiveSummit],
};
