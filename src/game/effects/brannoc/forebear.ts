import { PAL } from "../../../constants/palette";
import { blendScreen, fleck, glow, hairline, toScreenX, toScreenY } from "../../../engine/frame";
import { WHITE } from "../../../utils/color";
import { ease, lerp } from "../../../utils/math";
import { pointInPolygon } from "../../../utils/pointInPolygon";

/**
 * A forebear's ghost about 30 px tall standing on its feet row, facing right, one string per row from the top: a
 * horned helm, a beard, broad shoulders and legs that thin into mist. Letters: a crimson outline (o), a pale crimson
 * body (b) lit on the side it faces (l), and a white eye (w).
 */
const FOREBEAR_ART = [
  "..o.......o..",
  "..oo.....oo..",
  "...oo...oo...",
  "....ooooo....",
  "...obbbbbo...",
  "...obbbblo...",
  "...obbblwo...",
  "...obbbbbo...",
  "...obbbbbo...",
  "....obbbo....",
  "....obbbo....",
  "..oobbbbboo..",
  ".obbbbbbbblo.",
  ".obbbbbbbblo.",
  ".obbbbbbbblo.",
  ".obbbbbbbblo.",
  "..obbbbbbblo.",
  "..obbbbbbblo.",
  "..obbbbbbbo..",
  "..obbbbbbbo..",
  "..obbbbbbbo..",
  "..obbbbbbbo..",
  "..obbb.bbbo..",
  "..obbb.bbbo..",
  "..obbb.bbbo..",
  "..obb...bbo..",
  "..obb...bbo..",
  "..obb...bbo..",
  "..obb...bbo..",
  ".oobb...bboo.",
] as const;
/** the ramp step behind each letter: pale crimson */
const SHADE: Readonly<Record<string, number>> = { o: 3, b: 4, l: 5 };
/** the art column over its middle, and the shoulder its axe swings from, in px from its feet facing right */
const MIDDLE = 6;
const SHOULDER = { x: 2, y: 18 } as const;
/** the axe: haft length, and its angle from straight ahead (up is negative) held, raised and swung down */
const AXE = { haft: 20, rest: -1.75, raised: -2.5, down: 0.85 } as const;
/** the blade's outline from the haft's end, in px along the haft and across it toward its front: the back of the blade
 *  on the haft, the beard, the curved edge, and the toe */
const BLADE = [
  [-6, 0],
  [-8.5, 4],
  [-4, 6.5],
  [0.5, 6],
  [2, 3.5],
  [0, 0],
] as const;
/** the legs fade into mist from this row down */
const MIST_FROM = 22;

function ghost(x: number, y: number, c: number, a: number): void {
  blendScreen(toScreenX(x), toScreenY(y), c, a);
}

/** a translucent line one art pixel wide */
function ghostLine(x0: number, y0: number, x1: number, y1: number, c: number, a: number): void {
  const n = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))));
  for (let i = 0; i <= n; i++) ghost(Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n), c, a);
}

/** a translucent filled shape, one art pixel at a time, so it shows the scenery through it like the figure */
function ghostFill(poly: readonly (readonly [number, number])[], c: number, a: number): void {
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y++)
    for (let x = Math.floor(Math.min(...xs)); x <= Math.ceil(Math.max(...xs)); x++)
      if (pointInPolygon(poly, x + 0.5, y + 0.5)) ghost(x, y, c, a);
}

/** the axe's angle: held upright at rest, and over a swing raised high behind then brought down ahead */
function axeAngle(swing: number): number {
  if (swing < 0) return AXE.rest;
  if (swing < 0.25) return lerp(AXE.rest, AXE.raised, swing / 0.25);
  return lerp(AXE.raised, AXE.down, ease.outCubic((swing - 0.25) / 0.75));
}

/** a point on the axe's line, `r` px from the shoulder at angle `ang`, facing `face` */
const along = (sx: number, sy: number, ang: number, r: number, face: number): readonly [number, number] => [
  sx + face * Math.cos(ang) * r,
  sy + Math.sin(ang) * r,
];

/**
 * A ghostly forebear with its feet on `floor` at x, facing `face`: the translucent pale crimson figure and a great axe
 * it holds upright, raising it behind and bringing it down ahead while `swing` runs from 0 to 1 (negative at rest),
 * with a crimson arc behind the head as it falls. The caller has placed the frame.
 */
export function drawForebear(x: number, floor: number, face: number, swing: number, a: number): void {
  if (a <= 0) return;
  const bx = Math.round(x);
  const top = Math.round(floor) - FOREBEAR_ART.length;
  glow(bx, top + 13, 17, PAL.rage[3], 0.22 * a);
  for (let r = 0; r < FOREBEAR_ART.length; r++) {
    const row = FOREBEAR_ART[r];
    const mist = r >= MIST_FROM ? 1 - (r - MIST_FROM + 1) / (FOREBEAR_ART.length - MIST_FROM + 1) : 1;
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      if (ch === ".") continue;
      const cx = bx + (i - MIDDLE) * face;
      if (ch === "w") ghost(cx, top + r, WHITE, Math.min(1, a * 1.2));
      else ghost(cx, top + r, PAL.rage[SHADE[ch]], a * (ch === "o" ? 0.8 : 0.55) * mist);
    }
  }
  const sx = bx + face * SHOULDER.x + 0.5;
  const sy = floor - SHOULDER.y + 0.5;
  const ang = axeAngle(swing);
  const [hx, hy] = along(sx, sy, ang, AXE.haft, face);
  ghostLine(sx - 0.5, sy - 0.5, hx - 0.5, hy - 0.5, PAL.rage[4], a * 0.8);
  // the head: a broad bearded blade on the front of the haft, its curved edge pale
  const at = (r: number, across: number): readonly [number, number] => {
    const [ax, ay] = along(sx, sy, ang, r, face);
    return [ax - face * Math.sin(ang) * across, ay + Math.cos(ang) * across];
  };
  const blade = BLADE.map(([r, across]) => at(AXE.haft + r, across));
  ghostFill(blade, PAL.rage[4], a * 0.8);
  for (let i = 1; i < blade.length - 2; i++)
    hairline(blade[i][0], blade[i][1], blade[i + 1][0], blade[i + 1][1], PAL.rage[5], a);
  if (swing < 0.25) return;
  // the arc the head leaves behind as it falls
  const from = AXE.raised;
  const n = 14;
  for (let i = 0; i <= n; i++) {
    const g = lerp(from, ang, i / n);
    const [ax, ay] = along(sx, sy, g, AXE.haft + 1, face);
    fleck(ax, ay, PAL.rage[i > n - 3 ? 5 : 3], a * (i / n) * (1 - swing) * 2);
  }
  glow(hx, hy, 7, PAL.rage[4], 0.4 * a * (1 - swing));
}
