// The crescent, its dotted trace and the light riding its head are adapted from Sprite Fusion's open-source slash
// (https://www.spritefusion.com/pixel-art-vfx/slash), MIT License, Copyright (c) 2026 Hugo Duprez.
import { PAL } from "../../constants/palette";
import { glow, place, px, shade } from "../../engine/frame";
import type { Effect, SlashShape } from "../../types/effect";
import { clamp, ease, smooth, TAU } from "../../utils/math";

type Slash = Required<SlashShape>;

function onArc(s: Slash, r: number, a: number): [number, number] {
  const lx = Math.cos(a) * r;
  const ly = Math.sin(a) * r * s.sy;
  const c = Math.cos(s.rot);
  const n = Math.sin(s.rot);
  return [s.cx + lx * c - ly * n, s.cy + lx * n + ly * c];
}

/** the smear: thickest just behind the leading edge, white on the rim while young, cooling down the ramp with age */
function crescent(s: Slash, tailAngle: number, L: number, width: number, age: number): void {
  if (Math.abs(L) < 0.02 || width < 0.3) return;
  const R = s.ramp;
  const n = R.length;
  const dir = Math.sign(L);
  const span = Math.abs(L);
  const c = Math.cos(s.rot);
  const sn = Math.sin(s.rot);
  const B = s.R + 2;
  shade(s.cx - B, s.cy - B, s.cx + B, s.cy + B, (x, y, out) => {
    const dx = x - s.cx;
    const dy = y - s.cy;
    const lx = dx * c + dy * sn;
    const ly = (-dx * sn + dy * c) / s.sy;
    const r = Math.hypot(lx, ly);
    if (r > s.R + 0.5 || r < s.R - width - 1) return;
    let u = (dir * (Math.atan2(ly, lx) - tailAngle)) % TAU;
    if (u < 0) u += TAU;
    if (u > span) return;
    const v = u / span;
    const w = width * Math.sin(Math.PI * v ** 2.2) ** 0.6;
    if (w < 0.35) return;
    const q = (s.R - r) / w;
    if (q < 0 || q > 1) return;
    const ci = q < 0.22 && age < 0.5 ? 0 : Math.round(q * (n - 1) * 0.75 + age * 2.4 - v * 0.8 + 0.4);
    out.c = R[n - 1 - clamp(ci, 0, n - 1)];
    out.a = Math.min(1, v / 0.4);
  });
  for (let u = 0; u <= span; u += 0.3) {
    const [x, y] = onArc(s, s.R - width * 0.4, tailAngle + dir * u);
    glow(x, y, 5 + width, R[n - 3], 0.22 * (1 - age) * (u / span));
  }
}

/** the edge whips out over `sweep`, holds, then the tail follows over `trail`, leaving a dotted trace */
export function createSlash(x: number, y: number, face: number, shape: SlashShape): Effect {
  const s: Slash = { t0: 0, sweep: 0.05, hold: 0.05, trail: 0.2, ramp: PAL.crystal, ...shape };
  const life = s.t0 + s.sweep + s.hold + s.trail + 0.25;
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < life;
    },
    draw() {
      place(x, y, face < 0);
      const u = t - s.t0;
      if (u < 0) return;
      const span = s.a1 - s.a0;
      const head = ease.outExpo(clamp(u / s.sweep));
      const tail = smooth(s.sweep + s.hold, s.sweep + s.hold + s.trail, u);
      const age = clamp(u / (s.sweep + s.hold + s.trail));
      if (tail < 1) crescent(s, s.a0 + span * tail, span * (head - tail), s.W * (1 - tail * 0.55), age);
      const trace = 0.7 * (1 - clamp((u - s.sweep - s.hold) / (s.trail + 0.2)));
      if (tail > 0.02 && trace > 0)
        for (let k = 0; k <= tail; k += 0.6 / (Math.abs(span) * s.R)) {
          const [ax, ay] = onArc(s, s.R - 0.5, s.a0 + span * k);
          px(ax, ay, s.ramp[1], trace * (0.4 + 0.6 * k));
        }
      if (u < 0.25) {
        const [hx, hy] = onArc(s, s.R - 4, s.a0 + span * head);
        glow(hx, hy, 34, s.ramp[3], 0.45 * (1 - u / 0.25));
      }
    },
  };
}
