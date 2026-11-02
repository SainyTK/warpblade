import { H, W } from "../constants/stage";
import { paintBackdrop } from "../scene/backdrop";
import type { Insets } from "../types/layout";
import { stageLayout } from "../utils/stageLayout";
import { byId } from "./dom";

const stage = byId("stage");
const backdrop = byId<HTMLCanvasElement>("backdrop");
/** an empty box padded by the safe area insets, measured to read them in pixels */
const safeProbe = byId("safeArea");

function safeInsets(): Insets {
  const s = getComputedStyle(safeProbe);
  return {
    top: Number.parseFloat(s.paddingTop) || 0,
    right: Number.parseFloat(s.paddingRight) || 0,
    bottom: Number.parseFloat(s.paddingBottom) || 0,
    left: Number.parseFloat(s.paddingLeft) || 0,
  };
}

/** with this many CSS pixels free above the stage, the HUD moves out of the game into that room */
const HUD_ROOM = 120;

const px = (devicePx: number, dpr: number): string => `${devicePx / dpr}px`;

/**
 * Fill the screen: the stage at the largest whole-number scale that fits, so every art pixel is the same square,
 * and the night scene continued around it on the same pixel grid out to every edge.
 */
export function fitStage(): void {
  const ctx = backdrop.getContext("2d");
  let painted = "";
  const fit = () => {
    const dpr = window.devicePixelRatio || 1;
    const layout = stageLayout({ w: W, h: H }, { w: window.innerWidth, h: window.innerHeight }, safeInsets(), dpr);
    const { scale, cols, rows } = layout;
    Object.assign(stage.style, {
      left: px(layout.stageX, dpr),
      top: px(layout.stageY, dpr),
      width: px(scale * W, dpr),
      height: px(scale * H, dpr),
    });
    Object.assign(backdrop.style, {
      left: px(layout.backdropX, dpr),
      top: px(layout.backdropY, dpr),
      width: px(scale * cols, dpr),
      height: px(scale * rows, dpr),
    });
    document.documentElement.style.setProperty("--art", px(scale, dpr));
    document.body.dataset.hud = layout.stageY / dpr >= HUD_ROOM ? "outside" : "inside";
    const key = [cols, rows, layout.artLeft, layout.artTop].join();
    if (!ctx || key === painted) return;
    painted = key;
    backdrop.width = cols;
    backdrop.height = rows;
    const image = ctx.createImageData(cols, rows);
    paintBackdrop(image, layout.artLeft, layout.artTop);
    ctx.putImageData(image, 0, 0);
  };
  // moving the window to a screen with another pixel density changes the scale without always firing resize
  const watchDensity = () =>
    matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`).addEventListener(
      "change",
      () => {
        fit();
        watchDensity();
      },
      { once: true },
    );
  addEventListener("resize", fit);
  document.addEventListener("fullscreenchange", fit);
  watchDensity();
  fit();
}
