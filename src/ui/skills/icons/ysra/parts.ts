import { EMBER, YSRA_SKIN } from "../../../../constants/characters/ysra/look";
import { ENEMY_COLORS as EC } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import { WHITE } from "../../../../utils/color";
import { fill } from "../parts";

/** Small drawing parts for Ysra's 16 x 16 icons: her glaive, ember flames, foes, the brace and the vault. */
type S = SpriteCanvas;
export const YC = YSRA_SKIN.colors;

/** a line one pixel wide from (x0, y0) to (x1, y1), in pixel coordinates */
export function seg(s: S, x0: number, y0: number, x1: number, y1: number, c: Color): void {
  const n = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))));
  for (let i = 0; i <= n; i++) s.set(Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n), c);
}

/** a glaive from the butt at (x0, y0) to the blade's point at (x1, y1): a thin haft with a bronze butt cap, then a
 *  single-edged blade of forge-fire that swells to one side and sweeps back to a hooked point, as in the game;
 *  flip puts the edge on the other side */
export function glaive(s: S, x0: number, y0: number, x1: number, y1: number, flip = false, blade = 6): void {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const ux = (x1 - x0) / L;
  const uy = (y1 - y0) / L;
  const side = flip ? -1 : 1;
  const nx = -uy * side;
  const ny = ux * side;
  const bx = x1 - ux * blade;
  const by = y1 - uy * blade;
  fill(s, () => {
    seg(s, x0, y0, bx, by, YC.bootLight);
    s.set(Math.round(x0), Math.round(y0), YC.trim);
  });
  fill(s, () => {
    for (let d = 0; d <= blade; d += 0.25) {
      const u = d / blade;
      const bulge = Math.sin(Math.PI * Math.min(1, u * 1.1)) * 2.4;
      const x = bx + ux * d;
      const y = by + uy * d;
      s.set(Math.round(x), Math.round(y), YC.bladeBack);
      for (let w = 0.7; w < bulge; w += 0.5) s.set(Math.round(x + nx * w), Math.round(y + ny * w), YC.blade);
      if (bulge > 0.9) s.set(Math.round(x + nx * bulge), Math.round(y + ny * bulge), YC.bladeEdge);
    }
    s.set(Math.round(x1), Math.round(y1), WHITE);
  });
}

/** a straight spear of fire from the butt at (x0, y0) to the point at (x1, y1) */
export function spear(s: S, x0: number, y0: number, x1: number, y1: number): void {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const ux = (x1 - x0) / L;
  const uy = (y1 - y0) / L;
  fill(s, () => {
    s.stroke(x0, y0, x1 - ux * 4, y1 - uy * 4, 0.5, EMBER[4]);
    seg(s, x0 + ux * 2, y0 + uy * 2, x1 - ux * 4, y1 - uy * 4, EMBER[5]);
  });
  fill(s, () => {
    s.poly(
      [
        [x1 + 0.5, y1 + 0.5],
        [x1 - ux * 5 - uy * 2.2 + 0.5, y1 - uy * 5 + ux * 2.2 + 0.5],
        [x1 - ux * 5 + uy * 2.2 + 0.5, y1 - uy * 5 - ux * 2.2 + 0.5],
      ],
      EMBER[5],
    );
    s.set(x1, y1, WHITE);
  });
}

/** a flame of her ember fire rising from base to base - h */
export function ember(s: S, cx: number, base: number, h: number, lean = 0): void {
  fill(s, () =>
    s.poly(
      [
        [cx - h * 0.42, base],
        [cx + h * 0.42, base],
        [cx + h * 0.3, base - h * 0.5],
        [cx + lean, base - h],
        [cx - h * 0.32, base - h * 0.45],
      ],
      EMBER[3],
    ),
  );
  fill(s, () => {
    s.poly(
      [
        [cx - h * 0.2, base],
        [cx + h * 0.22, base],
        [cx + h * 0.12, base - h * 0.45],
        [cx + lean * 0.5, base - h * 0.68],
        [cx - h * 0.16, base - h * 0.3],
      ],
      EMBER[5],
    );
    s.set(cx, base - 1, WHITE);
  });
}

/** a foe: a violet blob with a rim of light and a glowing eye looking toward `look` */
export function foe(s: S, x: number, y: number, r = 3, look = -1): void {
  fill(s, () => s.dot(x, y, r, EC.bodyLight));
  fill(s, () => {
    s.set(x - look * (r - 1), y - r + 1, EC.rim);
    s.set(x + look * r * 0.45, y - r * 0.3, EC.eye);
  });
}

export function floor(s: S, x0: number, x1: number, y: number, c: Color = YC.trim): void {
  fill(s, () => seg(s, x0, y, x1, y, c));
}

/** a heart, its point at the bottom */
export function heart(s: S, cx: number, cy: number, r: number, c: Color, light: Color): void {
  fill(s, () => {
    s.dot(cx - r * 0.5, cy - r * 0.2, r * 0.6, c);
    s.dot(cx + r * 0.5, cy - r * 0.2, r * 0.6, c);
    s.poly(
      [
        [cx - r * 1.05, cy - r * 0.05],
        [cx + r * 1.05, cy - r * 0.05],
        [cx, cy + r],
      ],
      c,
    );
    s.set(cx - r * 0.6, cy - r * 0.5, light);
  });
}

/** the arc of a vault: a dashed hop from (x0, y) over to (x1, y), peaking `rise` up */
export function vaultArc(s: S, x0: number, x1: number, y: number, rise: number, c: Color = EMBER[4]): void {
  fill(s, () => {
    const n = Math.ceil(Math.abs(x1 - x0) * 1.5);
    for (let k = 0; k <= n; k++) {
      const u = k / n;
      if (Math.floor(u * 12) % 3 === 2) continue;
      s.set(Math.round(x0 + (x1 - x0) * u), Math.round(y - Math.sin(Math.PI * u) * rise), c);
    }
  });
}

/** the brace: a thick bronze arc of guard in front of (x, y), with a hot inner edge */
export function brace(s: S, x: number, y: number, r: number): void {
  fill(s, () => {
    for (let a = -1.1; a <= 1.1; a += 0.06) s.dot(x + Math.cos(a) * r, y + Math.sin(a) * r, 0.9, YC.trim);
  });
  fill(s, () => {
    for (let a = -0.9; a <= 0.9; a += 0.08) s.set(x + Math.cos(a) * (r - 1.3), y + Math.sin(a) * (r - 1.3), EMBER[5]);
  });
}
