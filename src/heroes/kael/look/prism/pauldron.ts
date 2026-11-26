import { HERO_COLORS as HC, PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Vec } from "../../../../types/rig";
import { WHITE } from "../../../../utils/color";
import { drawKaelArm } from "../arm";

/** the three plates top to bottom: how far down the arm each sits from the shoulder, its width and its length */
const PLATES = [
  { at: 1.9, w: 3.2, h: 1.6 },
  { at: 0.8, w: 3.8, h: 1.8 },
  { at: -0.4, w: 4.4, h: 2 },
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

/** the rim that parts the pauldron from the pale coat: the prism ramp's deep violet */
const OUTLINE = PAL.prism[1];

type Plate = (typeof PLATES)[number];

/** a plate's outline, grown out by `grow` on every side, and the point `a` down and `b` across from its middle */
function plateShape(shoulder: Vec, down: Vec, { at, w, h }: Plate, grow: number) {
  const across: Vec = [-down[1], down[0]];
  const p = (a: number, b: number): Vec => [
    shoulder[0] + down[0] * (at + a) + across[0] * b,
    shoulder[1] + down[1] * (at + a) + across[1] * b,
  ];
  const top = -h / 2;
  const tip = h / 2;
  const half = w / 2;
  const outline: Vec[] = [
    p(top - grow, -half - grow),
    p(top - 0.4 - grow, 0),
    p(top - grow, half + grow),
    p(tip * 0.3, half + 0.2 + grow),
    p(tip + grow, 0),
    p(tip * 0.3, -half - 0.2 - grow),
  ];
  return { p, outline, top, tip, half };
}

/** one faceted crystal plate: a lit face, a face in shade on the lower right, a glint */
function plate(s: SpriteCanvas, shoulder: Vec, down: Vec, pl: Plate): void {
  const { p, outline, top, tip, half } = plateShape(shoulder, down, pl, 0);
  s.begin();
  s.poly(outline, HC.blade);
  s.poly([p(tip * 0.3, half * 0.2), p(tip * 0.3, half + 0.2), p(tip, 0)], HC.bladeBack);
  s.shadeEdges(HC.blade, HC.bladeEdge, HC.bladeDeep);
  s.shadeEdges(HC.bladeBack, HC.blade, HC.bladeDeep);
  const glint = p(top + 0.3, -half * 0.45);
  s.set(glint[0], glint[1], WHITE);
  s.commit(false);
}

/**
 * The Prism Knight's sword arm: Kael's arm, and on the arm in front a crystal pauldron of three faceted plates that
 * overlap down from the shoulder like scales, the top one widest, lit from the top left with a white glint on each,
 * the three rimmed together in deep violet
 */
export function drawPrismArm(s: SpriteCanvas, shoulder: Vec, elbow: Vec, hand: Vec, front: boolean): void {
  drawKaelArm(s, shoulder, elbow, hand, front);
  if (!front) return;
  const down = downAxis(shoulder, elbow);
  s.begin();
  for (const pl of PLATES) s.poly(plateShape(shoulder, down, pl, 1 / s.res).outline, OUTLINE);
  s.commit();
  for (const pl of PLATES) plate(s, shoulder, down, pl);
}
