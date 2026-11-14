import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { RigExtra } from "../../../types/rig";
import { headCenter } from "../../../utils/poseFrame";

/** a spike of hair from the head's middle: root and point, half its width at the root and how far it bows, in pixels */
type Spike = readonly [x0: number, y0: number, x1: number, y1: number, width: number, bend: number];

/** the wedges swept back from the crown and the back of the head, big enough to read past the head's rows */
const BACK_SPIKES: readonly Spike[] = [
  [-0.5, -4.2, -4.2, -10.4, 1.9, 0.7],
  [-3, -3.2, -11.6, -7.4, 2.3, 0.9],
  [-3.4, -0.4, -12.6, -1.2, 2.2, 0.3],
  [-3.2, 2, -10, 5, 1.8, -0.5],
];
/** the lock that falls over the brow, ahead of the face, stopping above the eye */
const FRINGE: Spike = [1.2, -5.4, 5.8, -1.4, 1.3, -0.5];

/** one wedge: wide at the root, bowed to one side at the middle, sharp at the point */
function wedge([x0, y0, x1, y1, width, bend]: Spike, cx: number, cy: number): [number, number][] {
  const len = Math.hypot(x1 - x0, y1 - y0) || 1;
  const nx = -(y1 - y0) / len;
  const ny = (x1 - x0) / len;
  const mx = cx + (x0 + x1) / 2 + nx * bend;
  const my = cy + (y0 + y1) / 2 + ny * bend;
  return [
    [cx + x0 + nx * width, cy + y0 + ny * width],
    [mx + nx * width * 0.55, my + ny * width * 0.55],
    [cx + x1, cy + y1],
    [mx - nx * width * 0.55, my - ny * width * 0.55],
    [cx + x0 - nx * width, cy + y0 - ny * width],
  ];
}

/** draw wedges in one layer, lit from the top left, with a deep strand down each and a glint along the upper one */
function drawSpikes(s: SpriteCanvas, cx: number, cy: number, spikes: readonly Spike[], glint: boolean): void {
  s.begin();
  for (const spike of spikes) s.poly(wedge(spike, cx, cy), HC.hair);
  s.shadeEdges(HC.hair, HC.hairLight, HC.hairDark, 2);
  s.commit();
  s.begin();
  for (const [x0, y0, x1, y1] of spikes)
    s.hairline(
      cx + x0 * 0.6 + x1 * 0.4,
      cy + y0 * 0.6 + y1 * 0.4 + 0.3,
      cx + x0 * 0.15 + x1 * 0.85,
      cy + y0 * 0.15 + y1 * 0.85,
      HC.hairDeep,
    );
  if (glint) {
    const [x0, y0, x1, y1] = spikes[1];
    s.hairline(
      cx + x0 * 0.8 + x1 * 0.2,
      cy + y0 * 0.8 + y1 * 0.2 - 1.2,
      cx + x0 * 0.4 + x1 * 0.6,
      cy + y0 * 0.4 + y1 * 0.6 - 1,
      HC.hairGlint,
    );
  }
  s.commit(false);
}

/** Kael's spiked hair behind his head's rows, swept back so the head reads from its silhouette alone */
export const KAEL_BACK_HAIR: RigExtra = {
  layer: "behind",
  draw(s, rig) {
    const [cx, cy] = headCenter(rig.pose);
    drawSpikes(s, cx, cy, BACK_SPIKES, true);
  },
};

/** the lock of hair over his brow, drawn over the head facing the camera */
export const KAEL_FRINGE: RigExtra = {
  layer: "overHead",
  draw(s, rig) {
    if (rig.back) return;
    const [cx, cy] = headCenter(rig.pose);
    drawSpikes(s, cx, cy, [FRINGE], false);
  },
};
