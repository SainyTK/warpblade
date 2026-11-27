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
  mini: {
    name: "Grand Tomeguard",
    epithet: "Keeper of the Sealed Stacks",
    base: "tomeguard",
    light: 0x7ab0ff,
    power: 1,
    moves: ["spikes", "pillars"],
    adds: ["inkling", "pagewing"],
  },
  twist: { name: "Gilded Pages", text: "Elites come twice as often.", eliteEvery: 9 },
  grantsArt: "inkwave",
  weakTo: "galecall",
  areas: [readingHalls, theStacks, sunkenRotunda],
  hazard: inkTides,
};
