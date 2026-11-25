import type { StageDef } from "../../types/campaign";
import { sunlit } from "./layout";

export const prologue: StageDef = {
  id: "prologue",
  name: "Sunlit Ruins",
  mapBlurb: "Where the first rift opened.",
  kind: "prologue",
  era: "day",
  ground: "thornback",
  flyer: "moth",
  boss: "oakheart",
  areas: [sunlit],
};
