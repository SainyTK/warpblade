import { HUD_PLACE } from "../constants/hudPlace";
import { H, W } from "../constants/stage";
import { paintBackdrop } from "../scene/backdrop";
import { onSceneChange } from "../scene/scenery";
import type { HudPlace, Insets } from "../types/layout";
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

/**
 * The HUD's height laid out in one place above the stage, where it is wider than inside and its tabs may wrap
 * differently. The HUD keeps room for a full build strip and every tab the hero can learn, so this is its largest
 * height in the run and a pick never moves it.
 */
function heightAt(place: HudPlace): number {
  if (!hud) return Number.POSITIVE_INFINITY;
  document.body.dataset.hud = place;
  if (place === "compact" && !rowsInHalves(hud)) return Number.POSITIVE_INFINITY;
  return hud.getBoundingClientRect().height;
}

/**
 * Every row of the compact HUD stays inside its half of the window, which a narrow window may not leave room for.
 * Offsets ignore a tab's jolt and are whole pixels, so each edge may be a rounding pixel out.
 */
function rowsInHalves(box: HTMLElement): boolean {
  return [...box.querySelectorAll<HTMLElement>(".right > *, .build-reserve > *")].every((row) => {
    const half = row.closest<HTMLElement>(".bars, .right");
    if (!half) return true;
    const left = row.offsetLeft - half.offsetLeft;
    return left >= -HUD_PLACE.rounding && left + row.offsetWidth <= half.offsetWidth + HUD_PLACE.rounding;
  });
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
    document.documentElement.style.setProperty("--stage-top", px(layout.stageY, dpr));
    const heights = { outside: heightAt("outside"), compact: heightAt("compact") };
    document.body.dataset.hud = hudPlace(layout.stageY / dpr, safe.top, heights);
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
  // a run starting with another hero resizes the HUD and its rows, which may then fit above the stage or no longer fit;
  // the fit waits a frame, since moving the HUD resizes it again inside the observer
  if (hud) {
    const resized = new ResizeObserver(() => requestAnimationFrame(fit));
    for (const box of [hud, ...hud.querySelectorAll(".tab-reserve, .build-reserve, .ult")]) resized.observe(box);
  }
  // a new hero's tabs and ultimate change the widest rows even where they take no room, as over the stage or in a row
  // that may not wrap, so the place is chosen again before the frame is drawn
  const rewritten = new MutationObserver(fit);
  for (const id of ["abilityReserve", "ultName"]) {
    rewritten.observe(byId(id), { childList: true, characterData: true, subtree: true });
  }
  document.addEventListener("fullscreenchange", fit);
  // the HUD's rows are measured in its pixel fonts, which may still be loading at the first fit
  document.fonts.addEventListener("loadingdone", fit);
  watchDensity();
  fit();
}
