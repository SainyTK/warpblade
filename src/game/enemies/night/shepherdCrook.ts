import type { SpriteCanvas } from "../../../engine/sprite";
import { BONE } from "./colors";
import type { Rig } from "./rig";
import type { Crook } from "./shepherdPose";

const KNUCKLES = [0.34, 0.68] as const;

export function drawCrook(s: SpriteCanvas, g: Rig, crook: Crook): void {
  const { butt, top, along, across, hookTip } = crook;
  s.begin();
  g.taper(butt[0], butt[1], top[0], top[1], 0.6, 0.85, BONE[2]);
  for (const k of KNUCKLES) {
    const x = butt[0] + (top[0] - butt[0]) * k;
    const y = butt[1] + (top[1] - butt[1]) * k;
    g.dot(x, y, 1.05, BONE[2]);
  }
  const bendX = top[0] + along[0] * 2.2 + across[0] * 2.4;
  const bendY = top[1] + along[1] * 2.2 + across[1] * 2.4;
  const curlX = top[0] + along[0] * 1.6 + across[0] * 5.6;
  const curlY = top[1] + along[1] * 1.6 + across[1] * 5.6;
  g.taper(top[0], top[1], bendX, bendY, 0.85, 0.8, BONE[2]);
  g.taper(bendX, bendY, curlX, curlY, 0.8, 0.65, BONE[2]);
  g.taper(curlX, curlY, hookTip[0], hookTip[1], 0.65, 0.35, BONE[2]);
  s.shadeEdges(BONE[2], BONE[3], BONE[1], 2);
  s.commit();
  s.begin();
  g.hairline(butt[0] + across[0] * 0.3, butt[1] + across[1] * 0.3, top[0], top[1], BONE[1]);
  g.set(bendX, bendY, BONE[3]);
  s.commit(false);
}
