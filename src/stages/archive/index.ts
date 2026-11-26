import type { StageDef } from "../../types/campaign";
import { inkTides } from "./hazard";
import { readingHalls, sunkenRotunda, theStacks } from "./layout";

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
  areas: [readingHalls, theStacks, sunkenRotunda],
  hazard: inkTides,
};
