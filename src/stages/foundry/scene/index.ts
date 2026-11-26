import type { SceneDef } from "../../../scene/eras/sceneDef";
import { paintCavern } from "./cavern";
import { paintFloor } from "./floor";
import { litWindows } from "./halls";
import { drawForgeAmbient, setWindows } from "./life";
import { foundryPalette } from "./palette";
import { NEAR_HALLS } from "./structures";
import { drawForgeWeather, updateForge } from "./weather";

const NEAR_WINDOW_CHANCE = 0.22;

export const foundryScene: SceneDef = {
  palette: foundryPalette,
  stars: 0,
  windows: 0,
  braziers: 0,
  mist: 0.45,
  detail(paint, _r, k) {
    paintCavern(paint, k, foundryPalette(k));
    paintFloor(paint);
    setWindows(litWindows(NEAR_HALLS, NEAR_WINDOW_CHANCE));
  },
  ambient(t, k) {
    drawForgeAmbient(t, k);
  },
  weather(t, k) {
    drawForgeWeather(t, k);
  },
  update(dt, _k, arena) {
    if (!arena) updateForge(dt);
  },
};
