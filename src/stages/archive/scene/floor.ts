import { FH, FW, GROUND, RES } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import type { PlatePaint } from "../../../scene/platePaint";
import { mix, scale } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { clamp } from "../../../utils/math";
import { noise } from "./noise";
import { SCENE } from "./palette";

const TOP = GROUND * RES;
const POOL = { rows: 14, squash: 4, mirror: 0.42 } as const;
const STEP_ROW = TOP + POOL.rows + 1;
const BLOCK = { width: 40, height: 9 } as const;
const FRIEZE = { from: 7, to: 11, every: 10 } as const;
const PERIOD = FW;

const wrap = (ix: number): number => ((ix % PERIOD) + PERIOD) % PERIOD;

function lip(paint: PlatePaint): void {
  for (let ix = 0; ix < FW; ix++) {
    const broken = noise(ix / 5, 3.1) < 0.36;
    paint.put(ix, TOP, broken ? SCENE.waterLit : SCENE.floorLip);
  }
}

function flooded(paint: PlatePaint): void {
  for (let d = 1; d <= POOL.rows; d++) {
    const iy = TOP + d;
    const fade = 1 - d / (POOL.rows + 1);
    const ripple = Math.round(Math.sin(d * 1.7) * 2);
    for (let ix = 0; ix < FW; ix++) {
      const seam = wrap(ix + d * 3) % (BLOCK.width * RES) < 2;
      let c = mix(SCENE.stone[1], SCENE.water, 0.55);
      if (seam) c = scale(c, 0.75);
      const seen = paint.get(wrap(ix + ripple), TOP - 2 - d * POOL.squash);
      const broken = noise(ix / 5 + d * 2.1, d * 0.7) < 0.2 + (1 - fade) * 0.3;
      if (seen && !broken) c = mix(c, mix(seen, SCENE.waterLit, 0.15), POOL.mirror * fade);
      if (d <= 2 && grain(ix >> 2, d) < 0.3) c = mix(c, SCENE.waterLit, 0.4);
      paint.put(ix, iy, c);
    }
  }
}

function face(paint: PlatePaint): void {
  for (let iy = STEP_ROW; iy < FH; iy++) {
    const row = iy - STEP_ROW;
    const ay = Math.floor(row / RES);
    const depth = clamp(row / (FH - STEP_ROW));
    for (let ix = 0; ix < FW; ix++) {
      const course = Math.floor(ay / BLOCK.height);
      const ax = Math.floor(ix / RES) + (course % 2 ? BLOCK.width / 2 : 0);
      const inBlock = ay % BLOCK.height;
      const across = ax % BLOCK.width;
      let c = SCENE.stone[2];
      if (row < 2) c = row === 0 ? SCENE.stone[4] : SCENE.stone[3];
      else if (inBlock === 0) c = SCENE.stone[0];
      else if (across === 0) c = SCENE.stone[0];
      else if (inBlock === 1) c = SCENE.stone[3];
      else {
        const block = Math.floor(ax / BLOCK.width) + course * 7;
        c = scale(c, 0.9 + grain(block, 3) * 0.16 + grain(ix, iy) * 0.06);
        const frieze = ay >= FRIEZE.from && ay <= FRIEZE.to && course === 0;
        if (frieze) {
          const slot = across % FRIEZE.every;
          if (slot >= 2 && slot <= 7) {
            const lip = ay === FRIEZE.from || slot === 2;
            c = lip
              ? SCENE.stone[0]
              : mix(SCENE.stone[1], SCENE.spines[(Math.floor(across / FRIEZE.every) + 3) % 8], 0.3);
          }
        }
      }
      if (depth > 0.5 && depth - 0.5 > bayerAt(ix, iy) * 0.9) c = scale(c, 0.78);
      paint.put(ix, iy, c);
    }
  }
}

export function paintFloor(paint: PlatePaint): void {
  face(paint);
  flooded(paint);
  lip(paint);
  for (let ix = 0; ix < FW; ix++) paint.put(ix, STEP_ROW - 1, SCENE.stone[0]);
}
