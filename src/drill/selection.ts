import { isAdventure } from "../game/adventure";
import { heroJob } from "../game/hero/job";
import { character } from "../game/state";
import { isTraining } from "../game/training";
import { heroModule } from "../heroes/registry";
import { roomView } from "../store/coop";
import type { DrillProfile } from "../types/drill";

export const heroDrill = (): DrillProfile | undefined =>
  heroJob() === null ? heroModule(character.id).drill : undefined;

const roomPlaying = (): boolean => roomView().phase === "playing";

export const drillProfile = (): DrillProfile | undefined =>
  isAdventure() || isTraining() || roomPlaying() ? heroDrill() : undefined;

export const usesDrill = (): boolean => drillProfile() !== undefined;
