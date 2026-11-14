import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { drawFitting, heldAxis } from "../../../rig";
import type { OffhandLook, RigExtra, RigFrame, Vec } from "../../../types/rig";
import { WHITE } from "../../../utils/color";

/** the pose's `bs` from which the shield is carried in front of the body, raised to meet blows */
export const SHIELD_RAISED = 0.5;
/** the kite's outline from the grip, `d` along its length toward the point and `w` across */
const KITE: readonly (readonly [number, number])[] = [
  [-7, -3.8],
  [-7.5, 0],
  [-7, 3.8],
  [-3.5, 4.6],
  [2.5, 3.5],
  [9.5, 0],
  [2.5, -3.5],
  [-3.5, -4.6],
];

/**
 * The kite shield centred on the hand, its point along `angle`: white enamel with a gold rim, a rising sun of gold
 * rays over the upper half, and the warp crystal at the sun's heart.
 */
function drawShield(s: SpriteCanvas, hand: Readonly<Vec>, angle: number): void {
  const at = heldAxis(hand, angle);
  const rim = KITE.map(([d, w]) => at(d, w));
  s.begin();
  s.poly(rim, HC.trim);
  s.shadeEdges(HC.trim, HC.trimLight, HC.trimDark);
  s.commit();
  s.begin();
  s.poly(
    KITE.map(([d, w]) => at(d * 0.82 - 0.2, w * 0.74)),
    HC.coat,
  );
  s.shadeEdges(HC.coat, HC.coatLight, HC.coatDark, 2);
  s.commit(false);
  drawFitting(s, () => {
    for (const w of [-2.2, -1.1, 0, 1.1, 2.2]) s.stroke(...at(-2, w * 0.45), ...at(-5.2, w), 0.32, HC.trim);
    s.dot(...at(-2, 0), 1.25, HC.trim);
  });
  s.begin();
  const gem = at(-2, 0);
  s.set(gem[0], gem[1], HC.trimLight);
  s.set(gem[0] - 0.5, gem[1] - 0.5, WHITE);
  s.set(gem[0], gem[1] + 0.5, HC.trimDark);
  s.commit(false);
  s.begin();
  s.stroke(...at(1, 0), ...at(7.6, 0), 0.3, HC.trim);
  s.commit(false);
}

const raised = (rig: RigFrame): boolean => rig.pose.bs >= SHIELD_RAISED;

/** the shield on the far arm: behind the body when lowered, drawn by the front extra when raised */
export const ALDRIC_SHIELD: OffhandLook = {
  held(s, hand, angle, front, rig) {
    if (front || !raised(rig)) drawShield(s, hand, angle);
  },
};

/** the raised shield in front of the body and the sword arm's shoulder, so a blow from the front meets its face */
export const RAISED_SHIELD: RigExtra = {
  layer: "overHead",
  draw(s, rig) {
    if (!rig.back && raised(rig)) drawShield(s, rig.farHand, rig.pose.oa);
  },
};
