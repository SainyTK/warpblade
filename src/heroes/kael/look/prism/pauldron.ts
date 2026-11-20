import { HERO_COLORS as HC } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Vec } from "../../../../types/rig";
import { WHITE } from "../../../../utils/color";
import { drawKaelArm } from "../arm";

/** the three plates top to bottom: how far down the arm each sits from the shoulder, its width and its length */
const PLATES = [
  { at: 1.9, w: 2.6, h: 1.6 },
  { at: 0.8, w: 3.2, h: 1.8 },
  { at: -0.4, w: 3.8, h: 2 },
] as const;
/** how much the plates follow the upper arm; the rest hangs straight down the body */
const FOLLOW = 0.55;

/** the way down the plates: mostly along the upper arm, partly straight down, so a raised arm still reads as a shoulder */
function downAxis(shoulder: Vec, elbow: Vec): Vec {
  const ax = elbow[0] - shoulder[0];
  const ay = elbow[1] - shoulder[1];
  const d = Math.hypot(ax, ay) || 1;
  const x = (ax / d) * FOLLOW;
  const y = (ay / d) * FOLLOW + (1 - FOLLOW);
  const n = Math.hypot(x, y) || 1;
  return [x / n, y / n];
}

/** one faceted crystal plate centred `at` down the axis: a lit face, a face in shade on the lower right, a glint */
function plate(s: SpriteCanvas, shoulder: Vec, down: Vec, at: number, w: number, h: number): void {
  const across: Vec = [-down[1], down[0]];
  const p = (a: number, b: number): Vec => [
    shoulder[0] + down[0] * (at + a) + across[0] * b,
    shoulder[1] + down[1] * (at + a) + across[1] * b,
  ];
  const top = -h / 2;
  const tip = h / 2;
  const half = w / 2;
  s.begin();
  s.poly(
    [p(top, -half), p(top - 0.4, 0), p(top, half), p(tip * 0.3, half + 0.2), p(tip, 0), p(tip * 0.3, -half - 0.2)],
    HC.blade,
  );
  s.poly([p(tip * 0.3, half * 0.2), p(tip * 0.3, half + 0.2), p(tip, 0)], HC.bladeBack);
  s.shadeEdges(HC.blade, HC.bladeEdge, HC.bladeDeep);
  s.shadeEdges(HC.bladeBack, HC.blade, HC.bladeDeep);
  const glint = p(top + 0.3, -half * 0.45);
  s.set(glint[0], glint[1], WHITE);
  s.commit();
}

/**
 * The Prism Knight's sword arm: Kael's arm, and on the arm in front a crystal pauldron of three faceted plates that
 * overlap down from the shoulder like scales, the top one widest, lit from the top left with a white glint on each
 */
export function drawPrismArm(s: SpriteCanvas, shoulder: Vec, elbow: Vec, hand: Vec, front: boolean): void {
  drawKaelArm(s, shoulder, elbow, hand, front);
  if (!front) return;
  const down = downAxis(shoulder, elbow);
  for (const pl of PLATES) plate(s, shoulder, down, pl.at, pl.w, pl.h);
}
