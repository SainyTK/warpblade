import { H, W } from "../constants/stage";
import { paintBackdrop } from "../scene/backdrop";
import { onSceneChange } from "../scene/scenery";
import type { Insets } from "../types/layout";
import { stageLayout } from "../utils/stageLayout";
import { sizeDangerGlow } from "./dangerGlow";
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

const hud = document.querySelector<HTMLElement>(".hud") as HTMLElement;
const pause = byId("pauseButton");

/** CSS pixels the HUD keeps clear of the pause button above it and of the stage below it when it sits above the stage,
 *  and the extra room it asks before it moves out, so a HUD on the edge of fitting does not flip back and forth */
const HUD_CLEAR = { pause: 4, stage: 16, settle: 8 } as const;

/** the room above the stage, in CSS pixels, as the last fit measured it */
let roomAbove = 0;

/**
 * The HUD moves out of the game into the room above the stage when its whole height fits there below the pause button,
 * and stays over the game otherwise; checked on every fit and whenever the HUD's height changes (a second row of tabs,
 * a new bar).
 */
function placeHud(): void {
  const outside = document.body.dataset.hud === "outside";
  const above = pause.getBoundingClientRect().bottom + HUD_CLEAR.pause;
  const need = above + hud.offsetHeight + HUD_CLEAR.stage + (outside ? 0 : HUD_CLEAR.settle);
  const place = roomAbove >= need ? "outside" : "inside";
  if (document.body.dataset.hud !== place) document.body.dataset.hud = place;
}

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
    sizeDangerGlow(
      cols,
      rows,
      (layout.backdropX - layout.stageX) / dpr,
      (layout.backdropY - layout.stageY) / dpr,
      scale / dpr,
    );
    roomAbove = layout.stageY / dpr;
    placeHud();
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
  new ResizeObserver(placeHud).observe(hud);
  document.addEventListener("fullscreenchange", fit);
  watchDensity();
  fit();
}
