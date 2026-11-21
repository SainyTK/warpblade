import { HERO_CANVAS } from "../src/constants/hero";
import { FW, GROUND, RES } from "../src/constants/stage";
import { detailCanvas } from "../src/engine/sprite";
import { drawKaelSprite, outlineKaelSprite } from "../src/kaelSprite";
import { drawHero } from "../src/rig";
import { buildBackground } from "../src/scene/background";
import { SCENES } from "../src/scene/eras";
import type { HeroSkin } from "../src/types/character";
import { cb, cg, cr } from "../src/utils/color";
import type { Frame } from "./motion/types";
import { drawRigOverlay } from "./rigOverlay";

const WIDTH = 320;
const HEIGHT = 184;
const FEET = 148;
const CAMERA_X = 324;
const scene = buildBackground(SCENES.day, 0).plate;
const backgrounds = new Map<number, ImageData>();
const pixels = detailCanvas(HERO_CANVAS.w, HERO_CANVAS.h, HERO_CANVAS.ox, HERO_CANVAS.oy);

function rgba(data: Uint8ClampedArray, pixel: number, color: number, alpha: number): void {
  const offset = pixel * 4;
  data[offset] = cr(color);
  data[offset + 1] = cg(color);
  data[offset + 2] = cb(color);
  data[offset + 3] = alpha;
}

function background(zoom: number, floor: number): ImageData {
  const key = floor * 10 + zoom;
  const cached = backgrounds.get(key);
  if (cached) {
    return cached;
  }
  const image = new ImageData(WIDTH, HEIGHT);
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const sx = CAMERA_X + Math.floor((x - WIDTH / 2) / zoom);
      const sy = GROUND * RES + Math.floor((y - floor) / zoom);
      rgba(image.data, y * WIDTH + x, scene[sy * FW + sx], 255);
    }
  }
  backgrounds.set(key, image);
  return image;
}

function paintProcedural(rig: CanvasRenderingContext2D, image: ImageData, frame: Frame, skin: HeroSkin): void {
  drawHero(pixels, frame.pose, skin, frame.look);
  for (let i = 0; i < pixels.d.length; i++) {
    const color = pixels.d[i];
    rgba(image.data, i, color, color ? 255 : 0);
  }
  rig.putImageData(image, 0, 0);
}

function paintSprite(rig: CanvasRenderingContext2D, sprite: CanvasImageSource, frame: Frame): void {
  rig.save();
  rig.clearRect(0, 0, pixels.w, pixels.h);
  rig.translate(pixels.ox, pixels.oy);
  rig.scale(RES, RES);
  drawKaelSprite(rig, sprite, frame.pose, frame.look);
  rig.restore();
  const image = rig.getImageData(0, 0, pixels.w, pixels.h);
  outlineKaelSprite(image);
  rig.putImageData(image, 0, 0);
}

function drawTrack(ctx: CanvasRenderingContext2D, frame: Frame, scale: number, floor: number): void {
  if (!frame.scroll) {
    return;
  }
  const spacing = frame.scroll * scale;
  const offset = Math.round((frame.root * scale) % spacing);
  ctx.fillStyle = "#ebdda2";
  for (let x = -offset; x < WIDTH; x += spacing) {
    ctx.fillRect(Math.round(x), floor + 4, 3, 2);
  }
}

function drawShadow(ctx: CanvasRenderingContext2D, root: number, floor: number, scale: number, height: number): void {
  ctx.fillStyle = `rgb(21 20 26 / ${0.33 / (1 + height / 15)})`;
  ctx.beginPath();
  ctx.ellipse(root, floor + 0.6, scale * (5 + height * 0.14), scale * 0.84, 0, 0, 2 * Math.PI);
  ctx.fill();
}

export function createStage(canvas: HTMLCanvasElement) {
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d");
  const layer = document.createElement("canvas");
  layer.width = pixels.w;
  layer.height = pixels.h;
  const rig = layer.getContext("2d", { willReadFrequently: true });
  if (!context || !rig) {
    throw new Error("Canvas 2D is unavailable");
  }
  const image = rig.createImageData(pixels.w, pixels.h);
  context.imageSmoothingEnabled = false;

  return (
    frame: Frame,
    zoom: number,
    overlay: boolean,
    appearance?: { skin: HeroSkin } | { sprite: CanvasImageSource },
  ): void => {
    const scale = RES * zoom;
    const height = Math.round(frame.lift * scale);
    const floor = FEET + (zoom > 1 && !frame.scroll ? height : 0);
    const root = WIDTH / 2 + Math.round(frame.stageX * scale);
    const spriteY = floor - height;
    context.putImageData(background(zoom, floor), 0, 0);
    drawTrack(context, frame, scale, floor);
    drawShadow(context, root, floor, scale, height);
    if (!appearance) {
      return;
    }
    if ("skin" in appearance) {
      paintProcedural(rig, image, frame, appearance.skin);
    } else {
      paintSprite(rig, appearance.sprite, frame);
    }
    const widthScale = zoom * (frame.profile ?? 1);
    context.drawImage(
      layer,
      root - pixels.ox * widthScale,
      spriteY - pixels.oy * zoom,
      layer.width * widthScale,
      layer.height * zoom,
    );
    if (overlay) {
      drawRigOverlay(context, frame, root, spriteY, scale);
    }
  };
}
