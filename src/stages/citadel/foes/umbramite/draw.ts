import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { AC, hideOf, VOID } from "../../../../game/enemies/abyss/colors";
import { fang, glowEye, type Pt, sunRim } from "../../../../game/enemies/abyss/paint";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { MITE } from "./constants";

const canvas = detailCanvas(26, 22, 13, 18);

const HIPS: readonly number[] = [-3.5, -1, 1.5];

interface MitePose {
  y: number;
  squash: number;
  stride: number;
  tuck: number;
  hot: boolean;
  glow: number;
}

function poseOf(e: Enemy, time: number): MitePose {
  if (e.state === "wind") {
    const u = clamp(e.st / MITE.wind);
    return { y: 0, squash: u * 1.2, stride: 0, tuck: 0, hot: u > 0.5, glow: u };
  }
  if (e.state === "leap") return { y: 0, squash: -0.6, stride: 0, tuck: 1, hot: true, glow: 1 };
  if (e.state === "recover") return { y: 0, squash: 0.4, stride: 0, tuck: 0, hot: false, glow: 0.2 };
  const step = Math.floor(time * 10) % 2;
  return { y: step ? -0.5 : 0, squash: 0, stride: step ? 1 : -1, tuck: 0, hot: false, glow: 0 };
}

function legs(s: SpriteCanvas, p: MitePose, near: boolean, color: number): void {
  HIPS.forEach((hx, i) => {
    const swing = (i % 2 ? -p.stride : p.stride) * (near ? 1 : -1);
    const hip: Pt = [hx + (near ? 0.5 : -0.5), -3.2 + p.y + p.squash];
    const reach = (hx - 0.5) * 1.5 + swing;
    const knee: Pt = [hip[0] + reach * 0.6 - (p.tuck ? 0 : 0.5), hip[1] - 1.6 + p.tuck * 1.5];
    const foot: Pt = p.tuck ? [hip[0] + reach * 0.4, hip[1] + 1.4] : [hip[0] + reach, 0];
    s.taper(hip[0], hip[1], knee[0], knee[1], 0.7, 0.55, color);
    s.taper(knee[0], knee[1], foot[0], foot[1], 0.55, 0.35, color);
  });
}

export function drawUmbramite(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = poseOf(e, time);
  const H = hideOf(e.seed);
  const y = p.y + p.squash;
  s.clear();
  s.begin();
  legs(s, p, false, H.deep);
  s.commit(false);
  s.begin();
  s.dot(-1.5, -5.2 + y, 4.2 - p.squash * 0.2, H.body);
  s.dot(1.2, -4.4 + y, 3.2, H.body);
  s.shadeEdges(H.body, H.sheen, H.dark, 2);
  const pulse = Math.sin(time * 4) > 0.2 ? VOID[3] : VOID[2];
  const crack = p.hot ? VOID[5] : pulse;
  s.hairline(-4.2, -4.2 + y, -2.6, -2.6 + y, p.glow > 0.3 ? VOID[4] : VOID[1]);
  s.hairline(-3.9, -4 + y, -2.9, -3 + y, crack);
  s.hairline(-1.4, -2 + y, -0.2, -3.2 + y, crack);
  s.commit();
  s.begin();
  s.dot(-2, -7 + y, 3, AC.plate);
  s.shadeEdges(AC.plate, AC.plateLight, AC.plateDark);
  s.hairline(-3.5, -8.2 + y, -0.4, -9 + y, AC.plateDark);
  s.set(-3, -8.8 + y, AC.plateGlint);
  s.set(-0.5, -9.6 + y, AC.plateGlint);
  s.commit();
  s.begin();
  s.dot(3.8, -4.6 + y, 2.4, H.body);
  s.shadeEdges(H.body, H.sheen, H.dark);
  fang(s, [4.8, -2.8 + y], [6.6 + p.glow, -1.6 + y], 0.9, AC.claw);
  fang(s, [3.4, -2.6 + y], [4.6, -0.9 + y], 0.8, AC.clawDark);
  s.commit();
  s.begin();
  s.dot(4.4, -5.2 + y, 1.4, p.hot ? AC.eyeHot : AC.eye);
  s.block(3.9, -4.6 + y, p.hot ? AC.eye : AC.eyeDim, 1.2, 0.6);
  s.set(4.6, -5.6 + y, AC.pupil);
  s.set(4.6, -5.1 + y, AC.pupil);
  s.commit();
  s.begin();
  legs(s, p, true, H.dark);
  s.shadeEdges(H.dark, H.body, H.deep);
  s.commit();
  sunRim(s, AC.rim, AC.rimSoft);
  if (p.hot) glowEye(s, 4.4, -5.6 + y, AC.eyeHot, AC.eye, AC.eyeHot);
  s.outline(AC.outline);
  return s;
}
