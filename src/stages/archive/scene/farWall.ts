import { GROUND, W } from "../../../constants/stage";
import type { Color } from "../../../types/color";
import { Rng } from "../../../utils/rng";
import { SCENE } from "./palette";
import { paintBay } from "./shelfArt";

export type Hall = "reading" | "stacks" | "rotunda";

export const hallAt = (k: number): Hall => (k < 0.25 ? "reading" : k < 0.75 ? "stacks" : "rotunda");

export const FAR_WALL = { balcony: 100, seed: 41 } as const;
const COLONNADE = { every: 46, width: 9, top: 34, spring: 58, capital: 4 } as const;
const DOME = { ribs: 7 } as const;

const S = SCENE.stone;
const built = new Map<Hall, Uint32Array>();

type Put = (x: number, y: number, c: Color) => void;

function canvas(art: Uint32Array): Put {
  return (x, y, c) => {
    const ax = Math.round(x);
    const ay = Math.round(y);
    if (ax >= 0 && ax < W && ay >= 0 && ay < GROUND) art[ay * W + ax] = c;
  };
}

function balcony(put: Put, y: number): void {
  for (let x = 0; x < W; x++) {
    put(x, y - 1, S[3]);
    put(x, y, S[2]);
    put(x, y + 1, S[1]);
    put(x, y + 2, S[0]);
    for (let k = 2; k < 8; k++) if (x % 4 === 0) put(x, y - k, k === 7 ? S[3] : S[2]);
    put(x, y - 8, S[3]);
  }
}

function tier(
  put: Put,
  r: Rng,
  top: number,
  bottom: number,
  bay: number,
  shelf: number,
  arch: number,
  shift: number,
): void {
  for (let x0 = -shift; x0 < W; x0 += bay)
    paintBay({ width: W, put }, r, { x0, x1: x0 + bay - 3, top, bottom, shelf, arch });
}

function column(put: Put, x: number, top: number): void {
  const { width, capital } = COLONNADE;
  for (let y = top; y < GROUND; y++)
    for (let i = 0; i < width; i++) {
      const cap = y < top + capital;
      const reach = cap ? width + 2 : width;
      const u = cap ? i - 1 : i;
      let c = u === reach - 1 ? S[4] : u === 0 ? S[1] : (u + y) % 5 === 0 ? S[2] : S[3];
      if (cap && y === top) c = S[4];
      put(x + u, y, c);
    }
  put(x + width, top + capital, S[0]);
}

function archBetween(put: Put, x0: number, x1: number, spring: number): void {
  const mid = (x0 + x1) / 2;
  const half = (x1 - x0) / 2;
  for (let x = x0; x <= x1; x++) {
    const u = (x - mid) / half;
    const y = spring - Math.sqrt(Math.max(0, 1 - u * u)) * half * 0.7;
    for (let k = 0; k < 4; k++) put(x, y - k, k === 0 ? S[1] : k === 3 ? S[4] : S[3]);
  }
}

function dome(put: Put): void {
  for (let i = 0; i < DOME.ribs; i++) {
    const foot = (i / (DOME.ribs - 1)) * W;
    for (let y = 0; y < COLONNADE.top; y++) {
      const v = y / COLONNADE.top;
      const x = W / 2 + (foot - W / 2) * Math.sqrt(v) + (i - 3) * 2;
      put(x, y, S[2]);
      put(x + 1, y, S[3]);
    }
  }
  for (let x = 0; x < W; x++) {
    put(x, COLONNADE.top - 2, S[3]);
    put(x, COLONNADE.top - 1, S[1]);
  }
}

function rotunda(put: Put, r: Rng): void {
  dome(put);
  const { every, width, top, spring } = COLONNADE;
  tier(put, r, 104, GROUND, 23, 11, 4, 4);
  for (let x = -4; x < W; x += every) {
    column(put, x, top);
    archBetween(put, x + width, x + every, spring);
  }
  balcony(put, 96);
}

function paint(hall: Hall): Uint32Array {
  const art = new Uint32Array(W * GROUND);
  const put = canvas(art);
  const r = new Rng(FAR_WALL.seed + hall.length);
  if (hall === "reading") {
    tier(put, r, 62, 98, 30, 9, 8, 6);
    balcony(put, FAR_WALL.balcony);
    tier(put, r, 112, GROUND, 30, 11, 6, 18);
  } else if (hall === "stacks") {
    tier(put, r, 30, 64, 22, 8, 5, 2);
    balcony(put, 70);
    tier(put, r, 80, 110, 22, 8, 5, 12);
    balcony(put, 116);
    tier(put, r, 126, GROUND, 22, 9, 4, 7);
  } else rotunda(put, r);
  return art;
}

export function farWallArt(hall: Hall): Uint32Array {
  const known = built.get(hall);
  if (known) return known;
  const art = paint(hall);
  built.set(hall, art);
  return art;
}
