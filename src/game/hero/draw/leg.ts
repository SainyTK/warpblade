import { BODY } from "../../../constants/hero";
import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { lerp } from "../../../utils/math";
import { reach, type Vec } from "./reach";

/** where a leg from this hip ends up reaching for this foot: the knee bent forward, and the ankle */
export const legReach = (hip: Readonly<Vec>, foot: Readonly<Vec>): [Vec, Vec] =>
  reach(hip[0], hip[1], foot[0], foot[1] - 1, BODY.thigh, BODY.shin, -1);

/** where the toe of the boot ends up, from the ankle tilted by the foot angle */
export const toePoint = (ankle: Readonly<Vec>, tilt: number): Vec => [
  ankle[0] + Math.cos(tilt) * BOOT_LENGTH,
  ankle[1] + 0.4 + Math.sin(tilt) * BOOT_LENGTH,
];

const BOOT_LENGTH = 2.4;

/** trousers, a plate knee guard and a tall boot with a trim band, the boot tilted by the foot angle; the far leg in shadow */
export function drawLeg(s: SpriteCanvas, hip: Vec, foot: Vec, tilt: number, far: boolean): void {
  const [knee, ankle] = legReach(hip, foot);
  const pants = far ? HC.pantsDark : HC.pants;
  s.begin();
  s.stroke(hip[0], hip[1], knee[0], knee[1], 1.55, pants);
  s.stroke(knee[0], knee[1], ankle[0], ankle[1], 1.25, pants);
  s.shadeEdges(pants, far ? HC.pants : HC.pantsLight, far ? HC.outline : HC.pantsDark);
  s.commit();
  const boot = far ? HC.bootDark : HC.boot;
  const top: Vec = [lerp(knee[0], ankle[0], 0.42), lerp(knee[1], ankle[1], 0.42)];
  const [tx, ty] = toePoint(ankle, tilt);
  const [sx, sy] = [ankle[0], ankle[1] + 0.4];
  s.begin();
  s.stroke(top[0], top[1], ankle[0], ankle[1], 1.35, boot);
  s.stroke(sx - (tx - sx) * 0.25, sy - (ty - sy) * 0.25, tx, ty, 0.95, boot);
  s.shadeEdges(boot, far ? HC.boot : HC.bootLight, HC.bootDark, 2);
  s.commit();
  s.begin();
  s.stroke(top[0] - 1.3, top[1], top[0] + 1.3, top[1], 0.35, far ? HC.trimDark : HC.trim);
  s.commit();
  const guard = far ? HC.steelDark : HC.steel;
  s.begin();
  s.dot(knee[0] + 0.3, knee[1], 1.3, guard);
  s.shadeEdges(guard, far ? HC.steel : HC.steelLight, HC.steelDeep);
  if (!far) s.set(knee[0], knee[1] - 0.6, HC.steelGlint);
  s.commit();
}
