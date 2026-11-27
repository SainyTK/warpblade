import type { Loadout } from "../types/coop";
import { loadout } from "./meta";
import { foundArts, foundTools, openSkills } from "./unlocks";

export const ownLoadout = (): Loadout => ({
  items: { ...loadout() },
  skills: openSkills(),
  arts: foundArts(),
  tools: foundTools(),
});
