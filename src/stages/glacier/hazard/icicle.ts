import { ellipseRing, fleck, glow, hairline, place, polygon, px } from "../../../engine/frame";
import { fxRng, particles } from "../../../game/state";
import { shake } from "../../../game/world";
import { sfx } from "../../../services/audio";
import { PK } from "../../../types/particle";
import { GLACIER as G } from "../colors";

export const ICICLE = { length: 26, half: 5.4, gravity: 760, shake: 0.7, hitHalf: 3 } as const;

export function drawIcicle(x: number, top: number, grown: number, tremble: number): void {
  if (grown <= 0) return;
  const len = ICICLE.length * grown;
  const half = ICICLE.half * Math.min(1, grown * 1.4);
  place(x + tremble, top);
  glow(0, len * 0.5, 12, G.ice[5], 0.18 * grown);
  polygon(
    [
      [-half, 0],
      [half, 0],
      [half * 0.55, len * 0.45],
      [0.4, len],
      [-half * 0.5, len * 0.4],
    ],
    G.ice[3],
  );
  polygon(
    [
      [0.2, 0],
      [half, 0],
      [half * 0.55, len * 0.45],
      [0.4, len],
    ],
    G.ice[5],
  );
  hairline(-half, 0.5, -half * 0.5, len * 0.4, G.outline);
  hairline(-half * 0.5, len * 0.4, 0.2, len, G.ice[1]);
  hairline(half, 0.5, half * 0.55, len * 0.45, G.ice[7]);
  hairline(0.6, 1, 0.5, len * 0.8, G.ice[6]);
  fleck(0.4, len - 0.5, G.glint);
  px(-half - 1, -1, G.snow[3]);
  px(-1, -1, G.snow[4]);
  px(half - 0.5, -1, G.snow[2]);
  place();
}

export function drawMark(x: number, y: number, progress: number, tint: number): void {
  place(x, y);
  const r = 3 + progress * 5;
  ellipseRing(0, 0, r, r * 0.3, tint, 0.35 + progress * 0.55);
  ellipseRing(0, 0, 9 - progress * 5, 1.4, G.ice[6], progress);
  glow(0, -1, 10, tint, 0.15 + progress * 0.25);
  place();
}

export function drawFallPath(x: number, top: number, bottom: number, progress: number): void {
  place(x, 0);
  for (let y = top; y < bottom; y += 6) fleck(0, y + ((progress * 12) % 6), G.ice[6], 0.25 * progress);
  place();
}

export function shatter(x: number, y: number): void {
  for (let i = 0; i < 12; i++)
    particles.spawn(PK.SHARD, x, y - 2, fxRng.range(-90, 90), -fxRng.range(60, 180), fxRng.range(0.35, 0.7), {
      col: fxRng.pick([G.ice[4], G.ice[6], G.ice[7], G.snow[3]]),
      size: fxRng.range(1, 2.4),
    });
  for (let i = 0; i < 6; i++)
    particles.spawn(
      PK.FLAKE,
      x + fxRng.range(-6, 6),
      y - fxRng.range(0, 6),
      fxRng.range(-20, 20),
      -fxRng.range(5, 30),
      0.8,
      {
        col: G.snow[4],
      },
    );
  shake(0.08, 1.2);
  sfx.shatter();
}
