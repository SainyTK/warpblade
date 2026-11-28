import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { RAIN_FOES as C } from "../../../../game/enemies/rain/colors";
import { glint } from "../../../../game/enemies/rain/detail";
import type { Enemy } from "../../../../types/enemy";
import { mix, WHITE } from "../../../../utils/color";
import { clamp } from "../../../../utils/math";
import { rearTime } from "./timing";

const canvas = detailCanvas(30, 26, 15, 13);

function wings(s: SpriteCanvas, time: number, still: boolean): void {
  const beat = still ? 0.4 : Math.sin(time * 70);
  const up = -3.2 - beat * 1.6;
  s.begin();
  s.taper(-0.4, -1.8, -3.6, up - 1.4, 0.4, 1.5, C.wetSkyDim, -0.6);
  s.taper(0.4, -1.8, 2.4, up - 1.8, 0.4, 1.7, C.water, 0.6);
  s.shadeEdges(C.water, WHITE, C.wetSkyDim);
  s.shadeEdges(C.wetSkyDim, C.water, C.kiteLight);
  s.hairline(0.4, -1.8, 2.1, up - 2.2, C.kiteRim);
  s.commit(false);
}

function legs(s: SpriteCanvas, dangle: number): void {
  s.begin();
  for (const [x, k] of [
    [-1.6, 1],
    [-0.4, 0.8],
    [0.8, 0.6],
  ] as const) {
    s.hairline(x, 0.6, x - 0.8 * k - dangle, 2.4 + k, C.kiteDeep);
    s.hairline(x - 0.8 * k - dangle, 2.4 + k, x - 1.2 * k - dangle, 3.6 + k, C.kiteDeep);
  }
  s.commit(false);
}

function body(s: SpriteCanvas, glow: number, lean: number, time: number): void {
  const belly = mix(C.kiteVein, WHITE, glow * 0.6);
  s.begin();
  s.taper(-1.2, -0.2, -5.6, 1.8 + lean, 2.2, 1.2, C.kite, 0.4);
  s.shadeEdges(C.kite, C.kiteLight, C.kiteDark, 2);
  for (let i = 1; i <= 3; i++) s.hairline(-1.6 - i * 1.1, -1.6 + i * 0.4, -1.8 - i * 1.1, 1.6 + i * 0.5, C.kiteDeep);
  const pulse = glow > 0 || Math.sin(time * 4) > 0.3;
  s.dot(-4.2, 1.6 + lean * 0.8, 1.1, pulse ? belly : C.veinDeep);
  if (pulse) s.set(-4.4, 1.3 + lean * 0.8, C.veinHot);
  s.dot(0.6, -0.6, 2, C.kite);
  s.shadeEdges(C.kite, C.kiteLight, C.kiteDark);
  s.dot(2.6, -0.2, 1.5, C.kiteDark);
  s.shadeEdges(C.kiteDark, C.kite, C.kiteDeep);
  glint(s, 0, -2.2, C.kiteGlint);
  s.hairline(-1, -2.4, -4.8, -0.4, C.wetSky);
  s.commit();
}

function head(s: SpriteCanvas, glow: number, stab: number): void {
  s.begin();
  s.dot(3, -0.6, 1, C.wart);
  s.set(3.3, -0.9, glow > 0.5 ? WHITE : C.wartHot);
  s.hairline(3.6, 0.4, 6 + stab * 2, 1.8 + stab * 0.8, C.kiteDeep);
  s.hairline(4.6, 0.8, 5.8 + stab * 2, 1.6 + stab * 0.8, C.kiteRim);
  s.commit(false);
}

export function drawFenmidge(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const dazed = e.stagger > 0 || e.stun > 0 || e.air;
  const glow = e.state === "wind" ? clamp(e.st / rearTime()) : e.state === "dive" ? 1 : 0;
  const lean = e.state === "dive" ? -1.2 : glow * 1.2;
  s.clear();
  wings(s, time, dazed);
  legs(s, dazed ? 1 : e.state === "dive" ? -0.6 : Math.sin(time * 5) * 0.3);
  body(s, glow, dazed ? 1.4 : lean, time);
  head(s, glow, e.state === "dive" ? 1 : glow * 0.5);
  s.outline(C.outline);
  return s;
}
