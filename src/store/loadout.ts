import type { Loadout } from "../types/coop";
import { loadout } from "./meta";
import { openSkills } from "./unlocks";

export const ownLoadout = (): Loadout => ({ items: { ...loadout() }, skills: openSkills() });
