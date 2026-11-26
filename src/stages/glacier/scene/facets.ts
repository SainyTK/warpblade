import { grain } from "../../../utils/grain";

export interface Facet {
  tone: number;
  edge: number;
  lit: boolean;
}

const out: Facet = { tone: 0, edge: 1, lit: false };

export function facetAt(x: number, y: number, cell: number, period = 0): Facet {
  const gx = Math.floor(x / cell);
  const gy = Math.floor(y / cell);
  let best = Number.POSITIVE_INFINITY;
  let second = Number.POSITIVE_INFINITY;
  let id = 0;
  let bx = 0;
  let by = 0;
  for (let j = -1; j <= 1; j++)
    for (let i = -1; i <= 1; i++) {
      const cx = gx + i;
      const cy = gy + j;
      const wrapped = period > 0 ? ((cx % period) + period) % period : cx;
      const px = (cx + 0.15 + grain(wrapped, cy) * 0.7) * cell;
      const py = (cy + 0.15 + grain(cy + 31, wrapped) * 0.7) * cell;
      const d = Math.hypot(x - px, y - py);
      if (d < best) {
        second = best;
        best = d;
        id = wrapped * 57 + cy * 13;
        bx = px;
        by = py;
      } else if (d < second) second = d;
    }
  out.tone = grain(id, 4.7) + ((x - bx) * 0.6 - (y - by) * 0.8) / cell;
  out.edge = second - best;
  out.lit = x - bx > by - y;
  return out;
}
