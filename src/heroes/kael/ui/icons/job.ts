import { PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { fill, gem } from "../../../../ui/skills/icons/parts";
import { WHITE } from "../../../../utils/color";

const P = PAL.prism;

/** the pauldron's plates bottom to top, each centred at (x, y), half as wide as `w` and `h` tall */
const PLATES = [
  { x: 6.5, y: 12.5, w: 3.6, h: 3 },
  { x: 6, y: 9.5, w: 4.4, h: 3.2 },
  { x: 5.5, y: 6.5, w: 5.2, h: 3.4 },
] as const;

/** one faceted crystal plate: a lit face, a face in shade on the lower right, a glint at the top left */
function plate(s: SpriteCanvas, x: number, y: number, w: number, h: number): void {
  fill(s, () => {
    const top = y - h / 2;
    const tip = y + h / 2;
    s.poly(
      [
        [x - w, top],
        [x, top - 0.8],
        [x + w, top],
        [x + w * 0.8, y + 0.4],
        [x, tip],
        [x - w * 0.8, y + 0.4],
      ],
      P[3],
    );
    s.poly(
      [
        [x, top - 0.8],
        [x + w, top],
        [x + w * 0.8, y + 0.4],
        [x, tip],
      ],
      P[2],
    );
    s.shadeEdges(P[3], P[4], P[1]);
    s.shadeEdges(P[2], P[3], P[1]);
    s.set(x - w * 0.5, top, WHITE);
  });
}

/** the Prism Knight's icon: the crystal pauldron's three plates and a prism shard beside them */
export const KAEL_JOB_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  kael_prism: (s) => {
    for (const p of PLATES) plate(s, p.x, p.y, p.w, p.h);
    gem(s, 12.5, 5, 2, 3.5, P);
  },
};
