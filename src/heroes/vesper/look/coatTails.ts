import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { RigFrame } from "../../../types/rig";
import { atHip } from "../../../utils/poseFrame";

/** how far the long back tail and the short front panel hang below the sash */
const TAIL = { back: 13, front: 5 } as const;

/**
 * Vesper's coat below the sash, cut unevenly: a short panel in front and one long tail behind that flares back with speed
 * and reaches past her knees, with a fold down it and a silver hem.
 */
export function drawVesperCoatTails(s: SpriteCanvas, rig: RigFrame): void {
  const p = rig.pose;
  const fl = rig.flare;
  const at = (dx: number, dy: number) => atHip(p, dx, dy);
  s.begin();
  s.poly(
    [
      at(-3.4, -2),
      at(0.5, -2),
      at(-0.5 - fl * 0.5, TAIL.back - fl * 0.6),
      at(-5.4 - fl * 1.3, TAIL.back - 1 - fl * 0.5),
    ],
    HC.coatDark,
  );
  s.shadeEdges(HC.coatDark, HC.coat, HC.coatDeep, 2);
  s.commit();
  s.begin();
  s.poly([at(0, -2), at(3, -2), at(3.3 + fl * 0.15, TAIL.front), at(0.2, TAIL.front + 0.6)], HC.coat);
  s.shadeEdges(HC.coat, HC.coatLight, HC.coatDark);
  s.commit();
  s.begin();
  const [a, b] = [at(-1.6, -1), at(-3 - fl, TAIL.back - 1.5 - fl * 0.5)];
  s.stroke(a[0], a[1], b[0], b[1], 0.3, HC.coatDeep);
  s.commit(false);
  s.begin();
  const [h0, h1] = [at(-0.5 - fl * 0.5, TAIL.back - fl * 0.6), at(-5.4 - fl * 1.3, TAIL.back - 1 - fl * 0.5)];
  s.stroke(h0[0], h0[1], h1[0], h1[1], 0.4, HC.trim);
  const [f0, f1] = [at(3.3 + fl * 0.15, TAIL.front + 0.2), at(0.2, TAIL.front + 0.8)];
  s.stroke(f0[0], f0[1], f1[0], f1[1], 0.35, HC.trim);
  s.shadeEdges(HC.trim, HC.trimLight, HC.trimDark);
  s.commit();
}
