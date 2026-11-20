import { W } from "../constants/stage";
import { glow, hairline, place, polygon, px } from "../engine/frame";
import { stageSpikes } from "../game/adventure";
import type { Platform } from "../types/world";
import { mix, rgb } from "../utils/color";
import { spikeCycle } from "../utils/spikeCycle";

const SLOT = rgb(31, 26, 37);
const METAL = rgb(111, 87, 82);
const HEAT = rgb(241, 102, 57);
const BLADE = rgb(168, 115, 98);
const EDGE = rgb(255, 228, 184);
const TOOTH_WIDTH = 8;

function teeth(strip: Platform, height: number, warning: number): void {
  const { x0, x1, y } = strip;
  const count = Math.max(1, Math.round((x1 - x0) / TOOTH_WIDTH));
  const width = (x1 - x0) / count;
  for (let i = 0; i < count; i++) {
    const x = x0 + i * width;
    if (height > 0) {
      polygon(
        [
          [x, y],
          [x + width / 2, y - height],
          [x + width - 0.4, y],
        ],
        BLADE,
      );
      hairline(x + 0.5, y - 0.5, x + width / 2, y - height + 0.4, EDGE);
    } else if (warning > 0) {
      px(x + width / 2 - 0.5, y - 2, mix(HEAT, EDGE, warning));
    }
  }
}

export function drawSpikes(cameraX: number, time: number): void {
  place();
  for (const strip of stageSpikes()) {
    const { x0, x1, y } = strip;
    if (x1 < cameraX || x0 > cameraX + W) continue;
    const { height, warning } = spikeCycle(time, x0);
    hairline(x0, y - 0.5, x1, y - 0.5, mix(METAL, HEAT, warning));
    hairline(x0, y + 0.5, x1, y + 0.5, SLOT);
    teeth(strip, height, warning);
    if (warning > 0) glow((x0 + x1) / 2, y - 1, (x1 - x0) * 0.45, HEAT, warning * 0.55);
  }
}
