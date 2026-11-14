import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { legReach, toePoint } from "../../../rig";
import type { Vec } from "../../../types/rig";
import { lerp } from "../../../utils/math";

/** how wide the trousers are at the hip, the knee and the hem, which flares over the foot */
const WIDTH = { hip: 1.75, knee: 1.9, hem: 2.55 } as const;

/**
 * One leg in wide indigo trousers that flare at the ankle, with pleats down them, and a dark sandal boot under the
 * hem; the far leg in shadow.
 */
export function drawTrouserLeg(s: SpriteCanvas, hip: Vec, foot: Vec, tilt: number, far: boolean): void {
  const [knee, ankle] = legReach(hip, foot);
  const [tx, ty] = toePoint(ankle, tilt);
  const boot = far ? HC.bootDark : HC.boot;
  s.begin();
  s.stroke(ankle[0] - (tx - ankle[0]) * 0.3, ankle[1] + 0.4, tx, ty, 0.85, boot);
  s.shadeEdges(boot, far ? HC.boot : HC.bootLight, HC.bootDark);
  s.commit();
  const cloth = far ? HC.pantsDark : HC.pants;
  const hem: Vec = [lerp(knee[0], ankle[0], 1.05), lerp(knee[1], ankle[1], 1.05) - 0.6];
  s.begin();
  s.taper(hip[0], hip[1], knee[0], knee[1], WIDTH.hip, WIDTH.knee, cloth);
  s.taper(knee[0], knee[1], hem[0], hem[1], WIDTH.knee, WIDTH.hem, cloth);
  s.shadeEdges(cloth, far ? HC.pants : HC.pantsLight, far ? HC.outline : HC.pantsDark, 2);
  s.commit();
  s.begin();
  for (const w of [-0.8, 0.7]) {
    const dx = (hem[0] - knee[0]) * 0.1;
    s.hairline(knee[0] + w * 0.8, knee[1] + 0.6, hem[0] + w * 1.6 + dx, hem[1] - 0.4, far ? HC.outline : HC.pantsDark);
  }
  s.commit(false);
}
