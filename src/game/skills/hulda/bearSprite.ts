import { SPIRIT } from "../../../constants/hulda/spirits";
import { glow, place } from "../../../engine/frame";
import { blit, detailCanvas } from "../../../engine/sprite";

const canvas = detailCanvas(60, 48, 28, 40);

/** how the bear stands: `rear` lifts its front off the floor, `reach` swings the near paw forward, `jaw` opens its
 *  mouth, `step` moves the legs (-1 to 1), `spread` splays them as it falls */
export interface BearPose {
  rear: number;
  reach: number;
  jaw: number;
  step: number;
  spread: number;
}

/**
 * A spirit bear of her clan, side on and facing right, its feet at the origin: a heavy humped body lit from the top left,
 * a broad head with round ears and a short snout, four thick legs with pale claws, all in the spirits' pale rose.
 */
function drawBear(p: BearPose): void {
  const s = canvas;
  // rearing turns the body up about the hind hips
  const tilt = -p.rear * 0.7;
  const [cx, cy] = [-9, -6];
  const P = (x: number, y: number): [number, number] => {
    const dx = x - cx;
    const dy = y - cy;
    return [cx + dx * Math.cos(tilt) - dy * Math.sin(tilt), cy + dx * Math.sin(tilt) + dy * Math.cos(tilt)];
  };
  const leg = (hx: number, hy: number, fx: number, fy: number, front: boolean, c: number) => {
    const [a, b] = P(hx, hy);
    const [x1, y1] = front ? P(fx, fy) : [fx, fy];
    s.taper(a, b, x1, y1, 2.6, 1.9, c);
  };
  const st = p.step * 3;
  const sp = p.spread * 3;
  s.clear();
  s.begin();
  leg(-7, -9, -6 - st - sp, 0, false, SPIRIT[2]);
  leg(7, -9, 8 + st + sp, p.rear > 0 ? -3 : 0, true, SPIRIT[2]);
  s.shadeEdges(SPIRIT[2], SPIRIT[3], SPIRIT[1]);
  s.commit();
  s.begin();
  for (const [x, y, r] of [
    [-8, -11, 6],
    [-2, -12, 6.5],
    [5, -13.5, 6.2],
  ] as const) {
    const [a, b] = P(x, y);
    s.dot(a, b, r, SPIRIT[3]);
  }
  s.shadeEdges(SPIRIT[3], SPIRIT[4], SPIRIT[2], 2);
  const [r0, r1] = P(-12, -16);
  const [m0, m1] = P(-2, -18);
  const [h0, h1] = P(6, -19);
  s.hairline(r0, r1, m0, m1, SPIRIT[5]);
  s.hairline(m0, m1, h0, h1, SPIRIT[5]);
  s.commit();
  s.begin();
  leg(-9, -8, -9 + st - sp, 0, false, SPIRIT[3]);
  const paw = p.reach > 0 ? [10 + p.reach * 9, -10 - p.reach * 4] : [6 - st + sp, p.rear > 0 ? -2 : 0];
  leg(5, -9, paw[0], paw[1], true, SPIRIT[3]);
  s.shadeEdges(SPIRIT[3], SPIRIT[4], SPIRIT[2]);
  s.commit();
  s.begin();
  const lift = p.jaw * 2;
  const [hx, hy] = P(12, -14 - lift);
  s.dot(hx, hy, 4.2, SPIRIT[3]);
  const [nx, ny] = P(16.5, -12.5 - lift * 1.4);
  s.dot(nx, ny, 2.3, SPIRIT[3]);
  for (const ex of [9.5, 12.5]) {
    const [ax, ay] = P(ex, -18 - lift);
    s.dot(ax, ay, 1.4, SPIRIT[3]);
  }
  s.shadeEdges(SPIRIT[3], SPIRIT[4], SPIRIT[2]);
  s.commit();
  s.begin();
  const [ix, iy] = P(13.5, -15 - lift);
  s.set(ix, iy, SPIRIT[6]);
  const [px0, py0] = P(18.5, -13 - lift * 1.4);
  s.set(px0, py0, SPIRIT[1]);
  if (p.jaw > 0) {
    const [mx, my] = P(16, -10.5 - lift);
    s.stroke(mx, my, mx + 2, my + p.jaw, 0.6, SPIRIT[1]);
  }
  const claws: (readonly [number, number])[] = [
    [-6 - st - sp, 0],
    [-9 + st - sp, 0],
    P(8 + st + sp, p.rear > 0 ? -3 : 0),
    P(paw[0], paw[1]),
  ];
  for (const [x, y] of claws) s.set(x + 1.5, y - 0.5, SPIRIT[6]);
  s.commit(false);
  s.outline(SPIRIT[1]);
}

/** draw the bear with its feet at (x, y), facing `face`, faded by `alpha`: a soft glow round it, its eye burning */
export function blitBear(p: BearPose, x: number, y: number, face: number, alpha: number): void {
  drawBear(p);
  place();
  glow(x, y - 12, 26, SPIRIT[4], 0.2 * alpha);
  blit(canvas, x, y, face < 0, { alpha: alpha * 0.9, soft: true });
  place();
  glow(x + face * 13.5, y - 15 - p.jaw * 2 - p.rear * 10, 4, SPIRIT[6], 0.6 * alpha);
}
