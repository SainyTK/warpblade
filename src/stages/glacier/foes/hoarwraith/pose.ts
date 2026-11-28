import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import type { Pt } from "../shapes";
import { WRAITH } from "./constants";

export interface WraithPose {
  bob: number;
  lean: number;
  hand: Pt;
  farHand: Pt;
  spread: number;
  mouth: number;
  glare: number;
  trail: number;
  jolt: number;
}

export function wraithPose(e: Enemy, time: number): WraithPose {
  const jolt = e.flash > 0 ? -1 : 0;
  const bob = Math.sin(time * 2.6) * 1.2;
  const trail = time * 5;
  if (e.state === "wind") {
    const u = clamp(e.st / WRAITH.wind);
    return {
      bob: -u,
      lean: -1.5 * u,
      hand: [8, -14 - u * 3],
      farHand: [-6, -15 - u * 3],
      spread: 1 + u * 0.6,
      mouth: 0.3,
      glare: u,
      trail,
      jolt,
    };
  }
  if (e.state === "dive")
    return {
      bob: 0,
      lean: 3,
      hand: [12, 2],
      farHand: [9, 4],
      spread: 1.4,
      mouth: 0.6,
      glare: 1,
      trail: trail * 2,
      jolt,
    };
  if (e.state === "volley") {
    const u = clamp(e.st / WRAITH.wail);
    return {
      bob,
      lean: -0.5,
      hand: [7, -2],
      farHand: [-5, -2],
      spread: 0.6,
      mouth: 0.3 + u * 0.7,
      glare: u,
      trail,
      jolt,
    };
  }
  if (e.state === "shoot")
    return {
      bob,
      lean: -2,
      hand: [8, 0],
      farHand: [-6, 0],
      spread: 0.8,
      mouth: e.st < WRAITH.wailHold ? 1 : 0.4,
      glare: 0.4,
      trail,
      jolt,
    };
  if (e.state === "recover")
    return { bob: bob * 0.3, lean: 1.5, hand: [7, 6], farHand: [4, 7], spread: 0.5, mouth: 0.2, glare: 0, trail, jolt };
  return { bob, lean: 0, hand: [7, 1 + bob * 0.5], farHand: [-5, 2], spread: 0.8, mouth: 0, glare: 0.2, trail, jolt };
}
