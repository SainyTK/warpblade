import type { StageDef } from "../../types/campaign";
import { skywayHazard } from "./hazard";
import { brokenBridges, floatingIslands, roost } from "./layout";

export const skyway: StageDef = {
  id: "skyway",
  name: "Thunderhead Skyway",
  mapBlurb: "Broken bridges above a sea of storm.",
  kind: "rift",
  era: "skyway",
  ground: "skyguard",
  flyer: "galehawk",
  boss: "tempestroc",
  grantsArt: "galecall",
  weakTo: "rimefang",
  areas: [brokenBridges, floatingIslands, roost],
  hazard: skywayHazard,
};
