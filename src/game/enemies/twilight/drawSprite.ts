import { detailCanvas, type SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import type { Enemy } from "../../../types/enemy";
import { mix, WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { PRISM, TWILIGHT_COLORS as TC } from "./colors";
import { BLINK } from "./sprite";

const canvas = detailCanvas(36, 36, 18, 18);
type Pt = readonly [number, number];
/** where every wing grows from */
const WING_ROOT: Pt = [-1, -2];
/** how far a wing's membrane swells out past the line to its tip, so a wing seen edge on keeps some breadth */
const WING_SPREAD = 1.5;

/** how much of the sprite is there: it shrinks to a glint as it blinks out and grows back where it lands */
function presence(e: Enemy): number {
  if (e.state !== "blink") return 1;
  return e.n === 0 ? 1 - clamp(e.st / BLINK.out) : clamp((e.st - BLINK.out) / (BLINK.back - BLINK.out));
}

/** the four pointed star of light it is reduced to mid blink, its arms tapering and cycling through the prism hues */
function blinkStar(s: SpriteCanvas, k: number, time: number): void {
  s.begin();
  const L = Math.round(2 + k * 8);
  const thick = L - 0.5;
  for (let d = -L - 0.5; d < L + 0.5; d += 0.5) {
    const a = Math.abs(d + 0.25);
    const c = a < 1.5 ? WHITE : PRISM[(Math.floor(a) + Math.floor(time * 12)) % PRISM.length];
    s.set(d, 0, c);
    s.set(0, d, c);
    if (a >= thick) continue;
    s.set(d, -0.5, c);
    s.set(-0.5, d, c);
  }
  s.commit(false);
}

/** a small crystal fairy: a faceted gem body, a bead head and two pairs of veined wings that split the light into colors */
export function drawSprite(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const k = presence(e);
  s.clear();
  if (k < 0.45) {
    blinkStar(s, k, time);
    return s;
  }
  const bob = Math.round(Math.sin(time * 3) * 1);
  const flap = Math.sin(time * 22);
  const up = Math.round(flap * 3);
  const P = (x: number, y: number): Pt => [x * k, (y + bob) * k];
  const poly = (pts: readonly Pt[], c: Color) =>
    s.poly(
      pts.map(([x, y]) => P(x, y)),
      c,
    );
  const line = (a: Pt, b: Pt, c: Color) => {
    const [x0, y0] = P(a[0], a[1]);
    const [x1, y1] = P(b[0], b[1]);
    s.hairline(x0, y0, x1, y1, c);
  };
  const spot = (x: number, y: number, c: Color) => {
    const [a, b] = P(x, y);
    s.block(a, b, c);
  };
  const hue = Math.floor(time * 5);
  /** one wing: a lit membrane swelling between tip and tail, with a paler inner facet, a vein to its tip and a glint there; far wings sit in shade */
  const wing = (tip: Pt, tail: Pt, i: number, far: boolean) => {
    const tint = mix(PRISM[(hue + i) % 4], TC.crystalHot, 0.15);
    const membrane = far ? mix(tint, TC.crystalLight, 0.4) : tint;
    const facet = mix(PRISM[(hue + i + 1) % 4], WHITE, far ? 0.15 : 0.35);
    const [dx, dy] = [tip[0] - WING_ROOT[0], tip[1] - WING_ROOT[1]];
    const towardTail = -dy * (tail[0] - WING_ROOT[0]) + dx * (tail[1] - WING_ROOT[1]) < 0 ? -1 : 1;
    const spread = (WING_SPREAD * towardTail) / Math.hypot(dx, dy);
    const bulge: Pt = [
      (tip[0] + tail[0]) * 0.625 - WING_ROOT[0] * 0.25 - dy * spread,
      (tip[1] + tail[1]) * 0.625 - WING_ROOT[1] * 0.25 + dx * spread,
    ];
    s.begin();
    poly([WING_ROOT, tip, bulge, tail], membrane);
    s.shadeEdges(membrane, mix(membrane, WHITE, 0.5), mix(membrane, TC.crystalDeep, 0.45));
    poly([WING_ROOT, [(tip[0] * 2) / 3, (tip[1] * 2) / 3 - 1], [(tail[0] * 2) / 3, (tail[1] * 2) / 3 - 1]], facet);
    line(WING_ROOT, tip, mix(facet, WHITE, 0.5));
    spot(tip[0] - 0.5, tip[1] - 0.5, WHITE);
    s.commit(!far);
  };
  // the far pair of wings, then the near pair
  wing([-6, -11 + up], [-1, -8 + up], 1, true);
  wing([-7, 3 - up], [-3, 5 - up], 3, true);
  wing([-10, -9 + up], [-4, -3 + up], 0, false);
  wing([-9, 4 - up], [-5, 1 - up], 2, false);
  // the gem body cut in four facets lit from the top left, its core blazing as it gathers light
  const top: Pt = [1, -4];
  const right: Pt = [4, 1];
  const bottom: Pt = [1, 7];
  const left: Pt = [-2, 1];
  const mid: Pt = [1, 1];
  const gathering = e.state === "wind" || e.state === "shoot";
  s.begin();
  poly([top, mid, left], TC.crystalLight);
  poly([top, right, mid], TC.crystal);
  poly([left, mid, bottom], TC.crystal);
  poly([mid, right, bottom], TC.crystalDark);
  line(top, left, TC.crystalHot);
  line(right, bottom, TC.crystalDeep);
  poly(
    [
      [0, 6],
      [2, 6],
      [1, 9],
    ],
    TC.crystalDark,
  );
  const [cx, cy] = P(mid[0], mid[1]);
  s.dot(cx, cy + 0.5, 1.2 * k, gathering ? TC.crystalHot : TC.crystalLight);
  spot(mid[0] - 0.5, mid[1], gathering ? WHITE : TC.crystalHot);
  spot(0, -1.5, WHITE);
  s.commit();
  // the bead head with its crystal crest and a bright eye
  s.begin();
  const [hx, hy] = P(2, -6);
  s.dot(hx, hy, 2.4 * k, TC.crystalLight);
  s.shadeEdges(TC.crystalLight, TC.crystalHot, TC.crystal, 2);
  poly(
    [
      [2, -7.5],
      [-0.5, -8.5],
      [-2, -11],
      [1, -9.5],
    ],
    PRISM[0],
  );
  spot(-2, -11, PRISM[1]);
  spot(0.5, -7.5, WHITE);
  spot(3, -6.5, e.state === "wind" ? WHITE : TC.eye);
  s.commit();
  s.outline(TC.outline);
  return s;
}
