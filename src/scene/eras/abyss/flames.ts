import { BRAZIERS } from "../../../constants/stage";
import { fleck, glow, place, px } from "../../../engine/frame";
import { VOID_FLAME, VOID_FLAME_GLOW } from "./colors";

/** each frame: the dead braziers burn with a low sickly violet flame that leans and sheds a spark now and then */
export function drawVoidFlames(t: number): void {
  place();
  for (const b of BRAZIERS) {
    const top = b.y - 7;
    for (let j = 0; j < 5; j++) {
      const sway = Math.sin(t * 7 + j * 1.3 + b.x) * (j * 0.45);
      const half = j < 2 ? 1 : j < 4 ? 0.5 : 0;
      px(b.x + sway - half, top - j, VOID_FLAME[Math.min(3, j)]);
      px(b.x + sway + half, top - j, VOID_FLAME[Math.min(3, j)]);
    }
    px(b.x, top, VOID_FLAME[0]);
    fleck(b.x + Math.sin(t * 7 + 1.3 + b.x) * 0.45 + 0.25, top - 1.5, VOID_FLAME[0]);
    const spark = (t * 0.9 + b.x * 0.13) % 1;
    fleck(b.x + Math.sin(t * 3 + b.x) * 2, top - 5 - spark * 7, VOID_FLAME[1], 1 - spark);
    glow(b.x, top - 2, 16, VOID_FLAME_GLOW, 0.26 + Math.sin(t * 6 + b.x) * 0.03);
  }
}
