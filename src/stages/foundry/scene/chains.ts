import { W } from "../../../constants/stage";
import { fleck, glow, hairline, px } from "../../../engine/frame";
import { grain } from "../../../utils/grain";
import { SCENE_COLORS as SC } from "./palette";

const PARALLAX = 0.55;
const SPACING = 131;
const WRAP = 393;
const COUNT = 3;
const LINK = 3;

function crucible(x: number, y: number, t: number, seed: number): void {
  for (let row = 0; row < 6; row++) {
    const half = 4 - row * 0.35;
    hairline(x - half, y + row, x + half, y + row, row === 0 ? SC.chain[3] : SC.chain[row < 3 ? 2 : 1]);
  }
  px(x - 4, y - 1, SC.chain[2]);
  px(x + 3, y - 1, SC.chain[2]);
  hairline(x - 3, y + 0.5, x + 3, y + 0.5, SC.ember[1]);
  fleck(x - 1 + Math.sin(t * 3 + seed), y + 0.5, SC.ember[3]);
  glow(x, y, 10, SC.glow, 0.22 + Math.sin(t * 5 + seed) * 0.05);
}

function hook(x: number, y: number): void {
  hairline(x, y, x, y + 4, SC.chain[2]);
  hairline(x, y + 4, x + 2, y + 6, SC.chain[2]);
  hairline(x + 2, y + 6, x + 3, y + 4, SC.chain[3]);
}

export function drawChains(cameraX: number, t: number): void {
  for (let i = 0; i < COUNT; i++) {
    const world = i * SPACING + 60;
    const x = ((((world - cameraX * PARALLAX) % WRAP) + WRAP) % WRAP) - 40;
    if (x < -10 || x > W + 10) continue;
    const length = 34 + grain(i, 4) * 46;
    const sway = Math.sin(t * 0.8 + i * 1.7) * 0.05;
    for (let y = 0; y < length; y += LINK) {
      const lx = x + y * sway;
      const upright = Math.floor(y / LINK) % 2 === 0;
      if (upright) {
        hairline(lx - 0.5, y, lx - 0.5, y + 2, SC.chain[1]);
        hairline(lx + 0.5, y, lx + 0.5, y + 2, SC.chain[2]);
      } else {
        px(lx - 0.5, y + 0.5, SC.chain[1]);
        fleck(lx + 0.5, y + 1, SC.chain[3]);
      }
    }
    const endX = x + length * sway;
    if (i % 2 === 0) crucible(endX, length, t, i);
    else hook(endX, length);
  }
}
