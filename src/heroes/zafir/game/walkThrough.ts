import { HERO_MOVE } from "../../../constants/combat";
import { isHeld } from "../../../game/input";
import { skillValues } from "../../../game/skills/query";
import { hero, progress } from "../../../game/state";
import { WALK_THROUGH } from "../constants/string";

/** his share of the walk while he spins: the base share, or Dune Walk's */
export const walkShare = (): number => skillValues("za_dune").walk ?? WALK_THROUGH;

/** the side the player holds: -1, 1 or 0 */
export const heldSide = (): number => (isHeld("right") ? 1 : 0) - (isHeld("left") ? 1 : 0);

/**
 * Zafir keeps walking while he spins: the walk held moves him either way at a share of his walk speed, and he keeps
 * facing where he faced. With nothing held he stays planted.
 */
export function walkThrough(): void {
  hero.vx = heldSide() * HERO_MOVE.walkSpeed * progress.stats.move * walkShare();
}
