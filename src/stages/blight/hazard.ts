import type { StageHazard } from "../../types/campaign";
import { drawClouds, resetClouds, updateClouds } from "./hazard/clouds";
import { drawDressing } from "./hazard/dressing";
import { drawPlumes, drawPools, resetPools, updatePools } from "./hazard/pools";

export const blightHazard: StageHazard = {
  reset() {
    resetPools();
    resetClouds();
  },
  update(dt) {
    updatePools(dt);
    updateClouds(dt);
  },
  drawBack(cameraX, t) {
    drawDressing(cameraX, t);
    drawPools(cameraX, t);
  },
  drawFront(cameraX, t) {
    drawPlumes(cameraX);
    drawClouds(cameraX, t);
  },
};
