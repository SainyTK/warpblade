import { stageCameraX } from "../../../game/adventure";
import type { SceneDef } from "../../../scene/eras/sceneDef";
import { paintCave } from "./cave";
import { paintFloor } from "./floor";
import { drawCaveLight } from "./light";
import { glacierPalette } from "./palette";
import { drawSnow } from "./snow";
import { buildStrata, drawStrata } from "./strata";

let plate: Uint32Array | null = null;

export const glacierScene: SceneDef = {
  palette: glacierPalette,
  stars: 0,
  windows: 0,
  braziers: 0,
  mist: 0.55,
  detail(paint, _r, k) {
    const P = glacierPalette(k);
    paintCave(paint, k, P);
    paintFloor(paint);
    if (paint.bodies) plate = paint.plate;
    buildStrata(P);
  },
  ambient(t, k, arena) {
    if (!arena && plate) drawStrata(stageCameraX(), plate);
    drawCaveLight(t, k);
  },
  weather: drawSnow,
};
