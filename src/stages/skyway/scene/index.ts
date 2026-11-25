import { FW } from "../../../constants/stage";
import { place } from "../../../engine/frame";
import type { SceneDef } from "../../../scene/eras/sceneDef";
import { LAYER } from "../../../scene/plate";
import { paintBridge } from "./bridge";
import { paintCloudSea } from "./cloudSea";
import { paintIslands } from "./islands";
import { SKYWAY_PALETTE } from "./palette";
import { newPicture, SKY_ROWS } from "./picture";
import { paintSky } from "./sky";
import { headLightning, seaLightning, stormFlash } from "./storm";
import { paintThunderhead } from "./thunderhead";
import { drawWind } from "./weather";

const BEHIND = [LAYER.sky, LAYER.celestial, LAYER.ridge, LAYER.tower] as const;
const FLOOR = [LAYER.ground] as const;

export const skywayScene: SceneDef = {
  palette: SKYWAY_PALETTE,
  stars: 0,
  windows: 0,
  braziers: 0,
  mist: 0.45,
  detail(paint, r, k) {
    const pic = newPicture();
    paintSky(pic, r, k);
    paintCloudSea(pic, r);
    if (paint.bodies) paintThunderhead(pic, r);
    paintIslands(pic, k);
    for (let iy = 0; iy < SKY_ROWS; iy++) for (let ix = 0; ix < FW; ix++) paint.put(ix, iy, pic[iy * FW + ix], BEHIND);
    paintBridge((i, c) => {
      const ix = i % FW;
      paint.put(ix, (i - ix) / FW, c, FLOOR);
    });
  },
  ambient(t) {
    place();
    seaLightning(t);
    headLightning(t);
  },
  weather(t) {
    drawWind(t);
  },
  flash: stormFlash,
};
