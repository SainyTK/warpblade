import type { SpriteCanvas } from "../../../engine/sprite";
import { mix, WHITE } from "../../../utils/color";
import { RAIN_FOES as C } from "./colors";
import type { HulkLook, Point } from "./hulkLook";

export function drawHulkEyes(s: SpriteCanvas, look: HulkLook, eyes: readonly Point[]): void {
  const u = look.gathered;
  const halo = look.dim
    ? mix(C.kiteVein, C.mud, 0.35)
    : look.cracked
      ? mix(C.wartHot, WHITE, u)
      : look.hot
        ? mix(C.kiteVein, C.wartHot, u)
        : C.kiteVein;
  const iris = look.dim ? C.kiteVein : look.cracked ? mix(C.eye, WHITE, 0.5 + u * 0.5) : mix(C.eye, WHITE, u);
  const centre = look.dim ? C.kiteVein : WHITE;
  for (const [x, y] of eyes) {
    s.dot(x + 0.25, y + 0.25, look.cracked ? 1.1 : 0.9, halo);
    s.block(x - 0.25, y - 0.25, iris);
    s.set(x - 0.25, y - 0.25, centre);
  }
}
