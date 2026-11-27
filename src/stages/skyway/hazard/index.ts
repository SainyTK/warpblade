import { place } from "../../../engine/frame";
import type { StageHazard } from "../../../types/campaign";
import { drawGusts } from "./drawGusts";
import { resetGusts, updateGusts } from "./gusts";
import { drawProps } from "./props";
import { drawRodBolts, drawRods, resetRods, updateRods } from "./rods";

export { gustClock, gustDirection, gustPower, gustStrength, gustWarning } from "./gusts";

export const skywayHazard: StageHazard = {
  reset() {
    resetGusts();
    resetRods();
  },
  update(dt) {
    updateGusts(dt);
    updateRods(dt);
  },
  drawBack(cameraX, t) {
    place();
    drawProps(cameraX, t);
    drawRods();
  },
  drawFront(cameraX) {
    place();
    drawRodBolts();
    drawGusts(cameraX);
  },
};
