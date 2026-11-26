import { stageAreaShare } from "../../../game/adventure";
import type { StageHazard } from "../../../types/campaign";
import { drawIceTerrain } from "../scene/ledges";
import { drawPools } from "../scene/pools";
import { drawIcicleMarks, drawIcicles, resetIcicles, updateIcicles } from "./icicles";
import { drawSlick, resetSlick, updateSlick } from "./slick";

export { freezeFloor } from "./slick";

export const glacierHazard: StageHazard = {
  reset() {
    resetIcicles();
    resetSlick();
  },
  update(dt) {
    updateIcicles(dt);
    updateSlick(dt);
  },
  drawBack(cameraX, t) {
    drawPools(cameraX, t, stageAreaShare());
    drawIceTerrain(cameraX);
    drawSlick(cameraX, t);
    drawIcicleMarks(cameraX);
  },
  drawFront(cameraX, t) {
    drawIcicles(cameraX, t);
  },
};
