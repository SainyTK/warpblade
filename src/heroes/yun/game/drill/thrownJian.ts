import { place } from "../../../../engine/frame";
import { game } from "../../../../game/state";
import { drawThrownJian } from "../effects/thrownJian";

export function drawThrownDrillJian(x: number, y: number, angle: number): void {
  place();
  drawThrownJian(x, y, angle, game.t);
}
