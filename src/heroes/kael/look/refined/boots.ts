import { BODY } from "../../../../constants/hero";
import { HERO_COLORS as C } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { drawLeg, legReach, toePoint } from "../../../../rig";
import type { Vec } from "../../../../types/rig";

export function drawKaelBoots(s: SpriteCanvas, hip: Vec, foot: Vec, tilt: number, far: boolean): void {
  drawLeg(s, hip, foot, tilt, far);
  const [knee, ankle] = legReach(hip, foot);
  const dx = (ankle[0] - knee[0]) / BODY.shin;
  const dy = (ankle[1] - knee[1]) / BODY.shin;
  const along = (side: number, depth: number): Vec => [
    knee[0] + dy * side + dx * depth,
    knee[1] - dx * side + dy * depth,
  ];
  const [tx, ty] = toePoint(ankle, tilt);

  s.begin();
  s.poly(
    [along(-0.8, 0.6), along(1, 0.35), along(0.9, 4), along(0.25, 5.25), along(-0.7, 3.8)],
    far ? C.coatDeep : C.coatDark,
  );
  s.stroke(...along(0.85, 0.85), ...along(0.66, 3.7), 0.27, far ? C.coatDark : C.coatLight);
  s.stroke(...along(-0.6, 2.3), ...along(0.85, 2.15), 0.25, far ? C.trimDark : C.trim);
  s.stroke(ankle[0], ankle[1] + 0.65, tx, ty + 0.5, 0.32, far ? C.bootDark : C.bootLight);
  s.commit(false);
}
