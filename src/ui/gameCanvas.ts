import { H, W } from "../constants/stage";
import { renderScene } from "../scene/renderScene";
import { byId } from "./dom";

/** The canvas the game is drawn on, at the art size; CSS scales it to the screen. */
export const gameCanvas = byId<HTMLCanvasElement>("game");
const ctx = gameCanvas.getContext("2d");
if (!ctx) throw new Error("This browser cannot draw to a 2D canvas.");
const image = ctx.createImageData(W, H);

/** draw the scene as it stands now */
export function paintScene(): void {
  renderScene(image.data);
  ctx?.putImageData(image, 0, 0);
}

/** draw a picture from elsewhere, such as a co-op host's stream, over the whole canvas without smoothing */
export function paintImage(source: CanvasImageSource): void {
  if (!ctx) return;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(source, 0, 0, W, H);
}
