import { GROUND } from "../../../constants/stage";
import { fleck, glow, hairline, px } from "../../../engine/frame";
import { grain } from "../../../utils/grain";
import { FORGE } from "../colors";
import type { VentState } from "./cycle";

const M = FORGE.molten;
const I = FORGE.iron;
const HALF = 5;
const JET_MARK = 48;

export function drawVentGrate(x: number, v: VentState, t: number): void {
  const heat = v.height > 0 ? 1 : v.warning;
  for (let row = 0; row < 3; row++) {
    const y = GROUND - 0.5 - row;
    const reach = HALF + 2 - row * 0.5;
    hairline(x - reach, y, x + reach, y, row === 2 ? I[4] : row === 1 ? I[3] : I[1]);
  }
  hairline(x - HALF - 1.5, GROUND - 2.5, x - HALF - 1.5, GROUND, I[2]);
  hairline(x + HALF + 1.5, GROUND - 2.5, x + HALF + 1.5, GROUND, I[0]);
  const slot = heat > 0.6 ? M[5] : heat > 0.2 ? M[4] : M[2 + (Math.sin(t * 2 + x) > 0.6 ? 1 : 0)];
  hairline(x - HALF + 0.5, GROUND - 2.5, x + HALF - 0.5, GROUND - 2.5, slot);
  for (let i = -HALF + 1; i < HALF; i += 2) fleck(x + i, GROUND - 2.5, I[0]);
  fleck(x - HALF - 1, GROUND - 3, FORGE.ironGlint);
  glow(x, GROUND - 2, 6 + heat * 10, M[2], 0.18 + heat * 0.4 + Math.sin(t * 3 + x) * 0.04);
}

export function drawVentWarning(x: number, v: VentState, t: number): void {
  if (v.warning <= 0) return;
  const k = v.warning;
  const jitter = Math.sin(t * 60 + x) * k;
  for (let i = 0; i < 5; i++) {
    const rise = (t * (3 + i) + grain(i, x)) % 1;
    fleck(
      x + (grain(i, 2) - 0.5) * 8 + jitter * 0.5,
      GROUND - 3 - rise * 10 * k,
      rise < 0.4 ? M[5] : M[3],
      (1 - rise) * k,
    );
  }
  if (k > 0.6) {
    hairline(x - 2 + jitter, GROUND - 1, x + 2 + jitter, GROUND - 1, M[4]);
    for (let y = 0; y < JET_MARK; y += 4)
      fleck(x + jitter * 0.3, GROUND - 6 - y, M[2], (k - 0.6) * 1.5 * (1 - y / JET_MARK));
  }
}

export function drawVentJet(x: number, v: VentState, t: number): void {
  const h = v.height;
  if (h < 1) return;
  for (let y = 0; y < h; y += 0.5) {
    const u = y / h;
    const sway = Math.sin(t * 34 + y * 0.35) * 0.8 * u;
    const w = 3.2 - u * 1.2 + Math.sin(t * 50 + y) * 0.35;
    const cx = x + sway;
    hairline(cx - w - 0.8, GROUND - y, cx + w + 0.8, GROUND - y, M[1]);
    hairline(cx - w, GROUND - y, cx + w, GROUND - y, M[2]);
    hairline(cx - w * 0.65, GROUND - y, cx + w * 0.65, GROUND - y, M[3]);
    hairline(cx - w * 0.3, GROUND - y, cx + w * 0.3, GROUND - y, u < 0.7 ? M[5] : M[4]);
  }
  for (let i = 0; i < 6; i++) {
    const a = grain(i, 3) * Math.PI;
    const r = ((t * 4 + grain(i, 4)) % 1) * 10;
    px(x + Math.cos(a) * r * (i % 2 ? 1 : -1), GROUND - h - Math.sin(a) * r * 0.6 + r * 0.3, i % 3 ? M[4] : M[3]);
  }
  hairline(x - 6, GROUND - 0.5, x + 6, GROUND - 0.5, M[4]);
  glow(x, GROUND - h * 0.5, 22, M[3], 0.5);
  glow(x, GROUND - h, 10, M[4], 0.35);
}
