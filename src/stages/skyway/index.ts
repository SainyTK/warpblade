import type { StageDef } from "../../types/campaign";
import { skywayApproach, skywaySummit } from "./layout";

export const skyway: StageDef = {
  id: "skyway",
  name: "Thunderhead Skyway",
  mapBlurb: "Bridges of stone above the storm.",
  kind: "rift",
  era: "skyway",
  ground: "skyguard",
  flyer: "galehawk",
  boss: "tempestroc",
  grantsArt: "galecall",
  weakTo: "rimefang",
  areas: [skywayApproach, skywaySummit],
};
