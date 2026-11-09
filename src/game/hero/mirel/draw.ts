import { PAL, SAND } from "../../../constants/palette";
import { glow, px } from "../../../engine/frame";
import { atHip, bladeAngle } from "../../../utils/poseFrame";
import { hero } from "../../state";
import { skin } from "../skin";
import { mirel } from "./memory";
import { sandShare } from "./sand";

/** the glass and the frame of the hourglass at her belt */
const GLASS = PAL.hour[4];

/**
 * In front of her, placed on her (the hero layer leaves the placement on her, facing her way): the small hourglass at her
 * belt, its top bulb emptying as her Sand runs down, and the clock ring at her staff's top glowing while she bends
 * time.
 */
export function drawMirel(): void {
  const h = hero;
  const p = h.pose;
  const [bx, by] = atHip(p, 2.8, 0.8);
  const x = Math.round(bx);
  const y = Math.round(by);
  const share = sandShare();
  px(x - 1, y, SAND.shade);
  px(x, y, SAND.shade);
  px(x + 1, y, SAND.shade);
  px(x - 1, y + 4, SAND.shade);
  px(x, y + 4, SAND.shade);
  px(x + 1, y + 4, SAND.shade);
  px(x, y + 1, share > 0.5 ? SAND.light : GLASS, share > 0.5 ? 1 : 0.5);
  px(x, y + 2, share > 0.02 ? SAND.light : GLASS, share > 0.02 ? 1 : 0.5);
  px(x, y + 3, share < 0.98 ? SAND.shade : GLASS, share < 0.98 ? 1 : 0.5);
  const bending = mirel.field || mirel.hovering || h.state === "rewind" || h.state === "charge";
  const [hx, hy] = h.hand;
  const a = bladeAngle(p);
  const ring = skin.reach + 3.4;
  glow(hx + Math.cos(a) * ring, hy + Math.sin(a) * ring, bending ? 12 : 7, PAL.hour[3], bending ? 0.5 : 0.18);
}
