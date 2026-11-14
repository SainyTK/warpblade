import { glow, place, sparkle } from "../../../engine/frame";
import { hero } from "../../../game/state";
import { WHITE } from "../../../utils/color";
import { PHOSPHOR } from "../constants/colors";
import { DRUM } from "../constants/sword";
import { swordPoint } from "./aim";
import { quickOpen, quickWindow } from "./reload";

/** the sword's angle while the cylinder is held open in the reload clip */
const OPEN_ANGLE = -0.9;

/** while a quick reload is open the cylinder glints: a green star on the drum that swells to the window's middle */
export function drawReloadGlint(): void {
  if (!quickOpen()) return;
  const [from, to] = quickWindow();
  const u = (hero.st - from) / Math.max(0.01, to - from);
  const swell = 1 - Math.abs(u * 2 - 1);
  const [x, y] = swordPoint((DRUM.from + DRUM.to) / 2, -DRUM.swing, OPEN_ANGLE);
  place();
  sparkle(x, y, 3 + swell * 5, WHITE, PHOSPHOR[4], 0.8);
  glow(x, y, 10, PHOSPHOR[4], 0.3 + swell * 0.4);
}
