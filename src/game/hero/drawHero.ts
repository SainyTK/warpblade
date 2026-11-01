import { BODY, HEAD, HEAD_MAP } from "../../constants/hero";
import { HERO_COLORS as HC } from "../../constants/palette";
import type { SpriteCanvas } from "../../engine/sprite";
import type { Pose } from "../../types/pose";
import { scale, WHITE } from "../../utils/color";
import { clamp, lerp } from "../../utils/math";

type Vec = [number, number];
export interface HeroLook {
  /** scarf and ponytail points, local pixels from the feet */
  scarf: Vec[];
  tail: Vec[];
  /** how far the coat tails fly back */
  flare: number;
  sword: boolean;
}

/** two-bone reach: the joint, and the end clamped to the limb's length. s picks which way the joint bends. */
export function reach(ax: number, ay: number, tx: number, ty: number, l1: number, l2: number, s: number): [Vec, Vec] {
  const a = Math.atan2(ty - ay, tx - ax);
  const d = clamp(Math.hypot(tx - ax, ty - ay), 0.01, l1 + l2 - 0.01);
  const al = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
  return [
    [ax + Math.cos(a + s * al) * l1, ay + Math.sin(a + s * al) * l1],
    [ax + Math.cos(a) * d, ay + Math.sin(a) * d],
  ];
}

function drawLeg(s: SpriteCanvas, hip: Vec, foot: Vec, far: boolean): void {
  const k = far ? 0.72 : 1;
  const [knee, ankle] = reach(hip[0], hip[1], foot[0], foot[1] - 1, BODY.thigh, BODY.shin, -1);
  s.begin();
  s.stroke(hip[0], hip[1], knee[0], knee[1], 1.5, scale(HC.pants, k));
  s.stroke(knee[0], knee[1], ankle[0], ankle[1], 1.2, scale(HC.pants, k));
  s.stroke(lerp(knee[0], ankle[0], 0.5), lerp(knee[1], ankle[1], 0.5), ankle[0], ankle[1], 1.3, scale(HC.boot, k));
  s.stroke(ankle[0] - 0.5, ankle[1] + 0.4, ankle[0] + 2.4, ankle[1] + 0.4, 0.9, scale(HC.boot, k));
  if (!far) s.set(ankle[0] - 1, knee[1] + (ankle[1] - knee[1]) * 0.55, HC.bootLight);
  s.commit();
}

function drawTrails(s: SpriteCanvas, look: HeroLook): void {
  s.begin();
  for (let i = 1; i < look.tail.length; i++) {
    const [a, b] = [look.tail[i - 1], look.tail[i]];
    s.stroke(a[0], a[1], b[0], b[1], i < 2 ? 1.3 : i < 3 ? 1 : 0.7, i < 2 ? HC.hair : HC.hairDark);
  }
  s.commit(false);
  s.begin();
  for (let i = 1; i < look.scarf.length; i++) {
    const [a, b] = [look.scarf[i - 1], look.scarf[i]];
    s.stroke(a[0], a[1], b[0], b[1], 1.25 - i * 0.07, i % 3 === 2 ? HC.scarfDark : HC.scarf);
  }
  const tip = look.scarf[look.scarf.length - 1];
  s.set(tip[0], tip[1] + 1, HC.scarfDark);
  s.commit(false);
}

function drawSword(s: SpriteCanvas, hand: Vec, angle: number): void {
  const ca = Math.cos(angle);
  const sn = Math.sin(angle);
  const [hx, hy] = hand;
  s.begin();
  s.dot(hx - ca * 3, hy - sn * 3, 0.8, HC.trim);
  s.stroke(hx - ca * 2.4, hy - sn * 2.4, hx + ca, hy + sn, 0.6, HC.hilt);
  const gx = hx + ca * 1.7;
  const gy = hy + sn * 1.7;
  s.stroke(gx - sn * 2.6, gy + ca * 2.6, gx + sn * 2.6, gy - ca * 2.6, 0.62, HC.trim);
  for (let d = 2.6; d <= BODY.bladeLength; d += 0.5) {
    const x = hx + ca * d;
    const y = hy + sn * d;
    if (d > BODY.bladeLength - 2) {
      s.set(x, y, WHITE);
      continue;
    }
    s.set(x, y, HC.blade);
    s.set(x - sn * 0.95, y + ca * 0.95, d < 4 ? HC.bladeBack : HC.bladeEdge);
  }
  s.commit();
}

