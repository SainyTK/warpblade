import { detailCanvas, type SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import type { Enemy } from "../../../types/enemy";
import { mix, WHITE } from "../../../utils/color";
import { TAU } from "../../../utils/math";
import { PRISM, TWILIGHT_COLORS as TC } from "./colors";
import { spritePose } from "./spritePose";

const canvas = detailCanvas(36, 36, 18, 18);
type Pt = readonly [number, number];
/** where every wing grows from */
const WING_ROOT: Pt = [-1, -2];
/** how far a wing's membrane swells out past the line to its tip, so a wing seen edge on keeps some breadth */
const WING_SPREAD = 1.5;
/** the four wings at rest: tip, tail, whether the beat lifts or lowers it, and whether it is the far one of its pair */
const WINGS: readonly { tip: Pt; tail: Pt; beat: number; far: boolean }[] = [
  { tip: [-6, -11], tail: [-1, -8], beat: 1, far: true },
  { tip: [-7, 3], tail: [-3, 5], beat: -1, far: true },
  { tip: [-10, -9], tail: [-4, -3], beat: 1, far: false },
  { tip: [-9, 4], tail: [-5, 1], beat: -1, far: false },
];
/** a pane of wing shimmers this many times a second, one wing after the other */
const SHIMMER = 5;
const DULL = 0.4;
/** the rays of light it draws in while it gathers a shot */
const RAYS = { count: 6, from: 9, to: 4.5, length: 2.5 };

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
  const pose = spritePose(e, time);
  const k = pose.presence;
  s.clear();
  if (k < 0.45) {
    blinkStar(s, k, time);
    return s;
  }
  const P = (x: number, y: number): Pt => [x * k, (y + pose.bob) * k];
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
  const lit = (c: Color): Color => mix(c, WHITE, Math.max(pose.flash, pose.gather * 0.35));
  const toned = (c: Color): Color => (pose.awake ? lit(c) : mix(c, TC.crystalDeep, DULL));
  const shimmering = Math.floor(time * SHIMMER) % (WINGS.length * 2);
  /** a wing point moved by the beat, the sweep of a shot's recoil and the droop of a stunned sprite */
  const moved = ([x, y]: Pt, beat: number): Pt => {
    const beaten = y + beat * pose.flap;
    const swept = beaten + (WING_ROOT[1] - 2 * beat - beaten) * pose.sweep * 0.6;
    return [x - pose.sweep * 2 + pose.droop * 2, swept + pose.droop * (beat > 0 ? 9 : 3)];
  };
  /**
   * one wing: a pane of crystal that pales toward its root, a lit leading edge, a dark vein through the pane and a
   * glint at the tip; far wings sit in shade
   */
  const wing = (i: number) => {
    const { beat, far } = WINGS[i];
    const tip = moved(WINGS[i].tip, beat);
    const tail = moved(WINGS[i].tail, beat);
    const hue = toned(far ? mix(PRISM[i], TC.crystalDark, 0.3) : PRISM[i]);
    const pane = shimmering === i ? mix(hue, WHITE, 0.35) : hue;
    const [dx, dy] = [tip[0] - WING_ROOT[0], tip[1] - WING_ROOT[1]];
    const towardTail = -dy * (tail[0] - WING_ROOT[0]) + dx * (tail[1] - WING_ROOT[1]) < 0 ? -1 : 1;
    const spread = (WING_SPREAD * towardTail) / Math.hypot(dx, dy);
    const bulge: Pt = [
      (tip[0] + tail[0]) * 0.625 - WING_ROOT[0] * 0.25 - dy * spread,
      (tip[1] + tail[1]) * 0.625 - WING_ROOT[1] * 0.25 + dx * spread,
    ];
    const toward = (p: Pt, u: number): Pt => [
      WING_ROOT[0] + (p[0] - WING_ROOT[0]) * u,
      WING_ROOT[1] + (p[1] - WING_ROOT[1]) * u,
    ];
    s.begin();
    poly([WING_ROOT, tip, bulge, tail], pane);
    s.shadeEdges(pane, mix(pane, WHITE, 0.5), mix(pane, TC.crystalDeep, 0.45));
    poly([WING_ROOT, toward(tip, 0.66), toward(bulge, 0.62), toward(tail, 0.66)], mix(pane, WHITE, 0.4));
    poly([WING_ROOT, toward(tip, 0.36), toward(bulge, 0.34), toward(tail, 0.36)], mix(pane, WHITE, 0.75));
    line(toward(bulge, 0.3), toward(bulge, 0.92), mix(pane, TC.crystalDeep, far ? 0.3 : 0.5));
    line(WING_ROOT, tip, mix(pane, WHITE, 0.7));
    spot(tip[0] - 0.5, tip[1] - 0.5, WHITE);
    s.commit(!far);
  };
  // the far pair of wings, then the near pair
  for (let i = 0; i < WINGS.length; i++) wing(i);
  // the gem body cut in four facets lit from the top left, its core blazing as it gathers light
  const top: Pt = [1, -4];
  const right: Pt = [4, 1];
  const bottom: Pt = [1, 7];
  const left: Pt = [-2, 1];
  const mid: Pt = [1, 1];
  const pulse = 0.5 + 0.5 * Math.sin(time * 4);
  s.begin();
  poly([top, mid, left], toned(TC.crystalLight));
  poly([top, right, mid], toned(TC.crystal));
  poly([left, mid, bottom], toned(TC.crystal));
  poly([mid, right, bottom], toned(TC.crystalDark));
  line(top, left, toned(TC.crystalHot));
  line(left, mid, toned(TC.crystalLight));
  line(right, bottom, toned(TC.crystalDeep));
  poly(
    [
      [0, 6],
      [2, 6],
      [1, 9],
    ],
    toned(TC.crystalDark),
  );
  const [cx, cy] = P(mid[0], mid[1]);
  const core = pose.awake ? mix(TC.crystalLight, TC.crystalHot, Math.max(pulse * 0.6, pose.gather)) : TC.crystal;
  s.dot(cx, cy + 0.5, (1.2 + pose.gather * 0.9) * k, core);
  if (pose.awake) spot(mid[0] - 0.5, mid[1], pose.gather > 0.3 || pose.flash > 0 ? WHITE : TC.crystalHot);
  spot(0, -1.5, WHITE);
  s.commit();
  // the bead head with its crystal crest and a bright eye
  s.begin();
  const [hx, hy] = P(2, -6);
  const head = toned(TC.crystalLight);
  s.dot(hx, hy, 2.4 * k, head);
  s.shadeEdges(head, toned(TC.crystalHot), toned(TC.crystal), 2);
  poly(
    [
      [2, -7.5],
      [-0.5, -8.5],
      [-2, -11],
      [1, -9.5],
    ],
    toned(PRISM[0]),
  );
  spot(-2, -11, toned(PRISM[1]));
  spot(0.5, -7.5, WHITE);
  spot(3, -6.5, !pose.awake ? TC.crystalDeep : pose.gather > 0 ? WHITE : TC.eye);
  s.commit();
  s.outline(TC.outline);
  if (pose.gather <= 0) return s;
  // over the outline: rays of prism light drawn in toward the core as it gathers a shot
  s.begin();
  const radius = RAYS.from + (RAYS.to - RAYS.from) * pose.gather;
  for (let i = 0; i < RAYS.count; i++) {
    const a = (i / RAYS.count) * TAU + time * 3;
    const [x0, y0] = [cx + Math.cos(a) * radius, cy + Math.sin(a) * radius];
    const [x1, y1] = [cx + Math.cos(a) * (radius + RAYS.length), cy + Math.sin(a) * (radius + RAYS.length)];
    s.hairline(x0, y0, x1, y1, PRISM[i % PRISM.length]);
    s.set(x0, y0, WHITE);
  }
  s.commit(false);
  return s;
}
