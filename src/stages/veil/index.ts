import type { StageDef } from "../../types/campaign";
import { rung } from "../geometry";
import { brokenStair } from "./brokenStair";
import { createVeilHazard } from "./hazard";
import { shardSteps } from "./shardSteps";
import { spires } from "./spires";

const AREAS = [shardSteps, brokenStair, spires] as const;

export const veil: StageDef = {
  id: "veil",
  name: "Veil Spires",
  mapBlurb: "The towers where the rifts are kept.",
  kind: "rift",
  era: "twilight",
  ladder: [
    ...rung(1, "glintmite", "glimmerwing"),
    ...rung(2, "golem", "sprite"),
    ...rung(3, "riftknight"),
    ...rung(4, "shardram"),
    ...rung(5, "auroraray"),
    ...rung(6, "runebinder"),
    ...rung(7, "facetseer"),
    ...rung(8, "spirecolossus"),
  ],
  boss: "warden",
  mini: {
    name: "Rift Marshal",
    epithet: "Sword of the Torn Veil",
    base: "riftknight",
    light: 0xb673e8,
    power: 1,
    moves: ["spikes", "pillars"],
    adds: ["golem", "sprite"],
  },
  twist: { name: "Torn Veil", text: "Elites come three times as often.", eliteEvery: 6 },
  grantsArt: "riftlance",
  weakTo: "gloamlantern",
  areas: AREAS,
  hazard: createVeilHazard(AREAS),
};