/** Draw Kael into the canvas, back to front. Returns where the near hand ended up. */
export function drawHero(s: SpriteCanvas, p: Pose, look: HeroLook): Vec {
  s.clear();
  drawTrails(s, look);
  // far arm and leg, a shade darker
  const backShoulder: Vec = [p.nx - 1, p.ny + 2];
  const [backElbow, backHand] = reach(backShoulder[0], backShoulder[1], p.bx, p.by, BODY.upperArm, BODY.foreArm, 1);
  s.begin();
  s.stroke(backShoulder[0], backShoulder[1], backElbow[0], backElbow[1], 1.2, HC.coatDark);
  s.stroke(backElbow[0], backElbow[1], backHand[0], backHand[1], 1, HC.coatDark);
  s.dot(backHand[0], backHand[1], 1.1, scale(HC.glove, 0.8));
  s.commit();
  drawLeg(s, [p.hx - 1.5, p.hy], [p.bfx, p.bfy], true);
  // coat tails flare back with speed
  const fl = look.flare;
  s.begin();
  s.poly(
    [
      [p.hx - 3.5, p.hy - 2],
      [p.hx + 3, p.hy - 2],
      [p.hx + 3.5 + fl * 0.2, p.hy + 7],
      [p.hx - 4.5 - fl, p.hy + 8.5 - fl * 0.4],
    ],
    HC.coatDark,
  );
  s.stroke(p.hx - 2.5, p.hy - 1, p.hx - 3.5 - fl * 0.8, p.hy + 6.5 - fl * 0.4, 0.5, HC.coat);
  s.stroke(p.hx + 3.5 + fl * 0.2, p.hy + 7.4, p.hx - 4.5 - fl, p.hy + 8.9 - fl * 0.4, 0.55, HC.trim);
  s.commit();
  drawLeg(s, [p.hx + 1.5, p.hy], [p.ffx, p.ffy], false);
  // torso lit from the top left: open coat with a brass edge, dark shirt, belt
  s.begin();
  s.poly(
    [
      [p.nx - 3.5, p.ny],
      [p.nx + 3, p.ny],
      [p.hx + 3, p.hy + 0.5],
      [p.hx - 3.5, p.hy + 0.5],
    ],
    HC.coat,
  );
  s.stroke(p.nx - 2.6, p.ny + 0.8, p.hx - 2.8, p.hy - 1.5, 0.5, HC.coatLight);
  s.stroke(p.nx - 1.5, p.ny + 0.6, p.nx + 1, p.ny + 0.6, 0.5, HC.coatLight);
  s.stroke(p.nx + 1.6, p.ny + 1.2, p.hx + 1.9, p.hy - 1.5, 0.6, HC.shirt);
  s.stroke(p.nx + 0.4, p.ny + 1, p.hx + 0.6, p.hy - 0.5, 0.5, HC.trim);
  s.stroke(p.hx - 3, p.hy - 1, p.hx + 2.6, p.hy - 1, 0.55, HC.glove);
  s.set(p.hx + 1, p.hy - 1.5, HC.trim);
  s.commit();
  // head, then the scarf wrapped at the neck
  s.begin();
  s.pixels(HEAD, HEAD_MAP, Math.round(p.nx) - 5, Math.round(p.ny) - 10);
  s.commit();
  s.begin();
  s.stroke(p.nx - 2.6, p.ny + 0.4, p.nx + 2.4, p.ny + 0.4, 0.9, HC.scarf);
  s.set(p.nx, p.ny - 0.6, HC.scarfLight);
  s.set(p.nx + 1, p.ny - 0.6, HC.scarfLight);
  s.commit();
  // the sword, then the near arm holding it
  const shoulder: Vec = [p.nx + 1, p.ny + 2];
  const [elbow, hand] = reach(shoulder[0], shoulder[1], p.fx, p.fy, BODY.upperArm, BODY.foreArm, 1);
  if (look.sword) drawSword(s, hand, p.sa);
  s.begin();
  s.stroke(shoulder[0], shoulder[1], elbow[0], elbow[1], 1.2, HC.coat);
  s.stroke(elbow[0], elbow[1], hand[0], hand[1], 1.05, HC.coat);
  s.set(lerp(elbow[0], hand[0], 0.75), lerp(elbow[1], hand[1], 0.75), HC.trim);
  s.dot(hand[0], hand[1], 1.1, HC.glove);
  s.commit();
  s.outline(HC.outline);
  return hand;
}
