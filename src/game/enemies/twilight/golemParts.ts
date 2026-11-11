import type { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import { mix } from "../../../utils/color";
import { TWILIGHT_COLORS as TC } from "./colors";
import type { Pt } from "./golemPose";

/** The pieces a Rune Golem is built from: limbs, fists, feet and the crystal on its back. */

/** a heavy stone limb lit from the top left, in shadow on the far side of the body; a hot limb carries a vein of rune light */
export function limb(s: SpriteCanvas, a: Pt, b: Pt, r: number, far: boolean, vein: Color | 0 = 0): void {
  const base = far ? TC.stoneDark : TC.stone;
  s.begin();
  s.stroke(a[0], a[1], b[0], b[1], r, base);
  s.shadeEdges(base, far ? TC.stone : TC.stoneLight, far ? TC.stoneDeep : TC.stoneDark, far ? 1 : 2);
  if (vein) s.hairline(a[0], a[1], b[0], b[1], vein);
  s.commit();
}

/** a leg from the hip down to a broad flat foot */
export function leg(s: SpriteCanvas, hip: Pt, [x, lift]: Pt, r: number, far: boolean): void {
  const base = far ? TC.stoneDark : TC.stone;
  const y = -lift;
  s.begin();
  s.stroke(hip[0], hip[1], x, y - 1, r, base);
  s.poly(
    [
      [x - r, y - 1.5],
      [x + r + 1, y - 1.5],
      [x + r + 1.5, y],
      [x - r - 0.5, y],
    ],
    base,
  );
  s.shadeEdges(base, far ? TC.stone : TC.stoneLight, far ? TC.stoneDeep : TC.stoneDark, far ? 1 : 2);
  s.commit();
}

/**
 * a blocky stone fist, its curled fingers jointed toward the front, with a rune on its back that burns with the
 * golem's heat; as it heats the stone around the rune takes its light
 */
export function fist(s: SpriteCanvas, [x, y]: Pt, r: number, far: boolean, rune: Color, heat: number): void {
  const base = far ? TC.stoneDark : TC.stoneLight;
  const joint = far ? TC.stoneDeep : TC.stone;
  const h = r * 0.92;
  const c = r * 0.3;
  s.begin();
  s.poly(
    [
      [x - h + c, y - h],
      [x + h - c, y - h],
      [x + h, y - h + c],
      [x + h, y + h - c],
      [x + h - c, y + h],
      [x - h + c, y + h],
      [x - h, y + h - c],
      [x - h, y - h + c],
    ],
    base,
  );
  s.shadeEdges(base, far ? TC.stone : TC.stoneRim, joint, 2);
  s.hairline(x + h * 0.25, y - h * 0.3, x + h - 0.5, y - h * 0.3, joint);
  s.hairline(x + h * 0.25, y + h * 0.3, x + h - 0.5, y + h * 0.3, joint);
  s.hairline(x + h * 0.25, y - h * 0.3, x + h * 0.25, y + h * 0.7, joint);
  if (!far) {
    s.block(x - h + c, y - h + 0.5, TC.stoneGlint);
    if (heat > 0.4) s.dot(x - h * 0.4, y + 0.1, 1.6, mix(base, rune, 0.4 * heat));
    s.block(x - h * 0.5, y - 0.5, rune);
    s.set(x - h * 0.5 + 1, y + 0.5, rune);
    s.set(x - h * 0.5 - 0.5, y + 0.5, rune);
  }
  s.commit();
}

/** one crystal shard from its foot to its tip: a lit face, a shaded face and a hot point */
export function shard(s: SpriteCanvas, foot: Pt, tip: Pt, half: number, core: Color): void {
  const left: Pt = [foot[0] - half, foot[1]];
  const right: Pt = [foot[0] + half, foot[1]];
  s.begin();
  s.poly([left, tip, foot], TC.crystalLight);
  s.poly([foot, tip, right], TC.crystal);
  s.hairline(left[0], left[1], tip[0], tip[1], TC.crystalHot);
  s.hairline(foot[0], foot[1], (foot[0] + tip[0]) / 2, (foot[1] + tip[1]) / 2, core);
  s.set(tip[0], tip[1], TC.crystalHot);
  s.commit();
}
