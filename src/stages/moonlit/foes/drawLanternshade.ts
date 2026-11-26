import { detailCanvas, type SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { mix } from "../../../utils/color";
import { SHADE_COLORS as C } from "./shadeColors";
import { flareOf, lanternAt } from "./shadePose";

const canvas = detailCanvas(48, 52, 24, 24);
const HOOD: readonly (readonly [number, number])[] = [
  [-7, -3],
  [-5.5, -9],
  [-2, -12.5],
  [2.5, -12],
  [6, -8],
  [6.5, -2],
  [7, 5],
  [3, 8],
  [-3, 8.5],
  [-7.5, 5],
];

function tatters(s: SpriteCanvas, time: number, limp: boolean, ahead: number): void {
  s.begin();
  for (let k = 0; k < 4; k++) {
    const x0 = -5 + k * 3.2;
    const wave = limp ? 0 : Math.sin(time * 4 + k * 1.7);
    const x1 = x0 - 2 - ahead * 5 + wave * 1.8;
    const y1 = 15 + (k % 2) * 3 - (limp ? 2 : 0);
    s.taper(x0, 6, x1, y1, 2.2, 0.4, C.tatter, wave);
  }
  s.shadeEdges(C.tatter, C.cloak, C.cloakDeep);
  s.commit(false);
}

function cloak(s: SpriteCanvas, time: number): void {
  s.begin();
  s.poly(HOOD, C.cloak);
  s.dot(-1, -1, 6.5, C.cloak);
  s.shadeEdges(C.cloak, C.cloakLight, C.cloakDark, 2);
  for (let y = -11; y <= 6; y += 0.5) {
    const x = y < -8 ? 3 + (y + 11) * 1 : 6.5 + Math.max(0, y) * 0.07;
    s.set(x - 0.5, y, y < -2 ? C.rim : mix(C.rim, C.cloakLight, 0.5));
  }
  s.hairline(-3, -2, -4.5, 7, C.cloakDark);
  s.hairline(0.5, 0, 0, 8, C.cloakDark);
  s.hairline(3.5, 1, 4, 7.5, C.cloakDark);
  const breath = Math.sin(time * 2) * 0.3;
  s.dot(2.2, -6.5 + breath, 3.4, C.hollow);
  s.commit();
}

function mask(s: SpriteCanvas, flare: number, limp: boolean, time: number): void {
  const breath = Math.sin(time * 2) * 0.3;
  s.begin();
  s.dot(2.8, -6.3 + breath, 2.2, C.mask);
  s.dot(3.4, -4.6 + breath, 1.3, C.mask);
  s.shadeEdges(C.mask, C.maskLight, C.maskShade);
  const eye = limp ? C.maskShade : flare > 0.3 ? C.flameCore : C.flame;
  s.block(2, -7.2 + breath, C.hollow, 1, 1.5);
  s.block(3.8, -7.2 + breath, C.hollow, 1, 1.5);
  s.set(2.5, -6.5 + breath, eye);
  s.set(4.3, -6.5 + breath, eye);
  s.hairline(2.8, -4.2 + breath, 3.8, -4.4 + breath, C.maskShade);
  s.commit();
}

function lantern(s: SpriteCanvas, lx: number, ly: number, flare: number, time: number): void {
  s.begin();
  s.taper(3, -1, lx - 1, ly - 5, 1.4, 0.9, C.cloakDark, -0.6);
  s.dot(lx - 0.8, ly - 5.2, 1.1, C.maskShade);
  s.shadeEdges(C.cloakDark, C.cloak, C.cloakDeep);
  s.commit();
  s.begin();
  s.hairline(lx - 0.5, ly - 5, lx, ly - 3.5, C.brassLight);
  s.block(lx - 2, ly - 3.5, C.brass, 4, 1);
  s.block(lx - 2, ly + 2, C.brass, 4, 1);
  s.block(lx - 2, ly - 2.5, C.brassDark, 0.5, 4.5);
  s.block(lx + 1.5, ly - 2.5, C.brassDark, 0.5, 4.5);
  const glassColor = flare > 0.5 ? C.flameLight : mix(C.glass, C.flame, flare * 2);
  s.block(lx - 1.5, ly - 2.5, glassColor, 3, 4.5);
  s.set(lx - 2, ly - 3.5, C.brassLight);
  s.set(lx - 1.5, ly + 2, C.brassLight);
  const lick = Math.sin(time * 17) * 0.4;
  const tall = 1.2 + flare * 1.6;
  s.dot(lx, ly + 0.5, 0.9 + flare * 0.5, flare > 0.6 ? C.flameCore : C.flame);
  s.taper(lx, ly + 0.5, lx + lick, ly + 0.5 - tall, 0.7, 0.2, flare > 0.6 ? C.flameCore : C.flameLight);
  s.commit();
}

export function drawLanternshade(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const limp = e.stun > 0 || e.air;
  const flare = flareOf(e);
  const ahead = limp ? 0 : Math.max(-1, Math.min(1, (e.vx * e.face) / 60));
  const [wx, wy] = lanternAt(e, t);
  const lx = (wx - e.x) * e.face;
  const ly = wy - e.y + (limp ? 4 : 0);
  s.clear();
  tatters(s, time, limp, ahead);
  cloak(s, time);
  mask(s, flare, limp, time);
  lantern(s, lx, ly, flare, time);
  s.outline(C.outline);
  return s;
}
