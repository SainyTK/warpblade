import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { RigFrame } from "../../../types/rig";
import { atHip } from "../../../utils/poseFrame";

/** pixels the long wrap hangs below the hip at the back, and the front panel */
const HEM = { back: 11, front: 7 } as const;

/**
 * The layered wrap below the sash: a long saffron panel at the back that flares with speed and a shorter cream panel in
 * front, each with a fold and a gold-stitched hem.
 */
export function drawZafirWraps(s: SpriteCanvas, rig: RigFrame): void {
  const p = rig.pose;
  const fl = rig.flare;
  const at = (dx: number, dy: number) => atHip(p, dx, dy);
  s.begin();
  s.poly(
    [at(-3.6, -1.5), at(0.5, -1.5), at(-1 - fl * 0.5, HEM.back - fl * 0.3), at(-5.6 - fl, HEM.back - 1 - fl * 0.5)],
    HC.coat,
  );
  s.shadeEdges(HC.coat, HC.coatLight, HC.coatDeep, 2);
  s.commit();
  s.begin();
  s.poly([at(0, -1.5), at(3.2, -1.5), at(3.8 + fl * 0.2, HEM.front), at(0.2 - fl * 0.3, HEM.front + 0.5)], HC.pants);
  s.shadeEdges(HC.pants, HC.pantsLight, HC.pantsDark, 2);
  s.commit();
  s.begin();
  const [a, b] = [at(-2, -1), at(-3.4 - fl * 0.7, HEM.back - 1.4 - fl * 0.4)];
  s.stroke(a[0], a[1], b[0], b[1], 0.3, HC.coatDeep);
  const [c, d] = [at(1.8, -1), at(2 - fl * 0.2, HEM.front - 0.6)];
  s.stroke(c[0], c[1], d[0], d[1], 0.25, HC.pantsDark);
  s.commit(false);
  s.begin();
  const [h0, h1] = [at(-1 - fl * 0.5, HEM.back - fl * 0.3), at(-5.6 - fl, HEM.back - 1 - fl * 0.5)];
  s.stroke(h0[0], h0[1], h1[0], h1[1], 0.35, HC.trim);
  s.commit();
}
