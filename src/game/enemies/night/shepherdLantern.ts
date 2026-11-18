import type { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import { mix, WHITE } from "../../../utils/color";
import { INNER_FIRE, IRON, MOON, MOON_RIM } from "./colors";
import type { Rig } from "./rig";
import type { Point } from "./shepherdPose";

const CAGE = { half: 2.6, top: -3.4, bottom: 3.2 } as const;

export interface LanternLook {
  enraged: boolean;
  glow: number;
}

export function lanternTones(look: LanternLook): { core: Color; heart: Color } {
  const hot = look.enraged ? INNER_FIRE[2] : MOON_RIM;
  const dim = look.enraged ? INNER_FIRE[0] : MOON[1];
  const lit = Math.min(1, look.glow);
  return {
    core: mix(dim, hot, lit),
    heart: look.glow > 0.6 ? WHITE : mix(dim, look.enraged ? INNER_FIRE[3] : MOON[3], lit),
  };
}

export function drawLantern(
  s: SpriteCanvas,
  g: Rig,
  anchor: Point,
  center: Point,
  chain: number,
  look: LanternLook,
): void {
  const [cx, cy] = center;
  const top = cy + CAGE.top;
  const bottom = cy + CAGE.bottom;
  const half = CAGE.half;
  const { core, heart } = lanternTones(look);
  if (chain > 0.3) {
    s.begin();
    g.hairline(anchor[0], anchor[1], cx, top - 1.6, IRON[2]);
    s.commit(false);
  }
  s.begin();
  g.poly(
    [
      [cx - half - 0.6, top],
      [cx + half + 0.6, top],
      [cx, top - 2.4],
    ],
    IRON[1],
  );
  g.dot(cx, top - 2.6, 0.7, IRON[2]);
  s.shadeEdges(IRON[1], IRON[3], IRON[0]);
  s.commit();
  s.begin();
  g.poly(
    [
      [cx - half, top],
      [cx + half, top],
      [cx + half - 0.4, bottom],
      [cx - half + 0.4, bottom],
    ],
    core,
  );
  const flame = 0.8 + Math.min(1.6, look.glow) * 0.6;
  g.dot(cx, cy + 0.4, flame, heart);
  s.commit(false);
  s.begin();
  for (const o of [-half, 0, half]) g.hairline(cx + o * 0.92, top, cx + o * 0.85, bottom, o === 0 ? IRON[2] : IRON[1]);
  g.stroke(cx - half - 0.4, top, cx + half + 0.4, top, 0.45, IRON[2]);
  g.stroke(cx - half - 0.6, bottom + 0.4, cx + half + 0.6, bottom + 0.4, 0.55, IRON[1]);
  s.commit(false);
}
