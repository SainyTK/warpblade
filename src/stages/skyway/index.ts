import type { StageDef } from "../../types/campaign";
import { rung } from "../geometry";
import { skywayHazard } from "./hazard";
import { brokenBridges, floatingIslands, roost } from "./layout";

export const skyway: StageDef = {
  id: "skyway",
  name: "Thunderhead Skyway",
  mapBlurb: "Broken bridges above a sea of storm.",
  era: "skyway",
  ladder: [
    ...rung(1, "nimbit", "squallfinch"),
    ...rung(2, "skyguard", "galehawk"),
    ...rung(3, "sparkjelly"),
    ...rung(4, "galeram"),
    ...rung(5, "zephyray"),
    ...rung(6, "lanternwarden"),
    ...rung(7, "cloudwyrm"),
    ...rung(8, "stormcolossus"),
  ],
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
