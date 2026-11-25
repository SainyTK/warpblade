import type { FusionId } from "../constants/resonance";
import type { HeroJob } from "./job";

export type Discovery =
  | { type: "fusion"; id: FusionId }
  | { type: "recipe"; skill: string }
  | ({ type: "job" } & HeroJob);
