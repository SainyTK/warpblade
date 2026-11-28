import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { mix, WHITE } from "../../../../utils/color";
import { clamp } from "../../../../utils/math";
import { VEIL } from "../colors";
import { RAY } from "./constants";

const canvas = detailCanvas(52, 36, 26, 18);
const A = VEIL.aurora;
const S = VEIL.stone;

interface RayPose {
  flap: number;
  heat: number;
  tired: number;
  curl: number;
}

function poseOf(e: Enemy, time: number): RayPose {
  if (e.stun > 0 || e.air || e.stagger > 0) return { flap: -0.8, heat: 0, tired: 1, curl: 1 };
  if (e.state === "wind") {
    const k = clamp(e.st / RAY.mark);
    return { flap: 1 - k * 0.3 + Math.sin(time * 30) * 0.15 * k, heat: k, tired: 0, curl: -k };
  }
  if (e.state === "shoot") return { flap: -1, heat: 1, tired: 0, curl: -1 };
  if (e.state === "recover") return { flap: Math.sin(time * 2) * 0.2 - 0.5, heat: 0, tired: 1, curl: 0.6 };
  return { flap: Math.sin(time * 3.2), heat: 0, tired: 0, curl: Math.sin(time * 2.1) * 0.3 };
}

function wing(s: SpriteCanvas, p: RayPose, far: boolean, time: number): void {
  const reach = (far ? 9 : 13) * p.flap;
  const tone = far ? mix(A[1], VEIL.veil[1], 0.4) : A[2];
  const tipX = far ? -4 : -6;
  const root = 0.5;
  const pts: (readonly [number, number])[] = [
    [7, root],
    [2, root - reach * 0.55],
    [tipX, root - reach],
    [tipX - 3, root - reach * 0.85],
    [-6, root],
  ];
  s.begin();
  s.poly(pts, tone);
  s.shadeEdges(tone, A[3], mix(tone, VEIL.veil[0], 0.5), 2);
  if (!far) {
    for (let i = 0; i < 3; i++) {
      const band = (Math.floor(time * 6) + i) % 3;
      const u = 0.35 + i * 0.22;
      s.hairline(
        4 - i * 3,
        root,
        tipX + (4 - i * 3 - tipX) * (1 - u),
        root - reach * u,
        band === 0 ? A[4] : VEIL.veil[2],
      );
    }
    s.set(tipX, root - reach, WHITE);
  }
  s.commit(!far);
}

function body(s: SpriteCanvas, p: RayPose, time: number): void {
  s.begin();
  s.taper(-6, 1, -22, 2 + p.curl * 4, 1.6, 0.3, S[2], p.curl * 3);
  s.shadeEdges(S[2], S[4], S[1]);
  s.commit();
  s.begin();
  s.poly(
    [
      [-7, -2],
      [2, -3.5],
      [10, -2],
      [13, 1],
      [9, 3.5],
      [-6, 4],
    ],
    S[2],
  );
  s.shadeEdges(S[2], S[4], S[1], 2);
  s.hairline(-4, 0, 8, 0, S[1]);
  const rune = p.heat > 0.4 ? A[4] : Math.sin(time * 3) > 0 ? A[3] : A[2];
  s.hairline(-2, 1.5, 0, 1.5, rune);
  s.hairline(2, 1.5, 4, 1.5, rune);
  s.set(-5, -1, S[5]);
  s.set(10, -0.5, p.heat > 0.5 ? VEIL.eyeHot : VEIL.eye);
  s.set(11, -0.5, p.tired > 0 ? S[1] : VEIL.eye);
  s.taper(11, 2.5, 15, 4 - p.heat, 0.9, 0.3, S[3]);
  s.commit();
  s.begin();
  const gem = p.heat > 0.5 ? VEIL.crystal[4] : VEIL.crystal[2];
  s.poly(
    [
      [3, -3],
      [5, -6.5 - p.heat * 1.5],
      [7, -3],
    ],
    gem,
  );
  s.shadeEdges(gem, VEIL.crystal[4], VEIL.crystal[1]);
  s.commit();
}

export function drawAuroraray(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = poseOf(e, time);
  s.clear();
  s.shift(3, 0);
  wing(s, p, true, time);
  s.shift(0, 0);
  body(s, p, time);
  wing(s, p, false, time);
  s.outline(VEIL.outline);
  return s;
}
