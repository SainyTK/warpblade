import { hairline, line } from "../../../../engine/frame";
import { skin } from "../../../../game/hero/skin";
import { WHITE } from "../../../../utils/color";
import { STORE_LOOK } from "../../constants/release";

/** a stored cut waiting in a foe: a thin ink line across it with a white edge that shivers, `t` seconds into its life */
export function drawStoredLine(x: number, y: number, angle: number, t: number): void {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const half = STORE_LOOK.line * Math.min(1, t * 10);
  const shiver = Math.sin(t * 40 + angle * 7) * 0.25;
  line(x - c * half, y - s * half, x + c * half, y + s * half, skin.ramp[1], 0.85);
  hairline(
    x - c * half - s * (0.8 + shiver),
    y - s * half + c * (0.8 + shiver),
    x + c * half - s * (0.8 + shiver),
    y + s * half + c * (0.8 + shiver),
    WHITE,
    0.75,
  );
}
