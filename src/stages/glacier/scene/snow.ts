import { H, W } from "../../../constants/stage";
import { fleck, glow, place, px } from "../../../engine/frame";
import { stageCameraX } from "../../../game/adventure";
import { grain } from "../../../utils/grain";
import { GLACIER as G } from "../colors";
import { auroraColor } from "./tone";

const FLAKES = Array.from({ length: 54 }, (_, i) => ({
  x: grain(i, 1) * W,
  y: grain(i, 2) * H,
  fall: 6 + grain(i, 3) * 10,
  sway: 2 + grain(i, 4) * 5,
  near: grain(i, 5) > 0.7,
}));

const DUST = Array.from({ length: 18 }, (_, i) => ({
  x: grain(i, 21) * W,
  y: grain(i, 22) * 140,
  rate: 1 + grain(i, 23) * 2,
}));

const wrap = (v: number, span: number): number => ((v % span) + span) % span;

export function drawSnow(t: number, k: number, arena: boolean): void {
  place();
  const camera = arena ? 0 : stageCameraX();
  for (const f of FLAKES) {
    const depth = f.near ? 1 : 0.55;
    const x = wrap(f.x - camera * depth + Math.sin(t * 0.8 + f.y) * f.sway + t * 3, W + 8) - 4;
    const y = wrap(f.y + t * f.fall * depth, H + 6) - 3;
    if (f.near) {
      px(x, y, G.snow[4], 0.85);
      fleck(x + 0.5, y + 0.5, G.glint);
    } else fleck(x, y, G.snow[2], 0.8);
  }
  const tint = auroraColor(k, 1);
  for (const d of DUST) {
    const twinkle = Math.sin(t * d.rate * 2.3 + d.x);
    if (twinkle < 0.6) continue;
    const x = wrap(d.x - camera * 0.4 + t * 2, W);
    fleck(x, d.y + Math.sin(t + d.x) * 3, G.glint, (twinkle - 0.6) * 2.5);
    glow(x, d.y, 3, tint, 0.12);
  }
}
