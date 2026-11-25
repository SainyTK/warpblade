import { GROUND, W } from "../../../constants/stage";
import { px } from "../../../engine/frame";
import { stagePlatforms, stageWalls } from "../../../game/adventure";
import type { Color } from "../../../types/color";
import type { Platform } from "../../../types/world";
import { mix, scale } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { SCENE } from "../scene/palette";

interface Spine {
  x: number;
  width: number;
  height: number;
  cover: Color;
  lean: number;
}

const SLAB = { from: 2, rows: 6 } as const;
const CASE = { shelf: 10, frame: 2 } as const;
const rows = new WeakMap<Platform, Spine[][]>();
const WOOD = SCENE.wood;

function shelfRow(seed: number, x0: number, x1: number, room: number): Spine[] {
  const out: Spine[] = [];
  let x = x0;
  let i = 0;
  while (x < x1) {
    const g = grain(seed, i++);
    const width = 1 + Math.floor(g * 3);
    if (x + width > x1) break;
    if (grain(i, seed) < 0.06) {
      x += 2;
      continue;
    }
    const height = Math.max(3, room - Math.floor(grain(seed + 3, i) * 3));
    const cover = SCENE.spines[Math.floor(grain(i, seed + 9) * SCENE.spines.length)];
    const lean = grain(seed + 5, i) < 0.06 ? 1 : 0;
    out.push({ x, width, height, cover, lean });
    x += width;
  }
  return out;
}

function rowsOf(p: Platform, solid: boolean): Spine[][] {
  const known = rows.get(p);
  if (known) return known;
  const made: Spine[][] = [];
  if (!solid) made.push(shelfRow(p.x0 * 7 + p.y, p.x0 + 1, p.x1 - 1, SLAB.rows));
  else
    for (let base = p.y + CASE.shelf; base <= GROUND; base += CASE.shelf)
      made.push(shelfRow(p.x0 * 13 + base, p.x0 + CASE.frame, p.x1 - CASE.frame, CASE.shelf - 2));
  rows.set(p, made);
  return made;
}

function spines(list: Spine[], base: number): void {
  for (const s of list)
    for (let h = 0; h < s.height; h++)
      for (let i = 0; i < s.width; i++) {
        let c = s.cover;
        if (i === s.width - 1 && s.width > 1) c = scale(s.cover, 1.4);
        else if (i === 0) c = scale(s.cover, 0.72);
        if (h === 1 || h === s.height - 2) c = mix(c, SCENE.gilt, 0.55);
        if (h === s.height - 1) c = scale(c, 0.8);
        px(s.x + i + (h > s.height / 2 ? s.lean : 0), base - h, c);
      }
}

function slab(p: Platform): void {
  for (let y = p.y + SLAB.from; y < p.y + SLAB.from + SLAB.rows; y++)
    for (let x = p.x0 + 1; x < p.x1 - 1; x++) px(x, y, WOOD[0]);
  spines(rowsOf(p, false)[0], p.y + SLAB.from + SLAB.rows - 1);
}

function bookcase(p: Platform): void {
  for (let y = p.y + 1; y < GROUND; y++)
    for (let x = p.x0; x < p.x1; x++) {
      const frame = x - p.x0 < CASE.frame || p.x1 - x <= CASE.frame;
      let c = frame ? WOOD[3] : WOOD[0];
      if (x === p.x1 - 1) c = SCENE.woodLit;
      if (x === p.x0) c = WOOD[1];
      px(x, y, c);
    }
  const list = rowsOf(p, true);
  list.forEach((row, i) => {
    const base = p.y + CASE.shelf * (i + 1);
    spines(row, base - 1);
    for (let x = p.x0 + 1; x < p.x1 - 1; x++) {
      px(x, base, SCENE.shelfLip);
      if (base + 1 < GROUND) px(x, base + 1, WOOD[2]);
    }
  });
}

export function drawShelves(cameraX: number): void {
  const seen = (p: Platform) => p.x1 >= cameraX - 4 && p.x0 <= cameraX + W + 4;
  for (const p of stagePlatforms()) if (seen(p)) slab(p);
  for (const p of stageWalls()) if (seen(p)) bookcase(p);
}
