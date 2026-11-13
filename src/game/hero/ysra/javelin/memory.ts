import { objectMemory, rememberPerSeat } from "../../../seatMemory";

/** where she stood when she hurled the glaive, for the line she warps along */
export const javelin = { x0: 0, y0: 0 };
rememberPerSeat(objectMemory(javelin));

export function resetJavelin(): void {
  javelin.x0 = 0;
  javelin.y0 = 0;
}
