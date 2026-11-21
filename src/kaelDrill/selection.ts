import { isAdventure } from "../game/adventure";
import { heroJob } from "../game/hero/job";
import { character } from "../game/state";

export const usesKaelDrill = (): boolean => isAdventure() && isBaseKael();
export const isBaseKael = (): boolean => character.id === "kael" && heroJob() === null;
