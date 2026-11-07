import type { Pose } from "../../../types/pose";

/** Kael's clip for a free state with Hulda's fists up before her chin, riding with the neck so they move as the body does */
export function carry(p: Pose): Pose {
  return { ...p, fx: p.nx + 5.5, fy: p.ny + 4, fe: 0, bx: p.nx + 3.5, by: p.ny + 3, be: 1 };
}

/** a foe in her hands while she walks: the stride's legs and body, her arms out low at the foe */
export function holding(p: Pose): Pose {
  return { ...p, fx: p.nx + 8.5, fy: p.ny + 5, fe: 0, bx: p.nx + 7.5, by: p.ny + 4, be: 0 };
}
