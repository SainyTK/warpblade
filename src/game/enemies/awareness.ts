import type { Enemy } from "../../types/enemy";

/**
 * The shared foe awareness rule: a foe is blind while its `blind` status runs, and a foe that cannot see the hero
 * neither turns toward them nor starts a wind-up at them. Anything that blinds a foe sets `blind` and reuses this.
 */
export const foeSees = (e: Enemy): boolean => e.blind <= 0;
