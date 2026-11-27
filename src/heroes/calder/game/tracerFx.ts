import { calderFx } from "./skillFx";

const ID = "ca_tracer";
const TWIN_GAP = 7;
const ARRIVAL_CLEAR = 10;

export function tracerFx(x0: number, y0: number, x1: number, y1: number, damage: number): void {
  const face = Math.sign(x1 - x0) || 1;
  const cast = calderFx(ID, "trail", { x: x0, y: y0, face, toX: x1 - face * ARRIVAL_CLEAR, toY: y1 }, { damage });
  const rank = cast.feel.rank;
  const origin = { x: x0, y: y0, face };
  if (rank >= 1) {
    calderFx(ID, "mark", { ...origin, reach: 8 }, { damage, quiet: true });
  }
  if (rank >= 2) {
    calderFx(ID, "burst", { ...origin, reach: 6 }, { damage, quiet: true, delay: 0.05 });
  }
  if (rank >= 3) {
    const twin = { x: x0, y: y0 - TWIN_GAP, face, toX: x1 - face * ARRIVAL_CLEAR, toY: y1 - TWIN_GAP };
    calderFx(ID, "trail", twin, { damage, quiet: true, delay: 0.04 });
    calderFx(ID, "bolt", { ...origin, reach: 50 }, { damage, quiet: true, delay: 0.08 });
  }
}
