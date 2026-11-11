import { frame } from "./hero";

/**
 * A jump from the floor out of a stand or a stride loads this long before the feet leave it: the knees bend, then the
 * hero pushes off. A jump out of a blow's follow-through, out of a dash, off a crystal or in the air leaves at once.
 */
export const JUMP_LOAD = frame(2);

/**
 * The knee bend of a load at its deepest, added to the stand or the stride under way: the hips sink `dip` pixels, the
 * neck `dip + duck`, the chest leans `lean` pixels in and the hands drop `swing` pixels and draw back `draw`.
 */
export const LOAD_BEND = { dip: 3.5, duck: 0.5, lean: 1.5, chest: 1, swing: 2.5, draw: 1 } as const;
