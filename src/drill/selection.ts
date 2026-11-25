import { isAdventure } from "../game/adventure";
import { heroJob } from "../game/hero/job";
import { character } from "../game/state";
import { isTraining } from "../game/training";
import { heroModule } from "../heroes/registry";
import type { DrillProfile } from "../types/drill";

export const heroDrill = (): DrillProfile | undefined =>
  heroJob() === null ? heroModule(character.id).drill : undefined;

export const drillProfile = (): DrillProfile | undefined => (isAdventure() || isTraining() ? heroDrill() : undefined);

export const usesDrill = (): boolean => drillProfile() !== undefined;
