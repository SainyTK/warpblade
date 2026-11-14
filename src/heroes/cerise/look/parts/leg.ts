import { HERO_COLORS as HC } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { legReach, toePoint } from "../../../../rig";
import type { Vec } from "../../../../types/rig";
import { lerp } from "../../../../utils/math";

/**
 * Fitted plum breeches and a high black riding boot to the knee with a silver cuff, the boot tilted by the foot angle;
 * the far leg in shadow.
 */
export function drawCeriseLeg(s: SpriteCanvas, hip: Vec, foot: Vec, tilt: number, far: boolean): void {
  const [knee, ankle] = legReach(hip, foot);
  const pants = far ? HC.pantsDark : HC.pants;
  s.begin();
  s.stroke(hip[0], hip[1], knee[0], knee[1], 1.4, pants);
  s.stroke(knee[0], knee[1], ankle[0], ankle[1], 1.05, pants);
  s.shadeEdges(pants, far ? HC.pants : HC.pantsLight, far ? HC.outline : HC.pantsDark);
  s.commit();
  const boot = far ? HC.bootDark : HC.boot;
  const top: Vec = [lerp(knee[0], ankle[0], 0.04), lerp(knee[1], ankle[1], 0.04)];
  const [tx, ty] = toePoint(ankle, tilt);
  const [sx, sy] = [ankle[0], ankle[1] + 0.4];
  s.begin();
  s.stroke(top[0], top[1], ankle[0], ankle[1], 1.2, boot);
  s.stroke(sx - (tx - sx) * 0.3, sy - (ty - sy) * 0.3, tx, ty, 0.9, boot);
  s.shadeEdges(boot, far ? HC.boot : HC.bootLight, HC.bootDark, 2);
  s.commit();
  const cuff = far ? HC.steelDark : HC.steel;
  s.begin();
  s.stroke(top[0] - 1.25, top[1] - 0.2, top[0] + 1.35, top[1] + 0.2, 0.45, cuff);
  s.shadeEdges(cuff, far ? HC.steel : HC.steelLight, HC.steelDeep);
  s.commit();
}
