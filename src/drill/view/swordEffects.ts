import { glow, glowLine, hairline, place, sparkle } from "../../engine/frame";
import type { Ramp } from "../../types/color";
import type { DrillProfile, DrillSpell, Fighter } from "../../types/drill";
import type { Pose } from "../../types/pose";
import type { Vec } from "../../types/rig";
import { mix } from "../../utils/color";
import { clamp } from "../../utils/math";
import { bladeAngle } from "../../utils/poseFrame";
import { drawInfusionArt } from "./effectArt";
import { infusionBladePoint } from "./infusionContact";

export function swordElementRamp({ color, core }: DrillSpell): Ramp {
  return [
    mix(0x111523, color, 0.2),
    mix(0x111523, color, 0.42),
    mix(0x111523, color, 0.67),
    color,
    mix(color, core, 0.44),
    mix(color, core, 0.73),
    core,
  ];
}

function drawTransfer(hand: Vec, angle: number, reach: number, { color, core }: DrillSpell, progress: number): void {
  const [x, y] = infusionBladePoint(hand, angle, reach, progress);
  const [tailX, tailY] = infusionBladePoint(hand, angle, reach, clamp(progress - 0.33));
  const power = 0.72 + 0.23 * Math.sin(progress * Math.PI * 0.84);
  glow(x, y, 7, color, power * 0.72);
  hairline(tailX, tailY, x, y, core, power);
  sparkle(x, y, 2 + progress * 2.1, color, core, power);
}

export function drawInfusedBlade(
  profile: DrillProfile,
  h: Fighter,
  pose: Pose,
  hand: Vec,
  reach: number,
  transfer: number | null,
): void {
  if (!h.swordInfusion || h.warp?.phase === "flight") {
    return;
  }
  const { spell, age } = h.swordInfusion;
  const [handX, handY] = hand;
  const { color, core, look } = spell;
  const angle = bladeAngle(pose);
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const tipX = handX + dx * (reach - 1);
  const tipY = handY + dy * (reach - 1);
  const pulse = 0.79 + Math.sin(age * 19) * 0.18;
  drawInfusionArt(profile, h, hand, angle, reach);
  const bloom = transfer === null ? 0.74 : 0.49;
  place(h.x, h.y, h.face < 0);
  glowLine(handX + dx * 4, handY + dy * 4, tipX, tipY, 5, color, bloom * pulse);
  hairline(handX + dx * 5, handY + dy * 5, tipX, tipY, color, 0.83);
  glow(tipX, tipY, 6, color, 0.44 * pulse);
  for (let i = 0; i < 4; i++) {
    const distance = 4 + ((age * 31 + i * 4) % (reach - 5));
    const offset = Math.sin(age * 11 + i * 3) * 2.8;
    const x = handX + dx * distance - dy * offset;
    const y = handY + dy * distance + dx * offset;
    if (look === "shard") {
      sparkle(x, y, 1.5, color, core, 0.6);
    } else if (look === "spark") {
      hairline(x, y, x + dy * 2, y - dx * 2, core, pulse);
      hairline(x + dy * 2, y - dx * 2, x + dx * 3, y + dy * 3, color, 0.8);
    } else {
      hairline(x, y, x - 1, y - 3.5, i % 2 ? color : core, 0.72);
    }
  }
  if (transfer !== null) {
    drawTransfer(hand, angle, reach, spell, transfer);
  }
  place();
}
