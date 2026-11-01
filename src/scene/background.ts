import { WORLD_COLORS as WC } from "../constants/palette";
import { BRAZIERS, GROUND, H, MOON, N, PLATFORMS, W } from "../constants/stage";
import { bayerAt } from "../engine/frame";
import { mix, scale } from "../utils/color";
import { clamp } from "../utils/math";
import { Rng } from "../utils/rng";

const TOWERS: readonly (readonly [number, number, number])[] = [
  [14, 22, 70],
  [58, 14, 92],
  [96, 18, 60],
  [150, 26, 54],
  [196, 12, 88],
  [232, 20, 66],
  [292, 18, 80],
];
const CRATERS: readonly (readonly [number, number, number])[] = [
  [-4, -5, 3],
  [5, 2, 2.4],
  [-2, 6, 2],
  [6, -7, 1.5],
];

function sky(bg: Uint32Array, r: Rng): void {
  const S = WC.sky;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const v = clamp(y / 150) * (S.length - 1);
      const i = Math.floor(v);
      bg[y * W + x] = S[Math.min(S.length - 1, v - i > bayerAt(x, y) ? i + 1 : i)];
    }
  for (let i = 0; i < 90; i++) {
    const x = r.int(0, W - 1);
    const y = r.int(0, 110);
    bg[y * W + x] = mix(WC.starDim, WC.starBright, r.range(0.35, 1) * (1 - y / 140));
  }
}

/** a moon lit from the right with a few craters and a dithered halo */
function moon(bg: Uint32Array): void {
  const { x: mx, y: my, r: mr } = MOON;
  for (let y = my - 30; y <= my + 30; y++)
    for (let x = mx - 30; x <= mx + 30; x++) {
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const d = Math.hypot(x + 0.5 - mx, y + 0.5 - my);
      const i = y * W + x;
      if (d <= mr) {
        const lit = (x - mx + 6) / mr;
        let c = lit > -0.2 ? WC.moonLit : lit > -0.55 ? WC.moonMid : WC.moonDark;
        for (const [qx, qy, qr] of CRATERS)
          if (Math.hypot(x + 0.5 - mx - qx, y + 0.5 - my - qy) < qr) c = scale(c, 0.86);
        bg[i] = c;
      } else if (d <= mr + 1) bg[i] = WC.moonRim;
      else if (d < mr + 14 && ((mr + 14 - d) / 14) * 0.5 > bayerAt(x, y)) bg[i] = mix(bg[i], WC.moonHalo, 0.6);
    }
}

/** a far ridge, then ruined spires rim lit on the moon side, some windows still lit */
function skyline(bg: Uint32Array, r: Rng): void {
  for (let x = 0; x < W; x++) {
    const h = Math.floor(112 + Math.sin(x * 0.021) * 8 + Math.sin(x * 0.057 + 1.3) * 5 + Math.sin(x * 0.13) * 2);
    for (let y = h; y < GROUND; y++) bg[y * W + x] = y === h ? WC.ridgeTop : WC.ridge;
  }
  for (const [tx, tw, top] of TOWERS) {
    const broken = r.next() > 0.5;
    for (let x = tx; x < tx + tw && x < W; x++) {
      const roof = Math.floor(
        top + Math.abs(x - (tx + tw / 2)) * (broken ? 1.4 : 0.4) + (broken && x > tx + tw * 0.6 ? 10 : 0),
      );
      for (let y = roof; y < GROUND; y++)
        bg[y * W + x] = x >= tx + tw - 2 ? WC.towerRim : y === roof ? WC.towerTop : WC.tower;
    }
    for (let k = 0; k < 5; k++) {
      const wx = tx + r.int(2, tw - 4);
      const wy = top + r.int(8, 50);
      if (wy >= GROUND - 6) continue;
      const lit = r.chance(0.5);
      bg[wy * W + wx] = lit ? WC.windowLit : WC.windowDark;
      bg[(wy + 1) * W + wx] = lit ? WC.windowLow : WC.windowDark;
    }
  }
}

/** stone courses with a lit lip, moss along the top */
function ground(bg: Uint32Array, r: Rng): void {
  for (let y = GROUND; y < H; y++)
    for (let x = 0; x < W; x++) {
      const row = y - GROUND;
      const offset = Math.floor((row - 2) / 7) % 2 ? 8 : 0;
      let c = row === 0 ? WC.groundLip : row === 1 ? WC.groundEdge : WC.stone;
      if (row > 1 && ((row - 2) % 7 === 6 || (x + offset) % 16 === 0)) c = WC.mortar;
      else if (row > 1 && (row - 2) % 7 === 0) c = WC.stoneTop;
      if (row > 9) c = scale(c, 0.8);
      bg[y * W + x] = c;
    }
  for (let x = 0; x < W; x++) {
    if (!r.chance(0.18)) continue;
    const h = r.int(1, 3);
    for (let k = 1; k <= h; k++) bg[(GROUND - k) * W + x] = k === h ? WC.mossTip : WC.moss;
  }
}

/** stone slabs with hanging vines, and the iron braziers on them */
function platforms(bg: Uint32Array, r: Rng): void {
  for (const p of PLATFORMS) {
    for (let y = p.y; y < p.y + 9; y++)
      for (let x = p.x0; x <= p.x1; x++) {
        const row = y - p.y;
        let c = row === 0 ? WC.slabLip : row === 1 ? WC.slabEdge : row === 8 ? WC.slabUnder : WC.slab;
        if (row > 1 && row < 8 && (x - p.x0) % 12 === 0) c = WC.mortar;
        if (x === p.x0 || x === p.x1) c = WC.slabUnder;
        bg[y * W + x] = c;
      }
    for (let x = p.x0 + 2; x < p.x1 - 1; x++) {
      if (!r.chance(0.12)) continue;
      const L = r.int(2, 7);
      for (let k = 0; k < L; k++) bg[(p.y + 9 + k) * W + x] = k === L - 1 ? WC.mossTip : WC.vine;
    }
  }
  for (const b of BRAZIERS)
    for (let y = b.y - 6; y < b.y; y++)
      for (let x = b.x - 4; x <= b.x + 4; x++) {
        const row = y - (b.y - 6);
        const w = row < 2 ? 4 : row < 4 ? 3 : 1;
        if (Math.abs(x - b.x) > w) continue;
        bg[y * W + x] = row === 0 ? WC.ironLip : Math.abs(x - b.x) === w ? WC.ironEdge : WC.iron;
      }
}

/** the static night scene, built once */
export function buildBackground(): Uint32Array {
  const bg = new Uint32Array(N);
  const r = new Rng(5);
  sky(bg, r);
  moon(bg);
  skyline(bg, r);
  ground(bg, r);
  platforms(bg, r);
  return bg;
}
