import { isAdventure } from "../../../../game/adventure";
import { character } from "../../../../game/state";

export const isCerise = (): boolean => character.id === "cerise";
export const usesCeriseDrill = (): boolean => isAdventure() && isCerise();
