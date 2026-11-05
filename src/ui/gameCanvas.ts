import { FH, FW } from "../constants/stage";
import { renderScene } from "../scene/renderScene";
import { byId } from "./dom";

/** The canvas the game is drawn on, at the frame size; CSS scales it to the screen. */
export const gameCanvas = byId<HTMLCanvasElement>("game");
const ctx = gameCanvas.getContext("2d");
if (!ctx) throw new Error("This browser cannot draw to a 2D canvas.");
gameCanvas.width = FW;
gameCanvas.height = FH;
const image = ctx.createImageData(FW, FH);

/** draw the scene as it stands now */
export function paintScene(): void {
  renderScene(image.data);
  ctx?.putImageData(image, 0, 0);
}

/** cover the whole canvas in one colour */
export function paintFill(color: string): void {
  if (!ctx) return;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, FW, FH);
}

/** draw a picture from elsewhere, such as a co-op host's stream, over the whole canvas without smoothing */
export function paintImage(source: CanvasImageSource): void {
  if (!ctx) return;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(source, 0, 0, FW, FH);
}
