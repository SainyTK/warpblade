import { GROUND } from "../../../constants/stage";
import { SPELL_IMPACT_TIME } from "../../../drill/constants";
import { disc, ellipseRing, fleck, glow, hairline, place, px } from "../../../engine/frame";
import type { ElementImpact } from "../../../types/drill";
import { WHITE } from "../../../utils/color";
import { clamp, ease, smooth, TAU } from "../../../utils/math";
import { BLIGHT } from "../colors";

const LOBES = 7;
const STREAKS = 10;
const LIFT = 11;

function seedPod(k: number, t: number): void {
  const r = 1.5 + k * 3;
  disc(0, 0, r + 1, BLIGHT.fungus[1], 0.8);
  disc(0, 0, r, BLIGHT.spore[2], 1);
  disc(-r * 0.3, -r * 0.35, r * 0.5, BLIGHT.spore[4], 1);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU + t * 6;
    const d = 12 * (1 - k) + r;
    fleck(Math.cos(a) * d, Math.sin(a) * d * 0.8, BLIGHT.spore[3], 0.5 + k * 0.5);
  }
  glow(0, 0, 8 + k * 10, BLIGHT.spore[2], 0.4 + k * 0.3);
}

function bloom(size: number, fade: number, progress: number): void {
  for (let i = 0; i < LOBES; i++) {
    const a = (i / LOBES) * TAU + 0.4;
    const d = size * 0.55;
    const lx = Math.cos(a) * d;
    const ly = Math.sin(a) * d * 0.7;
    const lr = size * 0.42 * (1 - progress * 0.3);
    disc(lx, ly + lr * 0.25, lr, BLIGHT.fungus[1], 0.5 * fade);
    disc(lx, ly, lr * 0.85, BLIGHT.spore[1], 0.6 * fade);
    disc(lx + lr * 0.2, ly - lr * 0.3, lr * 0.45, BLIGHT.spore[3], 0.6 * fade);
  }
  for (let i = 0; i < STREAKS; i++) {
    const a = (i / STREAKS) * TAU + 0.15;
    const r0 = size * 0.4;
    const r1 = size * (1.05 + (i % 3) * 0.15);
    const x1 = Math.cos(a) * r1;
    const y1 = Math.sin(a) * r1 * 0.8;
    hairline(Math.cos(a) * r0, Math.sin(a) * r0 * 0.8, x1, y1, i % 2 ? BLIGHT.spore[3] : BLIGHT.fungus[3], fade);
    px(x1 - 0.5, y1 - 0.5, i % 2 ? BLIGHT.spore[4] : BLIGHT.fungus[4], fade);
  }
  ellipseRing(0, 0, size, size * 0.7, BLIGHT.spore[3], fade * 0.7);
}

export function drawSporeburstImpact(blast: ElementImpact): void {
  const { x, y, age, spell, fromSword } = blast;
  const cy = y > GROUND - 4 ? y - LIFT : y;
  place(x, cy);
  if (!fromSword && age < spell.delay) {
    seedPod(clamp(age / spell.delay), age);
    place();
    return;
  }
  const start = fromSword ? 0 : spell.delay;
  const progress = clamp((age - start) / (SPELL_IMPACT_TIME - start));
  const fade = 1 - smooth(0.2, 1, progress);
  const size = (4 + ease.outCubic(progress) * spell.radius * 0.85) * (fromSword ? 0.5 : 1);
  bloom(size, fade, progress);
  if (progress < 0.3) {
    const flash = 1 - progress / 0.3;
    disc(0, 0, 5 * flash + 1, WHITE, flash);
    disc(0, 0, 8 * flash + 2, BLIGHT.spore[4], 0.7 * flash);
  }
  glow(0, 0, 14 + size, BLIGHT.spore[2], 0.7 * fade);
  place();
}
