import { BODY } from "../../../constants/hero";
import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { scale } from "../../../utils/color";
import { lerp } from "../../../utils/math";
import { reach, type Vec } from "./reach";

/** a leg from hip to foot, knee bent forward; the far leg a shade darker */
export function drawLeg(s: SpriteCanvas, hip: Vec, foot: Vec, far: boolean): void {
  const k = far ? 0.72 : 1;
  const [knee, ankle] = reach(hip[0], hip[1], foot[0], foot[1] - 1, BODY.thigh, BODY.shin, -1);
  s.begin();
  s.stroke(hip[0], hip[1], knee[0], knee[1], 1.5, scale(HC.pants, k));
  s.stroke(knee[0], knee[1], ankle[0], ankle[1], 1.2, scale(HC.pants, k));
  s.stroke(lerp(knee[0], ankle[0], 0.5), lerp(knee[1], ankle[1], 0.5), ankle[0], ankle[1], 1.3, scale(HC.boot, k));
  s.stroke(ankle[0] - 0.5, ankle[1] + 0.4, ankle[0] + 2.4, ankle[1] + 0.4, 0.9, scale(HC.boot, k));
  if (!far) s.set(ankle[0] - 1, knee[1] + (ankle[1] - knee[1]) * 0.55, HC.bootLight);
  s.commit();
}
