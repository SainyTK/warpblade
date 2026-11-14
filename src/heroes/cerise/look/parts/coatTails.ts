import { HERO_COLORS as HC } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { RigFrame } from "../../../../types/rig";
import { atHip } from "../../../../utils/poseFrame";

/** pixels the coat's back tails hang below the hip; the front is cut short at the hip */
const TAILS = 9.5;

/**
 * The fencing coat's skirt: cut short in front and falling in two long tails behind, white outside with the rose lining
 * showing as they flare back with speed, and a silver hem.
 */
export function drawCeriseCoatTails(s: SpriteCanvas, rig: RigFrame): void {
  const p = rig.pose;
  const fl = rig.flare;
  const at = (dx: number, dy: number) => atHip(p, dx, dy);
  const hem = at(-5 - fl, TAILS - fl * 0.45);
  s.begin();
  s.poly([at(-3.4, -2), at(1.6, -2), at(2.4 + fl * 0.15, 2.4), at(-1, 6.5 - fl * 0.2), hem], HC.coatDark);
  s.shadeEdges(HC.coatDark, HC.coat, HC.coatDeep, 2);
  s.commit();
  s.begin();
  const lining = [at(-2.6, 0), at(-1.6 - fl * 0.6, 6.4 - fl * 0.3), hem] as const;
  for (let i = 1; i < lining.length; i++)
    s.stroke(lining[i - 1][0], lining[i - 1][1], lining[i][0], lining[i][1], 0.35 + fl * 0.08, HC.scarf);
  s.commit(false);
  const [c, d] = [at(2.4 + fl * 0.15, 2.6), at(-1, 6.7 - fl * 0.2)];
  s.begin();
  s.stroke(c[0], c[1], d[0], d[1], 0.35, HC.steel);
  s.stroke(d[0], d[1], hem[0], hem[1] + 0.2, 0.35, HC.steel);
  s.shadeEdges(HC.steel, HC.steelLight, HC.steelDark);
  s.commit();
}
