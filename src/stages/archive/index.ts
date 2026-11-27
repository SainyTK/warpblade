import type { StageDef } from "../../types/campaign";
import { rung } from "../geometry";
import { inkTides } from "./hazard";
import { readingHalls, sunkenRotunda, theStacks } from "./layout";

export const archive: StageDef = {
  id: "archive",
  name: "Drowned Archive",
  mapBlurb: "Every book here was written in ink that moves.",
  kind: "rift",
  era: "archive",
  ladder: [...rung(2, "inkling"), ...rung(2, "pagewing"), ...rung(3, "tomeguard")],
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
