import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { RigExtra, RigFrame, Vec } from "../../../types/rig";
import { lerp } from "../../../utils/math";
import { atHip, atNeck } from "../../../utils/poseFrame";

/** brass rounds along the strap */
const ROUNDS = 5;

/** a leather strap from the shoulder across the chest to the far hip, with brass rounds in its loops */
function drawBandolier(s: SpriteCanvas, rig: RigFrame): void {
  const p = rig.pose;
  const top: Vec = rig.back ? atNeck(p, -2.6, 1.2) : atNeck(p, 2.4, 1.2);
  const low: Vec = rig.back ? atHip(p, 2.6, -1.8) : atHip(p, -3, -1.8);
  s.begin();
  s.stroke(top[0], top[1], low[0], low[1], 0.75, HC.glove);
  s.shadeEdges(HC.glove, HC.gloveLight, HC.hilt);
  s.commit();
  if (rig.back) return;
  s.begin();
  for (let i = 0; i < ROUNDS; i++) {
    const u = 0.18 + (i / (ROUNDS - 1)) * 0.64;
    const x = lerp(top[0], low[0], u);
    const y = lerp(top[1], low[1], u);
    s.set(x, y - 0.5, HC.trimLight);
    s.set(x, y, HC.trim);
  }
  s.commit(false);
}

/** Calder's bandolier, over his torso and under his head */
export const BANDOLIER: RigExtra = { layer: "overTorso", draw: drawBandolier };
