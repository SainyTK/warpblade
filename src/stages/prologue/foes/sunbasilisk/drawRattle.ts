import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { BASILISK_COLORS as C } from "./colors";
import type { SpinePoint } from "./spine";

export function drawRattle(s: SpriteCanvas, spine: readonly SpinePoint[], coil: number, time: number): void {
  if (coil < 0.3) return;
  const tip = spine[0];
  const flash = Math.floor(time * 24) % 2 === 0;
  s.begin();
  for (let i = 0; i < 3; i++) s.dot(tip.x + (i - 1) * 0.9, tip.y - 1.2 - Math.abs(i - 1) * 0.6, 0.9, C.spine[1]);
  s.shadeEdges(C.spine[1], C.spine[2], C.spine[0]);
  s.set(tip.x, tip.y - 2, flash ? WHITE : C.sun[2]);
  s.commit();
}
