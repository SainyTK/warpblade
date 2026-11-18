import { H, W } from "../constants/stage";
import { paintBackdrop } from "../scene/backdrop";
import { onSceneChange } from "../scene/scenery";
import type { Insets } from "../types/layout";
import { hudPlace } from "../utils/hudPlace";
import { stageLayout } from "../utils/stageLayout";
import { sizeDangerGlow } from "./dangerGlow";
import { byId } from "./dom";

const stage = byId("stage");
const backdrop = byId<HTMLCanvasElement>("backdrop");
/** an empty box padded by the safe area insets, measured to read them in pixels */
const safeProbe = byId("safeArea");
const hud = stage.querySelector<HTMLElement>(".hud");

function safeInsets(): Insets {
  const s = getComputedStyle(safeProbe);
  return {
    top: Number.parseFloat(s.paddingTop) || 0,
    right: Number.parseFloat(s.paddingRight) || 0,
    bottom: Number.parseFloat(s.paddingBottom) || 0,
    left: Number.parseFloat(s.paddingLeft) || 0,
  };
}

const px = (devicePx: number, dpr: number): string => `${devicePx / dpr}px`;

/** the HUD's height laid out above the stage, where it is wider than inside and its tabs may wrap differently */
function outsideHeight(): number {
  if (!hud) return Number.POSITIVE_INFINITY;
  document.body.dataset.hud = "outside";
  return hud.getBoundingClientRect().height;
}

/**
 * Fill the screen: the stage at the largest whole-number scale that fits, so every art pixel is the same square,
 * and the night scene continued around it on the same pixel grid out to every edge.
 */
export function fitStage(): void {
  const ctx = backdrop.getContext("2d");
  let painted = "";
  const fit = () => {
    const dpr = window.devicePixelRatio || 1;
    const safe = safeInsets();
    const layout = stageLayout({ w: W, h: H }, { w: window.innerWidth, h: window.innerHeight }, safe, dpr);
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
    sizeDangerGlow(
      cols,
      rows,
      (layout.backdropX - layout.stageX) / dpr,
      (layout.backdropY - layout.stageY) / dpr,
      scale / dpr,
    );
    document.body.dataset.hud = hudPlace(layout.stageY / dpr, safe.top, outsideHeight());
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
  // a new era repaints the world around the stage in its own colors
  onSceneChange(() => {
    painted = "";
    fit();
  });
  addEventListener("resize", fit);
  // a run starting or a hero's tabs changing resizes the HUD, which may then fit above the stage or no longer fit;
  // the fit waits a frame, since moving the HUD resizes it again inside the observer
  if (hud) new ResizeObserver(() => requestAnimationFrame(fit)).observe(hud);
  document.addEventListener("fullscreenchange", fit);
  watchDensity();
  fit();
}
