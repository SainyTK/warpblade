import { BRAZIERS, GROUND, H, N, PLATFORMS, W } from "../constants/stage";
import { mix } from "../utils/color";
import { Rng } from "../utils/rng";
import { paletteAt, type SceneDef, type ScenePalette, starsAt } from "./eras/sceneDef";
import { groundAt, ridgeAt, ridgeTopAt, skyAt } from "./terrain";

const TOWERS: readonly (readonly [number, number, number])[] = [
  [14, 22, 70],
  [58, 14, 92],
  [96, 18, 60],
  [150, 26, 54],
  [196, 12, 88],
  [232, 20, 66],
  [292, 18, 80],
];

// each part draws from its own seeded stream, so an era's sky or star count never reshapes the towers or the moss
const SEEDS = { stars: 3, towers: 5, ground: 7, platforms: 9, sky: 11, decorate: 13 } as const;

function sky(bg: Uint32Array, P: ScenePalette, stars: number): void {
  const r = new Rng(SEEDS.stars);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) bg[y * W + x] = skyAt(x, y, P);
  for (let i = 0; i < stars; i++) {
    const x = r.int(0, W - 1);
    const y = r.int(0, 110);
    bg[y * W + x] = mix(P.starDim, P.starBright, r.range(0.35, 1) * (1 - y / 140));
  }
}

/** a far ridge, then ruined spires rim lit on the right, some windows lit */
function skyline(bg: Uint32Array, P: ScenePalette, windows: number): void {
  const r = new Rng(SEEDS.towers);
  for (let x = 0; x < W; x++) for (let y = ridgeTopAt(x); y < GROUND; y++) bg[y * W + x] = ridgeAt(x, y, P);
  for (const [tx, tw, top] of TOWERS) {
    const broken = r.next() > 0.5;
    for (let x = tx; x < tx + tw && x < W; x++) {
      const roof = Math.floor(
        top + Math.abs(x - (tx + tw / 2)) * (broken ? 1.4 : 0.4) + (broken && x > tx + tw * 0.6 ? 10 : 0),
      );
      for (let y = roof; y < GROUND; y++)
        bg[y * W + x] = x >= tx + tw - 2 ? P.towerRim : y === roof ? P.towerTop : P.tower;
    }
    for (let k = 0; k < 5; k++) {
      const wx = tx + r.int(2, tw - 4);
      const wy = top + r.int(8, 50);
      const roll = r.next();
      if (wy >= GROUND - 6) continue;
      const lit = roll < windows;
      bg[wy * W + wx] = lit ? P.windowLit : P.windowDark;
      bg[(wy + 1) * W + wx] = lit ? P.windowLow : P.windowDark;
    }
  }
}

/** stone courses with a lit lip, moss along the top */
function ground(bg: Uint32Array, P: ScenePalette): void {
  const r = new Rng(SEEDS.ground);
  for (let y = GROUND; y < H; y++) for (let x = 0; x < W; x++) bg[y * W + x] = groundAt(x, y, P);
  for (let x = 0; x < W; x++) {
    if (!r.chance(0.18)) continue;
    const h = r.int(1, 3);
    for (let k = 1; k <= h; k++) bg[(GROUND - k) * W + x] = k === h ? P.mossTip : P.moss;
  }
}

/** stone slabs with hanging vines, and the iron braziers on them */
function platforms(bg: Uint32Array, P: ScenePalette): void {
  const r = new Rng(SEEDS.platforms);
  for (const p of PLATFORMS) {
    for (let y = p.y; y < p.y + 9; y++)
      for (let x = p.x0; x <= p.x1; x++) {
        const row = y - p.y;
        let c = row === 0 ? P.slabLip : row === 1 ? P.slabEdge : row === 8 ? P.slabUnder : P.slab;
        if (row > 1 && row < 8 && (x - p.x0) % 12 === 0) c = P.mortar;
        if (x === p.x0 || x === p.x1) c = P.slabUnder;
        bg[y * W + x] = c;
      }
    for (let x = p.x0 + 2; x < p.x1 - 1; x++) {
      if (!r.chance(0.12)) continue;
      const L = r.int(2, 7);
      for (let k = 0; k < L; k++) bg[(p.y + 9 + k) * W + x] = k === L - 1 ? P.mossTip : P.vine;
    }
  }
  for (const b of BRAZIERS)
    for (let y = b.y - 6; y < b.y; y++)
      for (let x = b.x - 4; x <= b.x + 4; x++) {
        const row = y - (b.y - 6);
        const w = row < 2 ? 4 : row < 4 ? 3 : 1;
        if (Math.abs(x - b.x) > w) continue;
        bg[y * W + x] = row === 0 ? P.ironLip : Math.abs(x - b.x) === w ? P.ironEdge : P.iron;
      }
}

/** the static scene of one era at progress k, built when the wave changes */
export function buildBackground(def: SceneDef, k: number): Uint32Array {
  const bg = new Uint32Array(N);
  const P = paletteAt(def, k);
  sky(bg, P, starsAt(def, k));
  def.sky?.(bg, new Rng(SEEDS.sky), k);
  skyline(bg, P, def.windows);
  ground(bg, P);
  platforms(bg, P);
  def.decorate?.(bg, new Rng(SEEDS.decorate), k);
  return bg;
}
