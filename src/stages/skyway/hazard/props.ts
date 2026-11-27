import { GROUND, RES, W } from "../../../constants/stage";
import { fleck, hairline, line, polygon, px, shade } from "../../../engine/frame";
import { stageExitX, stagePlatforms, stageWalls } from "../../../game/adventure";
import type { Platform } from "../../../types/world";
import { grain } from "../../../utils/grain";
import { lerp } from "../../../utils/math";
import { SKYWAY_COLORS as S } from "../scene/palette";
import { rampDither } from "../scene/picture";
import { breezeNow } from "../wind";
import { gustClock, gustDirection, gustStrength, gustWarning } from "./gusts";
import { rodX } from "./rods";

const SLAB_DEPTH = 9;
const BANNER = { every: 150, first: 96, pole: 26, wallPole: 14, length: 13, width: 5 } as const;
const CALM_DIR = -1;

interface Banner {
  x: number;
  y: number;
  pole: number;
}

let bannersFor = -1;
let banners: Banner[] = [];

function placeBanners(): Banner[] {
  const exit = stageExitX();
  if (bannersFor === exit) return banners;
  bannersFor = exit;
  const walls = stageWalls();
  const out: Banner[] = [];
  for (let x = BANNER.first; x < exit - 40; x += BANNER.every) {
    const bx = x + Math.round((grain(x, 5) - 0.5) * 40);
    const blocked = walls.some((w) => bx > w.x0 - 6 && bx < w.x1 + 6);
    if (!blocked) out.push({ x: bx, y: GROUND, pole: BANNER.pole });
  }
  for (const wall of walls) {
    const x = rodX(wall) - 7 > wall.x0 + 2 ? wall.x0 + 3 : wall.x1 - 3;
    out.push({ x, y: wall.y, pole: BANNER.wallPole });
  }
  banners = out;
  return out;
}

function underside(p: Platform): void {
  const width = p.x1 - p.x0;
  const depth = Math.min(16, 5 + width * 0.22);
  const top = p.y + SLAB_DEPTH - 1;
  shade(p.x0 + 1, top, p.x1 - 1, top + depth, (x, y, out) => {
    const u = (x - p.x0) / width;
    const reach = (1 - Math.abs(u * 2 - 1) ** 1.5) * depth * (0.7 + grain(Math.floor(x * 0.4), p.x0) * 0.4);
    const v = y - top;
    if (v > reach || u < 0.02 || u > 0.98) return;
    const ix = Math.floor(x * RES);
    const iy = Math.floor(y * RES);
    const lit = 0.25 + u * 0.4 - (v / depth) * 0.25 + (grain(ix, iy) - 0.5) * 0.12;
    out.c = v > reach - 0.8 ? S.island[0] : rampDither(S.island, lit, ix, iy);
  });
  for (let k = 0; k < width / 9; k++) {
    const rx = p.x0 + 5 + k * 9 + grain(k, p.x0) * 4;
    const len = 4 + grain(p.x0, k) * 7;
    const sway = Math.sin(gustClock() * 2 + k) * 0.6;
    hairline(rx, top + 2, rx + sway, top + depth * 0.5 + len, S.islandGrass[1]);
    fleck(rx + sway, top + depth * 0.5 + len, S.islandGrass[2]);
  }
}

function windOn(): { dir: number; force: number } {
  const breeze = breezeNow();
  if (breeze) return breeze;
  const blow = gustStrength();
  const warn = gustWarning();
  if (blow > 0) return { dir: gustDirection(), force: 0.6 + blow * 0.4 };
  if (warn > 0) return { dir: gustDirection(), force: 0.25 + warn * 0.45 };
  return { dir: CALM_DIR, force: 0.18 };
}

function banner(b: Banner, t: number, wind: { dir: number; force: number }): void {
  const top = b.y - b.pole;
  line(b.x, b.y - 1, b.x, top, S.pole[1]);
  hairline(b.x + 0.5, b.y - 1, b.x + 0.5, top, S.pole[2]);
  line(b.x - 1, top, b.x + 1, top, S.pole[2]);
  px(b.x, top - 1, S.bannerGold);
  const rate = 4 + wind.force * 18;
  const flap = 0.25 + wind.force * 0.5;
  const stream = wind.dir > 0 ? 0 : Math.PI;
  let cx = b.x;
  let cy = top + 1;
  let px0 = -BANNER.width;
  let py0 = 0;
  for (let s = 0; s < BANNER.length; s++) {
    const k = s / BANNER.length;
    const wave = Math.sin(t * rate - s * 0.7 + b.x);
    const angle = lerp(Math.PI / 2, stream, Math.min(1, wind.force * 1.25)) + wave * flap * k;
    const nx = cx + Math.cos(angle);
    const ny = cy + Math.sin(angle);
    const torn = k > 0.68 && grain(s, b.x) > 0.5;
    const wide = BANNER.width * (1 - k * 0.3) * (torn ? 0.5 : 1);
    const side = wind.dir > 0 ? 1 : -1;
    const perpX = -Math.sin(angle) * wide * side;
    const perpY = Math.cos(angle) * wide * side;
    const tone = wave > 0.45 ? 3 : wave < -0.45 ? 1 : 2;
    polygon(
      [
        [cx, cy],
        [nx, ny],
        [nx + perpX, ny + perpY],
        [cx + px0, cy + py0],
      ],
      S.banner[tone],
    );
    hairline(cx, cy, nx, ny, S.banner[tone + 1]);
    hairline(cx + px0, cy + py0, nx + perpX, ny + perpY, S.banner[0]);
    if (s === 1) hairline(cx, cy, cx + px0, cy + py0, S.bannerGold);
    if (s === Math.floor(BANNER.length * 0.4)) fleck(cx + px0 * 0.5, cy + py0 * 0.5, S.bannerGold);
    px0 = perpX;
    py0 = perpY;
    cx = nx;
    cy = ny;
  }
}

export function drawProps(cameraX: number, t: number): void {
  const visible = (x0: number, x1: number) => x1 >= cameraX - 20 && x0 <= cameraX + W + 20;
  for (const p of stagePlatforms()) if (visible(p.x0, p.x1)) underside(p);
  const wind = windOn();
  for (const b of placeBanners()) if (visible(b.x - 16, b.x + 16)) banner(b, t, wind);
}
