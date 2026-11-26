import { glow, place } from "../../../engine/frame";
import type { SceneDef } from "../../../scene/eras/sceneDef";
import { CLOCK } from "./clock";
import { drawBubbles, drawMotes, drawPages, drawTendrils } from "./drift";
import { paintFloor } from "./floor";
import { ARCHIVE_PALETTE, SCENE } from "./palette";
import { drawCandles, drawStacks } from "./stacks";
import { paintVault } from "./vault";
import { WINDOWS } from "./windows";

const WINDOW_GLOW = { radius: 30, most: 0.2 } as const;

export const archiveScene: SceneDef = {
  palette: ARCHIVE_PALETTE,
  stars: 0,
  windows: 0,
  braziers: 0,
  mist: 0.7,
  detail(paint, _r, k) {
    paintVault(paint, k);
    paintFloor(paint);
  },
  ambient(t, _k, arena) {
    if (!arena) drawStacks();
    place();
    for (const w of WINDOWS) glow(w.x, (w.top + w.bottom) / 2, WINDOW_GLOW.radius, SCENE.shaftGlow, WINDOW_GLOW.most);
    glow(CLOCK.x, CLOCK.y, CLOCK.r + 10, SCENE.clockFace, 0.08 + Math.sin(t * 0.8) * 0.02);
    drawTendrils(t);
    if (!arena) drawCandles(t);
    drawMotes(t);
  },
  weather(t) {
    drawBubbles(t);
    drawPages(t);
  },
};
