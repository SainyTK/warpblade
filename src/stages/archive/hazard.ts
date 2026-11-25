import { place } from "../../engine/frame";
import type { StageHazard } from "../../types/campaign";
import { drawBooks, drawPools, drawShelves, resetBooks, resetPools, updateBooks, updatePools } from "./tides";

export const inkTides: StageHazard = {
  reset() {
    resetPools();
    resetBooks();
  },
  update() {
    updatePools();
    updateBooks();
  },
  drawBack(cameraX, t) {
    place();
    drawShelves(cameraX);
    drawPools(cameraX, t);
  },
  drawFront(cameraX, t) {
    place();
    drawBooks(cameraX, t);
  },
};
