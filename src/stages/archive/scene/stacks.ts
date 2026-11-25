import { FW, GROUND, RES } from "../../../constants/stage";
import { color, fleck, glow, place, px, shakeOffset } from "../../../engine/frame";
import { stageCameraX } from "../../../game/adventure";
import { sceneBackground } from "../../../scene/scenery";
import { clamp } from "../../../utils/math";
import { SCENE } from "./palette";
import { CANDLES, STACKS, stackArt } from "./stackArt";

const RUIN_ROW = 111 * RES;
const FLOOR_ROW = GROUND * RES;
const CANDLE_GLOW = { radius: 22, most: 0.26 } as const;

const shiftOf = (cameraX: number): number => cameraX * STACKS.parallax;

export function drawStacks(): void {
  const art = stackArt();
  const plate = sceneBackground();
  const [sx, sy] = shakeOffset();
  const shift = shiftOf(stageCameraX()) - sx;
  const lead = Math.round(shift * RES);
  for (let iy = 0; iy < FLOOR_ROW; iy++) {
    const source = clamp(iy - sy * RES, 0, FLOOR_ROW - 1);
    const artRow = Math.floor(source / RES) * STACKS.width;
    const row = iy * FW;
    const plateRow = source * FW;
    const fallback = source >= RUIN_ROW;
    for (let ix = 0; ix < FW; ix++) {
      const ax = (((Math.floor((ix + lead) / RES) % STACKS.width) + STACKS.width) % STACKS.width) | 0;
      const c = art[artRow + ax];
      if (c) color[row + ix] = c;
      else if (fallback) color[row + ix] = plate[plateRow + clamp(ix - sx * RES, 0, FW - 1)];
    }
  }
}

function screenX(x: number, cameraX: number): number {
  const shifted = x - shiftOf(cameraX);
  return ((shifted % STACKS.width) + STACKS.width) % STACKS.width;
}

export function drawCandles(t: number): void {
  const cameraX = stageCameraX();
  place();
  for (const candle of CANDLES) {
    const x = screenX(candle.x, cameraX);
    if (x > 330) continue;
    const flicker = Math.sin(t * 9 + candle.phase) * 0.5 + Math.sin(t * 23 + candle.phase * 2) * 0.3;
    const lean = Math.sin(t * 1.3 + candle.phase) * 0.5;
    px(x, candle.y, SCENE.flameEdge);
    fleck(x + 0.5 + lean, candle.y - 0.5, SCENE.flame);
    fleck(x + 0.5 + lean, candle.y - 1, flicker > 0 ? SCENE.flame : SCENE.flameEdge);
    fleck(x + lean * 1.5, candle.y - 1.5, SCENE.candleWater, 0.7);
    glow(x + 0.5, candle.y - 1, CANDLE_GLOW.radius, SCENE.candleWater, CANDLE_GLOW.most * (0.85 + flicker * 0.15));
    glow(x + 0.5, candle.y - 1, 7, SCENE.candleGlow, 0.35);
  }
}
