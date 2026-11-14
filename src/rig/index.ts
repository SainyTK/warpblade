/**
 * The shared hero rig: pure drawing of a hero from a pose and a skin, with no game state. A hero's look
 * (`HeroSkin`, src/types/character.ts) fills it from its own folder: head rows, the sword, an off-hand item, its own
 * versions of the shared parts and extra pieces. The shared parts and the helpers a hero's drawing needs are here.
 */
export { armReach, drawArm } from "./arm";
export { type Along, drawFitting, heldAxis } from "./blade";
export { drawCoatTails } from "./coatTails";
export { drawHero, type HeroLook } from "./drawHero";
export { drawHead } from "./head";
export { drawLeg, legReach, toePoint } from "./leg";
export { reach } from "./reach";
export { drawTorso } from "./torso";
export { drawTrails } from "./trails";
