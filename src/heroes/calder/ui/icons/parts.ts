import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import { hex, WHITE } from "../../../../utils/color";
import { PHOSPHOR } from "../../constants/colors";

/** the icon colours of Calder's sword and rounds: gunmetal, steel, brass and leather */
export const ICON = {
  blade: hex("#bcc6c6"),
  edge: hex("#f6fff2"),
  gun: hex("#686f74"),
  gunDark: hex("#2a2f33"),
  brass: hex("#c99a3c"),
  brassLight: hex("#ffe49a"),
  grip: hex("#563a26"),
  green: PHOSPHOR[4],
  greenDark: PHOSPHOR[2],
  hot: hex("#ffe066"),
} as const;

type S = SpriteCanvas;

function layer(s: S, draw: () => void): void {
  s.begin();
  draw();
  s.commit();
}

/** the chamber sword from the grip at (x0, y0) to the point at (x1, y1): a cylinder at the guard with a green hub */
export function gunSword(s: S, x0: number, y0: number, x1: number, y1: number): void {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const ux = (x1 - x0) / L;
  const uy = (y1 - y0) / L;
  layer(s, () => {
    s.stroke(x0 - ux * 3, y0 - uy * 3, x0, y0, 0.6, ICON.grip);
    s.stroke(x0 + ux * 3, y0 + uy * 3, x1, y1, 0.9, ICON.blade);
    s.stroke(x0 + ux * 4 + uy * 0.5, y0 + uy * 4 - ux * 0.5, x1 - ux, y1 - uy, 0.3, ICON.edge);
    s.set(x1, y1, WHITE);
  });
  layer(s, () => {
    s.dot(x0 + ux * 1.5, y0 + uy * 1.5, 1.6, ICON.gun);
    s.set(x0 + ux * 1.5, y0 + uy * 1.5, ICON.green);
  });
}

/** a brass round standing at (x, y), its point up */
export function round(s: S, x: number, y: number, c: Color = ICON.brass): void {
  layer(s, () => {
    s.block(x - 0.5, y - 1, c, 2, 3);
    s.set(x, y - 2, ICON.brassLight);
    s.set(x + 0.5, y - 2, ICON.brassLight);
  });
}

/** a round's blast at (x, y): a white heart in green, with rays */
export function blast(s: S, x: number, y: number, r: number, c: Color = ICON.green): void {
  layer(s, () => {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      s.stroke(x + Math.cos(a) * r * 0.5, y + Math.sin(a) * r * 0.5, x + Math.cos(a) * r, y + Math.sin(a) * r, 0.35, c);
    }
    s.dot(x, y, r * 0.45, c);
    s.dot(x, y, r * 0.22, WHITE);
  });
}

/** a green tracer line from (x0, y0) to (x1, y1) with a white head */
export function tracer(s: S, x0: number, y0: number, x1: number, y1: number): void {
  layer(s, () => {
    s.stroke(x0, y0, x1, y1, 0.4, ICON.greenDark);
    s.stroke((x0 + x1) / 2, (y0 + y1) / 2, x1, y1, 0.45, ICON.green);
    s.set(x1, y1, WHITE);
  });
}
