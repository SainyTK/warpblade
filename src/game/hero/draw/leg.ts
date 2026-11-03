import { BODY } from "../../../constants/hero";
import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { scale } from "../../../utils/color";
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

/** a leg from hip to foot, knee bent forward, the boot tilted by the foot angle; the far leg a shade darker */
export function drawLeg(s: SpriteCanvas, hip: Vec, foot: Vec, tilt: number, far: boolean): void {
  const k = far ? 0.72 : 1;
  const [knee, ankle] = legReach(hip, foot);
  s.begin();
  s.stroke(hip[0], hip[1], knee[0], knee[1], 1.5, scale(HC.pants, k));
  s.stroke(knee[0], knee[1], ankle[0], ankle[1], 1.2, scale(HC.pants, k));
  s.stroke(lerp(knee[0], ankle[0], 0.5), lerp(knee[1], ankle[1], 0.5), ankle[0], ankle[1], 1.3, scale(HC.boot, k));
  const [tx, ty] = toePoint(ankle, tilt);
  const heel = 0.5 / BOOT_LENGTH;
  const [sx, sy] = [ankle[0], ankle[1] + 0.4];
  s.stroke(sx - (tx - sx) * heel, sy - (ty - sy) * heel, tx, ty, 0.9, scale(HC.boot, k));
  if (!far) s.set(ankle[0] - 1, knee[1] + (ankle[1] - knee[1]) * 0.55, HC.bootLight);
  s.commit();
}
