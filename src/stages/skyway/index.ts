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
  mini: {
    name: "Storm Captain",
    epithet: "Keeper of the High Bridge",
    base: "skyguard",
    light: 0xffe066,
    power: 1,
    moves: ["pillars", "call"],
    adds: ["galehawk", "sparkjelly"],
  },
  twist: { name: "Storm Front", text: "Foes move and strike faster.", foePace: 1.15 },
  grantsArt: "galecall",
  weakTo: "rimefang",
  areas: [brokenBridges, floatingIslands, roost],
  hazard: skywayHazard,
};
