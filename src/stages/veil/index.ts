import type { StageDef } from "../../types/campaign";
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
  ground: "golem",
  flyer: "sprite",
  boss: "warden",
  grantsArt: "riftlance",
  weakTo: "gloamlantern",
  areas: AREAS,
  hazard: createVeilHazard(AREAS),
};
