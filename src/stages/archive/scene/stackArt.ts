import { GROUND } from "../../../constants/stage";
import type { Color } from "../../../types/color";
import { mix, scale } from "../../../utils/color";
import { Rng } from "../../../utils/rng";
import { SCENE } from "./palette";
import { paintBay } from "./shelfArt";

export const STACKS = {
  width: 640,
  parallax: 0.3,
  haze: 0.3,
  shade: 0.62,
  seed: 77,
  towers: [
    { x: 14, width: 40, top: 16 },
    { x: 226, width: 34, top: 30 },
    { x: 440, width: 44, top: 10 },
  ],
  desks: [
    { x: 104, width: 46 },
    { x: 318, width: 40 },
    { x: 540, width: 50 },
  ],
  ladders: [{ x: 278, top: 44 }],
} as const;

export interface Candle {
  x: number;
  y: number;
  phase: number;
}

export const CANDLES: readonly Candle[] = STACKS.desks.flatMap((d, i) => [
  { x: d.x + 6, y: GROUND - 25, phase: i * 1.7 },
  { x: d.x + d.width - 8, y: GROUND - 27, phase: i * 2.3 + 1 },
]);

interface Canvas {
  art: Uint32Array;
  put(x: number, y: number, c: Color): void;
}

function canvas(): Canvas {
  const art = new Uint32Array(STACKS.width * GROUND);
  const put = (x: number, y: number, c: Color) => {
    const wx = ((Math.round(x) % STACKS.width) + STACKS.width) % STACKS.width;
    const wy = Math.round(y);
    if (wy >= 0 && wy < GROUND) art[wy * STACKS.width + wx] = c;
  };
  return { art, put };
}

function tower(c: Canvas, r: Rng, x: number, width: number, top: number): void {
  paintBay({ width: STACKS.width, put: c.put }, r, { x0: x, x1: x + width, top, bottom: GROUND, shelf: 13, arch: 10 });
  for (let y = top - 12; y < top - 9; y++)
    for (let xx = x + width / 2 - 2; xx <= x + width / 2 + 2; xx++) c.put(xx, y, SCENE.wood[3]);
  c.put(x + width / 2, top - 13, SCENE.gilt);
}

function desk(c: Canvas, r: Rng, x: number, width: number): void {
  const top = GROUND - 20;
  for (let y = top; y < GROUND; y++)
    for (let xx = x; xx < x + width; xx++) {
      const slab = y < top + 3;
      const leg = xx - x < 5 || x + width - xx <= 5;
      if (!slab && !leg) continue;
      let col = slab ? SCENE.stone[3] : SCENE.stone[2];
      if (y === top) col = SCENE.stone[4];
      if (xx === x + width - 1 || (leg && x + width - xx === 5)) col = SCENE.stone[1];
      c.put(xx, y, col);
    }
  for (let xx = x + 5; xx < x + width - 5; xx++) c.put(xx, top + 3, SCENE.stone[0]);
  let at = x + 10;
  while (at < x + width - 14) {
    const h = r.int(2, 4);
    const w = r.int(7, 10);
    for (let k = 0; k < h; k++) {
      const cover = r.pick(SCENE.spines);
      const shift = r.int(-1, 1);
      for (let i = 0; i < w; i++) c.put(at + i + shift, top - 1 - k * 2, i === w - 1 ? scale(cover, 1.3) : cover);
      for (let i = 1; i < w - 1; i++) c.put(at + i + shift, top - 2 - k * 2, SCENE.page[2]);
    }
    at += w + r.int(3, 6);
  }
  const open = x + width / 2 - 6;
  for (let i = 0; i < 12; i++) {
    const lift = i < 6 ? (6 - i) * 0.4 : (i - 5) * 0.4;
    c.put(open + i, top - 1 - Math.round(lift), i === 6 ? SCENE.page[1] : SCENE.page[3]);
    c.put(open + i, top - Math.round(lift), SCENE.page[2]);
  }
}

function candleStick(c: Canvas, candle: Candle): void {
  for (let y = candle.y + 1; y < GROUND - 20; y++) {
    c.put(candle.x, y, SCENE.candle);
    c.put(candle.x + 1, y, scale(SCENE.candle, 0.7));
  }
  c.put(candle.x - 1, GROUND - 21, SCENE.brass[2]);
  c.put(candle.x + 2, GROUND - 21, SCENE.brass[1]);
}

function ladder(c: Canvas, x: number, top: number): void {
  for (let y = top; y < GROUND; y++) {
    const lean = -(GROUND - y) * 0.14;
    c.put(x + lean, y, SCENE.wood[3]);
    c.put(x + 8 + lean, y, SCENE.wood[4]);
    if ((y - top) % 7 === 0) for (let i = 1; i < 8; i++) c.put(x + lean + i, y, SCENE.wood[2]);
  }
}

let built: Uint32Array | null = null;

export function stackArt(): Uint32Array {
  if (built) return built;
  const c = canvas();
  const r = new Rng(STACKS.seed);
  for (const t of STACKS.towers) tower(c, r, t.x, t.width, t.top);
  for (const l of STACKS.ladders) ladder(c, l.x, l.top);
  for (const d of STACKS.desks) desk(c, r, d.x, d.width);
  for (const candle of CANDLES) candleStick(c, candle);
  for (let i = 0; i < c.art.length; i++)
    if (c.art[i]) c.art[i] = mix(scale(c.art[i], STACKS.shade), SCENE.deepHaze, STACKS.haze) || 1;
  built = c.art;
  return c.art;
}
