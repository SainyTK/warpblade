import { DRUM, HERO_COLORS as HC, PAL } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Pose } from "../../../types/pose";
import { atHip, farShoulder } from "../../../utils/poseFrame";
import type { Vec } from "./reach";

/** the drum in local art pixels: its depth along its axis and the radius of its heads */
const DRUM_DEPTH = 5;
const DRUM_RADIUS = 3.5;
/** where its middle sits: at the hip, and in front of the belly with its head up */
const AT_HIP: Vec = [1.5, 1.5];
const IN_FRONT: Vec = [6.5, -1.5];
/** the mallet: shaft length from the hand, and the felt head's radius */
const MALLET_SHAFT = 8.5;
const MALLET_HEAD = 1.35;

/** the pewter of the hoops, pale hide of the heads, and the cobalt of the lacing and the felt */
const PEWTER = HC.steelLight;
const HIDE = HC.gloveLight;
const HIDE_SHADE = HC.glove;

/**
 * Jory's war drum on its leather strap: a deep oxblood shell with pewter hoops, pale hide heads and cobalt rope laced in
 * a zigzag between the hoops. `p.dr` swings it from his hip (its axis level, a head facing forward) round to the front
 * of his belly (its axis upright, the top head ready for a blow).
 */
export function drawDrum(s: SpriteCanvas, p: Pose): void {
  const k = Math.max(0, Math.min(1, p.dr));
  const hip = atHip(p, AT_HIP[0], AT_HIP[1]);
  const front = atHip(p, IN_FRONT[0], IN_FRONT[1]);
  const cx = hip[0] + (front[0] - hip[0]) * k;
  const cy = hip[1] + (front[1] - hip[1]) * k;
  // the axis turns from level to upright as it swings round
  const angle = -k * (Math.PI / 2);
  const ax = Math.cos(angle);
  const ay = Math.sin(angle);
  const at = (d: number, w: number): Vec => [cx + ax * d - ay * w, cy + ay * d + ax * w];
  const half = DRUM_DEPTH / 2;
  // the strap from the far shoulder down across the chest to the near hoop
  const shoulder = farShoulder(p);
  const lug = at(-half + 0.5, -DRUM_RADIUS);
  s.begin();
  s.stroke(shoulder[0], shoulder[1], lug[0], lug[1], 0.45, HC.glove);
  s.shadeEdges(HC.glove, HC.gloveLight, HC.hilt);
  s.commit();
  // the shell
  s.begin();
  s.poly([at(-half, -DRUM_RADIUS), at(half, -DRUM_RADIUS), at(half, DRUM_RADIUS), at(-half, DRUM_RADIUS)], DRUM[1]);
  s.shadeEdges(DRUM[1], DRUM[3], DRUM[0], 2);
  s.commit();
  // the lacing: a cobalt zigzag between the hoops
  s.begin();
  const zig = 4;
  for (let i = 0; i < zig; i++) {
    const w0 = -DRUM_RADIUS + 0.6 + (i / zig) * (DRUM_RADIUS * 2 - 1.2);
    const w1 = -DRUM_RADIUS + 0.6 + ((i + 0.5) / zig) * (DRUM_RADIUS * 2 - 1.2);
    const w2 = -DRUM_RADIUS + 0.6 + ((i + 1) / zig) * (DRUM_RADIUS * 2 - 1.2);
    const [a, b, c] = [at(-half + 0.8, w0), at(half - 0.8, w1), at(-half + 0.8, w2)];
    s.hairline(a[0], a[1], b[0], b[1], PAL.beat[3]);
    s.hairline(b[0], b[1], c[0], c[1], PAL.beat[3]);
  }
  s.commit(false);
  // the hoops at both ends
  s.begin();
  for (const d of [-half, half]) {
    const [a, b] = [at(d, -DRUM_RADIUS - 0.2), at(d, DRUM_RADIUS + 0.2)];
    s.stroke(a[0], a[1], b[0], b[1], 0.4, PEWTER);
  }
  s.shadeEdges(PEWTER, HC.steelGlint, HC.steelDark);
  s.commit();
  // the head facing out: a thin pale lens at the forward end while level, opening to an oval on top as it turns up
  const open = 0.6 + k * 1.6;
  const head = at(half + 0.2, 0);
  s.begin();
  const lens: Vec[] = [];
  for (let i = 0; i <= 12; i++) {
    const g = (i / 12) * Math.PI * 2;
    lens.push([
      head[0] + ax * Math.cos(g) * open - ay * Math.sin(g) * DRUM_RADIUS,
      head[1] + ay * Math.cos(g) * open + ax * Math.sin(g) * DRUM_RADIUS,
    ]);
  }
  s.poly(lens, HIDE);
  s.shadeEdges(HIDE, HC.steelGlint, HIDE_SHADE);
  s.commit();
}

/**
 * A mallet held at this angle from the hand: a dark wood shaft with a lit edge and a round cobalt felt head with a pale
 * glint. The mallet in the far hand is a shade darker.
 */
export function drawMallet(s: SpriteCanvas, hand: Vec, angle: number, front: boolean): void {
  const ca = Math.cos(angle);
  const sn = Math.sin(angle);
  const at = (d: number): Vec => [hand[0] + ca * d, hand[1] + sn * d];
  const [a, b] = [at(-1.4), at(MALLET_SHAFT)];
  s.begin();
  s.stroke(a[0], a[1], b[0], b[1], 0.42, HC.hilt);
  s.shadeEdges(HC.hilt, front ? HC.gloveLight : HC.glove, HC.outline);
  s.commit();
  const tip = at(MALLET_SHAFT + MALLET_HEAD * 0.6);
  const felt = front ? PAL.beat[3] : PAL.beat[2];
  s.begin();
  s.dot(tip[0], tip[1], MALLET_HEAD, felt);
  s.shadeEdges(felt, front ? PAL.beat[4] : PAL.beat[3], PAL.beat[1], 2);
  s.commit();
  s.begin();
  s.set(tip[0] - 0.5, tip[1] - 0.6, front ? PAL.beat[5] : PAL.beat[4]);
  s.commit(false);
}

/** the far mallet is held like the near one, along the forearm's line and tipped up a little */
export function farMalletAngle(elbow: Vec, hand: Vec): number {
  return Math.atan2(hand[1] - elbow[1], hand[0] - elbow[0]) - 0.35;
}
