import type { SceneDef } from "../../../scene/eras/sceneDef";
import { paintBackdrop } from "./backdrop";
import { paintFloor } from "./floor";
import { drawBlightAmbient, drawBlightWeather } from "./life";
import { blightPalette } from "./palette";
import { sceneTones } from "./tones";

export const blightScene: SceneDef = {
  palette: blightPalette,
  stars: 0,
  windows: 0,
  braziers: 0,
  mist: 0.75,
  detail(paint, _r, k) {
    const P = blightPalette(k);
    const T = sceneTones(k);
    paintBackdrop(paint, P, T);
    paintFloor(paint, P, T);
  },
  ambient(t, k) {
    drawBlightAmbient(t, k, sceneTones(k));
  },
  weather(t, k) {
    drawBlightWeather(t, sceneTones(k));
  },
};
