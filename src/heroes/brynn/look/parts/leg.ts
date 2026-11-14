import { HERO_COLORS as HC } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { legReach } from "../../../../rig";
import type { Vec } from "../../../../types/rig";
import { lerp } from "../../../../utils/math";

/** the big boots: how far up the shin they reach, and the toe's length from the ankle */
const BOOT = { top: 0.3, toe: 2.9 } as const;

/** sand trousers tucked into big brown boots with a wide turned-down cuff, a thick sole and a leather knee pad */
export function drawBrynnLeg(s: SpriteCanvas, hip: Vec, foot: Vec, tilt: number, far: boolean): void {
  const [knee, ankle] = legReach(hip, foot);
  const pants = far ? HC.pantsDark : HC.pants;
  s.begin();
  s.stroke(hip[0], hip[1], knee[0], knee[1], 1.6, pants);
  s.stroke(knee[0], knee[1], ankle[0], ankle[1], 1.3, pants);
  s.shadeEdges(pants, far ? HC.pants : HC.pantsLight, far ? HC.outline : HC.pantsDark);
  s.commit();
  const boot = far ? HC.bootDark : HC.boot;
  const top: Vec = [lerp(knee[0], ankle[0], BOOT.top), lerp(knee[1], ankle[1], BOOT.top)];
  const tx = ankle[0] + Math.cos(tilt) * BOOT.toe;
  const ty = ankle[1] + 0.5 + Math.sin(tilt) * BOOT.toe;
  const [sx, sy] = [ankle[0], ankle[1] + 0.5];
  s.begin();
  s.stroke(top[0], top[1], ankle[0], ankle[1], 1.6, boot);
  s.stroke(sx - (tx - sx) * 0.3, sy - (ty - sy) * 0.3, tx, ty, 1.15, boot);
  s.shadeEdges(boot, far ? HC.boot : HC.bootLight, HC.bootDark, 2);
  s.commit();
  s.begin();
  s.stroke(top[0] - 1.6, top[1] + 0.2, top[0] + 1.6, top[1] + 0.2, 0.55, far ? HC.boot : HC.bootLight);
  s.commit();
  s.begin();
  s.hairline(sx - (tx - sx) * 0.3, sy + 1.1, tx + 0.3, ty + 0.9, far ? HC.outline : HC.bootDark);
  s.commit(false);
  const pad = far ? HC.glove : HC.gloveLight;
  s.begin();
  s.dot(knee[0] + 0.4, knee[1], 1.05, pad);
  s.commit();
}
