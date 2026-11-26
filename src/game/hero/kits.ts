import { heroModule } from "../../heroes/registry";
import type { HeroModule } from "../../types/heroModule";
import type { HeroKit } from "../../types/kit";
import type { MoveDef } from "../../types/move";
import { character, shown } from "../state";

/** the code of the hero being played; looked up on each call so module load order never matters */
export const heroCode = (): HeroModule => heroModule(character.id);

/** the kit of the hero being played */
export const kit = (): HeroKit => heroCode().kit;

/** the kit of the hero drawn on the stage, which in the menus can be one only looked at on the hero screen */
export const shownKit = (): HeroKit => heroModule(shown.id).kit;

/** one of the combo moves of the hero being played, by its id */
export const moveDef = (id: string): MoveDef => heroCode().moves[id];
