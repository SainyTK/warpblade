import { HULDA_CLIPS } from "../../../constants/clips/hulda/moves";
import { frame } from "../../../constants/hero";
import { RUSH } from "../../../constants/hulda/rush";
import { SPIRIT } from "../../../constants/hulda/spirits";
import { disc, ellipseRing, glow, place, px } from "../../../engine/frame";
import { blit, detailCanvas } from "../../../engine/sprite";
import type { SpriteImage } from "../../../types/sprite";
import { sampleKeys } from "../../../utils/sampleKeys";
import { drawHero } from "../../hero/drawHero";
import { heroLook } from "../../hero/look";

const canvas = detailCanvas(80, 76, 40, 62);

/** the two strides of the Bull Rush lean, drawn from the hero's own rig, for a sister to alternate as she charges */
export function sisterFrames(): readonly [SpriteImage, SpriteImage] {
  const keys = HULDA_CLIPS.rush.keys;
  drawHero(canvas, sampleKeys(keys, RUSH.load + frame(2)), heroLook(3));
  const a = canvas.snapshot();
  drawHero(canvas, sampleKeys(keys, RUSH.load + frame(5)), heroLook(3));
  return [a, canvas.snapshot()];
}

/** a shield-sister at her feet (x, y) facing `dir`: the rig in the spirits' rose, a round shield before her, a glow */
export function drawSister(
  frames: readonly [SpriteImage, SpriteImage],
  x: number,
  y: number,
  dir: number,
  stride: number,
  alpha: number,
): void {
  blit(frames[stride], x, y, dir < 0, { alpha: alpha * 0.85, tint: SPIRIT[4], tintAmount: 0.6, soft: true });
  place();
  const sx = x + dir * 7;
  const sy = y - 16;
  disc(sx, sy, 4, SPIRIT[2], alpha * 0.9);
  ellipseRing(sx, sy, 4, 4, SPIRIT[5], alpha);
  disc(sx, sy, 1.2, SPIRIT[6], alpha);
  px(sx - dir * 2, sy - 2, SPIRIT[6], alpha);
  glow(x, y - 16, 16, SPIRIT[4], 0.2 * alpha);
}
