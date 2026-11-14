import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import { ICON } from "./palette";

type S = SpriteCanvas;

function layer(s: S, draw: () => void, inner = true): void {
  s.begin();
  draw();
  s.commit(inner);
}

/** the katana from the end of its grip at (x0, y0) to its point at (x1, y1), with a slight curve back */
export function katana(s: S, x0: number, y0: number, x1: number, y1: number): void {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const ux = (x1 - x0) / L;
  const uy = (y1 - y0) / L;
  const gx = x0 + ux * 3.5;
  const gy = y0 + uy * 3.5;
  layer(s, () => s.stroke(x0, y0, gx, gy, 0.6, ICON.wrap));
  layer(s, () => {
    const n = 8;
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      const bend = -1.2 * u * u;
      const x = gx + (x1 - gx) * u - uy * bend;
      const y = gy + (y1 - gy) * u + ux * bend;
      s.dot(x, y, u > 0.92 ? 0.45 : 0.7, ICON.steel);
    }
  });
  layer(
    s,
    () => {
      for (let i = 1; i < 8; i++) {
        const u = i / 8;
        const bend = -1.2 * u * u;
        s.set(gx + (x1 - gx) * u - uy * (bend + 0.6), gy + (y1 - gy) * u + ux * (bend + 0.6), ICON.edge);
      }
    },
    false,
  );
  layer(s, () => {
    s.dot(gx, gy, 1.1, ICON.guard);
    s.set(gx, gy, ICON.moon);
  });
}

/** the lacquer scabbard from (x0, y0) to (x1, y1) */
export function scabbard(s: S, x0: number, y0: number, x1: number, y1: number): void {
  layer(s, () => s.stroke(x0, y0, x1, y1, 0.85, ICON.lacquer));
  layer(s, () => s.hairline(x0, y0 - 0.6, x1, y1 - 0.6, ICON.lacquerLight), false);
}

/** a brush stroke of ink with a white edge on top, from (x0, y0) to (x1, y1), thickest in its middle */
export function inkStroke(s: S, x0: number, y0: number, x1: number, y1: number, width = 1.4): void {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const nx = -(y1 - y0) / L;
  const ny = (x1 - x0) / L;
  layer(s, () => {
    const n = Math.ceil(L * 2);
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      s.dot(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, Math.max(0.35, width * Math.sin(Math.PI * u)), ICON.ink);
    }
  });
  layer(
    s,
    () =>
      s.hairline(
        x0 + nx * (width + 0.4),
        y0 + ny * (width + 0.4),
        x1 + nx * (width + 0.4),
        y1 + ny * (width + 0.4),
        ICON.edge,
      ),
    false,
  );
}

/** a foe's round body with a rim */
export function foe(s: S, cx: number, cy: number, r: number): void {
  layer(s, () => {
    s.dot(cx, cy, r, ICON.foe);
    s.shadeEdges(ICON.foe, ICON.foeRim, ICON.ink);
  });
}

/** a small four-point glint */
export function glint(s: S, cx: number, cy: number, r: number, c: Color = ICON.edge): void {
  layer(
    s,
    () => {
      s.stroke(cx - r, cy, cx + r, cy, 0.35, c);
      s.stroke(cx, cy - r, cx, cy + r, 0.35, c);
    },
    false,
  );
}

/** a ring of radius r */
export function ring(s: S, cx: number, cy: number, r: number, c: Color, w = 0.5): void {
  layer(s, () => {
    const n = Math.ceil(r * 8);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      s.dot(cx + Math.cos(a) * r, cy + Math.sin(a) * r, w, c);
    }
  });
}

/** a crescent moon: a disc with a bite out of it */
export function moon(s: S, cx: number, cy: number, r: number, c: Color = ICON.moon): void {
  layer(s, () => {
    for (let y = -r; y <= r; y += 0.5)
      for (let x = -r; x <= r; x += 0.5) {
        if (x * x + y * y > r * r) continue;
        if ((x - r * 0.55) ** 2 + (y + r * 0.2) ** 2 < (r * 0.85) ** 2) continue;
        s.set(cx + x, cy + y, c);
      }
  });
}
