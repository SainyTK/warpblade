import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { legReach, toePoint } from "../../../rig";
import type { Vec } from "../../../types/rig";
import { lerp } from "../../../utils/math";

const along = (a: Vec, b: Vec, u: number): Vec => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

/**
 * An arm: a loose saffron sleeve to the elbow, the bare forearm with two gold bangles, and a cream hand wrap. The arm
 * behind the body is a shade darker.
 */
export function drawZafirArm(s: SpriteCanvas, shoulder: Vec, elbow: Vec, hand: Vec, front: boolean): void {
  const sleeve = front ? HC.coat : HC.coatDark;
  const flesh = front ? HC.skin : HC.skinShade;
  s.begin();
  s.stroke(elbow[0], elbow[1], hand[0], hand[1], 0.85, flesh);
  s.shadeEdges(flesh, front ? HC.skinLight : HC.skin, HC.skinDeep);
  s.commit();
  s.begin();
  s.stroke(shoulder[0], shoulder[1], elbow[0], elbow[1], 1.45, sleeve);
  s.dot(elbow[0], elbow[1], 1.15, sleeve);
  s.shadeEdges(sleeve, front ? HC.coatLight : HC.coat, front ? HC.coatDark : HC.coatDeep);
  s.commit();
  s.begin();
  for (const u of [0.55, 0.72]) {
    const b = along(elbow, hand, u);
    s.dot(b[0], b[1], 0.75, front ? HC.trim : HC.trimDark);
  }
  if (front) {
    const g = along(elbow, hand, 0.55);
    s.set(g[0] - 0.3, g[1] - 0.3, HC.trimLight);
  }
  s.commit();
  s.begin();
  s.dot(hand[0], hand[1], 1.1, HC.glove);
  s.shadeEdges(HC.glove, HC.gloveLight, HC.pantsDark);
  s.commit();
}

/**
 * A leg: loose cream trousers gathered at the shin by a saffron wrap, and a soft low boot tilted by the foot angle. The
 * far leg is in shadow.
 */
export function drawZafirLeg(s: SpriteCanvas, hip: Vec, foot: Vec, tilt: number, far: boolean): void {
  const [knee, ankle] = legReach(hip, foot);
  const cloth = far ? HC.pantsDark : HC.pants;
  const shin = along(knee, ankle, 0.62);
  s.begin();
  s.stroke(hip[0], hip[1], knee[0], knee[1], 1.85, cloth);
  s.stroke(knee[0], knee[1], shin[0], shin[1], 1.7, cloth);
  s.shadeEdges(cloth, far ? HC.pants : HC.pantsLight, far ? HC.boot : HC.pantsDark);
  s.commit();
  const boot = far ? HC.bootDark : HC.boot;
  const [tx, ty] = toePoint(ankle, tilt);
  const [sx, sy] = [ankle[0], ankle[1] + 0.4];
  s.begin();
  s.stroke(shin[0], shin[1], ankle[0], ankle[1], 1.05, boot);
  s.stroke(sx - (tx - sx) * 0.25, sy - (ty - sy) * 0.25, tx, ty, 0.9, boot);
  s.shadeEdges(boot, far ? HC.boot : HC.bootLight, HC.bootDark, 2);
  s.commit();
  s.begin();
  s.stroke(shin[0] - 1.4, shin[1], shin[0] + 1.4, shin[1], 0.5, far ? HC.coatDark : HC.coat);
  s.commit();
}
