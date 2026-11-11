import { DIAL } from "../../../constants/mirel/look";
import { fleck, hairline } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import { TAU } from "../../../utils/math";

/** twelve o'clock, as an angle */
const NOON = -Math.PI / 2;
/** a face this wide or wider is a great clock: a heavier bezel and broader quarter marks */
const GREAT = 60;

/** a clock face to draw: where, how big, how solid, and the floor that stands in front of its lower part */
export interface Dial {
  x: number;
  y: number;
  r: number;
  /** how much of it shows, 0 to 1 */
  a: number;
  /** nothing is drawn at or below this height */
  floor: number;
  /** the whole face in the flash colour, as it opens or tolls */
  flash?: boolean;
}

/** a fine line from (x0, y0) to (x1, y1), cut off at the floor */
function clipped(d: Dial, x0: number, y0: number, x1: number, y1: number, c: Color, a: number): void {
  if (y0 >= d.floor && y1 >= d.floor) return;
  const cut = (xa: number, ya: number, xb: number, yb: number): [number, number] => {
    if (yb < d.floor) return [xb, yb];
    const u = (d.floor - 0.5 - ya) / (yb - ya);
    return [xa + (xb - xa) * u, d.floor - 0.5];
  };
  const [ax, ay] = y0 < d.floor ? [x0, y0] : cut(x1, y1, x0, y0);
  const [bx, by] = y1 < d.floor ? [x1, y1] : cut(x0, y0, x1, y1);
  hairline(ax, ay, bx, by, c, a);
}

/** a ring one image pixel wide round the face's centre, from one angle to another */
export function dialArc(d: Dial, r: number, from: number, to: number, c: Color, a: number): void {
  if (r < 0.5) return;
  const n = Math.max(6, Math.ceil(Math.abs(to - from) * r * 2.6));
  for (let i = 0; i <= n; i++) {
    const g = from + ((to - from) * i) / n;
    const y = d.y + Math.sin(g) * r;
    if (y < d.floor) fleck(d.x + Math.cos(g) * r, y, c, a);
  }
}

/** a mark across the face along one angle, from radius r0 to r1 */
export function dialMark(d: Dial, angle: number, r0: number, r1: number, c: Color, a: number): void {
  const cx = Math.cos(angle);
  const cy = Math.sin(angle);
  clipped(d, d.x + cx * r0, d.y + cy * r0, d.x + cx * r1, d.y + cy * r1, c, a);
}

/**
 * The face itself: a bezel of two fine rings, minute marks between them on a face big enough to hold them, and twelve
 * hour marks, the quarters longer and brighter.
 */
export function drawDial(d: Dial): void {
  if (d.r < 2 || d.a <= 0) return;
  const tone = (c: Color): Color => (d.flash ? DIAL.flash : c);
  const great = d.r >= GREAT;
  const gap = great ? 4 : d.r >= 24 ? 2.5 : 1.5;
  dialArc(d, d.r, 0, TAU, tone(great ? DIAL.hour : DIAL.bezel), d.a);
  if (great) {
    // the great clock's bezel is three lines thick with a fine dashed track outside it
    dialArc(d, d.r - 0.5, 0, TAU, tone(DIAL.hour), d.a);
    dialArc(d, d.r + 0.5, 0, TAU, tone(DIAL.bezel), d.a);
    for (let i = 0; i < 60; i++) {
      const g = NOON + (i / 60) * TAU;
      dialArc(d, d.r + 3, g, g + TAU / 120, tone(DIAL.bezelInner), d.a * 0.8);
    }
  }
  dialArc(d, d.r - gap, 0, TAU, tone(DIAL.bezelInner), d.a * 0.8);
  if (d.r >= 24)
    for (let i = 0; i < 60; i++) {
      if (i % 5 === 0) continue;
      const g = NOON + (i / 60) * TAU;
      dialMark(d, g, d.r - gap + 0.5, d.r - 0.5, tone(DIAL.minute), d.a * 0.8);
    }
  const long = Math.max(2, d.r * 0.16);
  for (let i = 0; i < 12; i++) {
    const g = NOON + (i / 12) * TAU;
    const quarter = i % 3 === 0;
    const reach = quarter ? long : long * 0.6;
    dialMark(d, g, d.r - gap - reach, d.r - gap, tone(quarter ? DIAL.quarter : DIAL.hour), d.a);
    if (!quarter || d.r < 24) continue;
    // a quarter mark is two lines side by side, so it reads as a bar from across the stage
    const side = 0.5 / d.r;
    for (let k = 1; k <= (great ? 3 : 1); k++)
      dialMark(d, g + side * (k % 2 ? (k + 1) / 2 : -k / 2), d.r - gap - reach, d.r - gap, tone(DIAL.quarter), d.a);
  }
}

/**
 * A hand from the hub at `turn` round the face (0 at twelve, 1 a full turn), `reach` long: a bright line with a shaded
 * line beside it over its inner part, so it tapers to its point, and a short tail behind the hub.
 */
export function drawHand(d: Dial, turn: number, reach: number, heavy: boolean): void {
  const g = NOON + turn * TAU;
  const side = g + Math.PI / 2;
  const ox = Math.cos(side) * 0.5;
  const oy = Math.sin(side) * 0.5;
  const tone = d.flash ? DIAL.flash : DIAL.hand;
  dialMark(d, g, -reach * 0.14, reach, tone, d.a);
  const thick: Dial = { ...d, x: d.x + ox, y: d.y + oy };
  dialMark(thick, g, -reach * 0.14, reach * (heavy ? 0.85 : 0.55), d.flash ? DIAL.flash : DIAL.handShade, d.a);
  if (!heavy) return;
  const far: Dial = { ...d, x: d.x - ox, y: d.y - oy };
  dialMark(far, g, 0, reach * 0.7, d.flash ? DIAL.flash : DIAL.handShade, d.a);
}

/** lines in a hand's wake */
const WAKE = 8;

/** the faint wake a sweeping hand leaves behind it: lines fanned back from the hand, each fainter */
export function drawHandWake(d: Dial, turn: number, reach: number, spread: number): void {
  for (let i = 1; i <= WAKE; i++)
    dialMark(
      d,
      NOON + (turn - (spread * i) / WAKE) * TAU,
      reach * 0.2,
      reach,
      DIAL.handShade,
      d.a * 0.5 * (1 - i / (WAKE + 1)),
    );
}

/** the hub the hands turn on: a bright point in a small ring */
export function drawHub(d: Dial): void {
  if (d.y >= d.floor) return;
  if (d.r >= 24) dialArc(d, 1.5, 0, TAU, d.flash ? DIAL.flash : DIAL.hubRing, d.a);
  fleck(d.x, d.y, DIAL.hub, d.a);
  fleck(d.x - 0.5, d.y, DIAL.hub, d.a);
  fleck(d.x, d.y - 0.5, DIAL.hub, d.a);
  fleck(d.x - 0.5, d.y - 0.5, DIAL.hub, d.a);
}
