import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { heldAxis } from "../../../rig";
import type { OffhandLook, RigFrame, Vec } from "../../../types/rig";
import { atHip } from "../../../utils/poseFrame";
import { BLADE_STATE, bladeStateOf, KATANA, SCABBARD } from "../constants/blade";
import { drawHilt } from "./blade";

/** the black lacquer scabbard from its mouth to its end: an indigo shine along the top, a silver mouth ring and end cap */
export function drawScabbard(s: SpriteCanvas, mouth: Vec, end: Vec): void {
  s.begin();
  s.stroke(mouth[0], mouth[1], end[0], end[1], 0.85, HC.boot);
  s.shadeEdges(HC.boot, HC.bootLight, HC.bootDark);
  s.commit();
  const dx = end[0] - mouth[0];
  const dy = end[1] - mouth[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  s.begin();
  for (let d = 1.5; d < len - 1.5; d += 0.5) {
    const shine = d % 3 < 2 ? HC.scarf : HC.scarfDark;
    s.set(mouth[0] + ux * d + uy * 0.45, mouth[1] + uy * d - ux * 0.45, shine);
  }
  s.commit(false);
  s.begin();
  s.dot(mouth[0] + ux * 0.4, mouth[1] + uy * 0.4, 0.8, HC.trim);
  s.dot(end[0] - ux * 0.2, end[1] - uy * 0.2, 0.75, HC.trim);
  s.shadeEdges(HC.trim, HC.trimLight, HC.trimDark);
  s.commit();
  const cord = [mouth[0] + ux * 3, mouth[1] + uy * 3] as const;
  s.begin();
  s.hairline(cord[0], cord[1], cord[0] - 0.6, cord[1] + 1.6, HC.coatLight);
  s.commit(false);
}

/** the scabbard worn at the left hip; with the katana sheathed, its hilt rises forward from the mouth */
function drawAtHip(s: SpriteCanvas, rig: RigFrame): void {
  const kind = bladeStateOf(rig.pose.bs);
  if (kind === BLADE_STATE.held) return;
  const p = rig.pose;
  const mouth = atHip(p, SCABBARD.mouth[0], SCABBARD.mouth[1]);
  const end = atHip(p, SCABBARD.end[0], SCABBARD.end[1]);
  drawScabbard(s, mouth, end);
  if (kind !== BLADE_STATE.sheathed || !rig.armed) return;
  // the blade runs into the scabbard, so its guard sits at the mouth and the grip rises forward out of it
  const angle = Math.atan2(end[1] - mouth[1], end[0] - mouth[0]);
  const back = KATANA.guardAt;
  drawHilt(s, heldAxis([mouth[0] - Math.cos(angle) * back, mouth[1] - Math.sin(angle) * back], angle));
}

/** the scabbard: worn at the hip, and the katana goes into it */
export const SAYA_SCABBARD: OffhandLook = { hip: drawAtHip };
