import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { RigFrame, Vec } from "../../../types/rig";

/** the cape's width at the shoulder and how much it widens at each point of the rope */
const CAPE = { top: 1.6, widen: 0.55 } as const;
/** heavy cloth: the cape keeps this share of the rope's sway and falls at least this far per point */
const HANG = { sway: 0.55, drop: 1.7 } as const;

/** the rope weighed down: each point drawn back toward the anchor and below it, so the cape hangs and sways */
function weighed(rope: readonly Vec[]): Vec[] {
  const [ax, ay] = rope[0];
  return rope.map(([x, y], i) => [ax + (x - ax) * HANG.sway, ay + Math.max((y - ay) * HANG.sway, i * HANG.drop)]);
}

/**
 * The half cape along the scarf's rope from the far shoulder: a cloth that widens as it falls, deep blue with a light
 * fold down it and a gold hem along its foot. Aldric's hair is short, so the ponytail's rope draws nothing.
 */
export function drawCape(s: SpriteCanvas, rig: RigFrame): void {
  const rope = weighed(rig.scarf);
  if (rope.length < 2) return;
  const left: Vec[] = [];
  const right: Vec[] = [];
  rope.forEach((p, i) => {
    const a = rope[Math.max(0, i - 1)];
    const b = rope[Math.min(rope.length - 1, i + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const d = Math.hypot(dx, dy) || 1;
    const w = CAPE.top + i * CAPE.widen;
    left.push([p[0] - (dy / d) * w * 0.5, p[1] + (dx / d) * w * 0.5]);
    right.push([p[0] + (dy / d) * w * 0.5, p[1] - (dx / d) * w * 0.5]);
  });
  s.begin();
  s.poly([...left, ...right.reverse()], HC.scarf);
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark, 2);
  s.commit();
  const n = rope.length;
  s.begin();
  for (let i = 2; i < n - 1; i++) s.set(rope[i][0], rope[i][1], HC.scarfLight);
  s.commit(false);
  const [l, r] = [left[n - 1], right[0]];
  s.begin();
  s.stroke(l[0], l[1], r[0], r[1], 0.45, HC.trim);
  s.commit(false);
}
