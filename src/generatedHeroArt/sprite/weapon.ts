import type { Vec } from "../../types/rig";
import type { SpriteProfile } from "../types";
import { PARTS } from "./atlas";
import { createPartPainter, drawRotatedPart, type PartPainter } from "./paint";

const GRIP_LENGTH = 7;
const DEFAULT_OFFHAND_ANCHOR: Vec = [0.5, 0.22];

export interface WeaponArt {
  draw(anchor: Vec, angle: number): void;
  drawGrip(anchor: Vec, angle: number): void;
  drawOffhand(anchor: Vec, angle: number, height: number): void;
}

export function createWeaponArt(
  ctx: CanvasRenderingContext2D,
  paint: PartPainter,
  profile: SpriteProfile,
  reach: number,
  offhand: HTMLImageElement | undefined,
): WeaponArt {
  const [x, y, w, h] = PARTS.sword;
  const height = ((profile.weaponReach ?? reach) * h) / (profile.weaponTipY - profile.weaponGrip[1]);
  const width = (height * w) / h;
  return {
    draw(anchor, angle) {
      drawRotatedPart(paint, PARTS.sword, anchor, [width, height], angle, profile.weaponGrip);
    },
    drawGrip(anchor, angle) {
      const end = Math.min(h, profile.weaponGrip[1] + GRIP_LENGTH);
      drawRotatedPart(paint, [x, y, w, end], anchor, [width, (end / h) * height], angle, profile.weaponGrip);
    },
    drawOffhand(anchor, angle, itemHeight) {
      if (!offhand) {
        return;
      }
      const itemWidth = itemHeight * (offhand.naturalWidth / offhand.naturalHeight);
      createPartPainter(ctx, offhand)(
        [0, 0, offhand.naturalWidth, offhand.naturalHeight],
        anchor,
        [itemWidth, itemHeight],
        angle,
        profile.offhandAnchor ?? DEFAULT_OFFHAND_ANCHOR,
      );
    },
  };
}
