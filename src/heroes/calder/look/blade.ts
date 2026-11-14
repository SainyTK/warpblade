import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { type Along, drawFitting, heldAxis } from "../../../rig";
import type { BladeLook } from "../../../types/rig";
import { DRUM, MUZZLE, SWORD_REACH as REACH } from "../constants/sword";

/** the grip, the trigger guard under it and a brass pommel */
function drawGrip(s: SpriteCanvas, at: Along): void {
  s.begin();
  const [h0, h1] = [at(-3, 0), at(1.2, 0)];
  s.stroke(h0[0], h0[1], h1[0], h1[1], 0.62, HC.hilt);
  s.commit();
  s.begin();
  const loop = [at(-0.6, 0.9), at(-0.2, 2.1), at(1, 2.1), at(1.2, 0.9)];
  for (let i = 1; i < loop.length; i++)
    s.stroke(loop[i - 1][0], loop[i - 1][1], loop[i][0], loop[i][1], 0.32, HC.steel);
  s.shadeEdges(HC.steel, HC.steelLight, HC.steelDeep);
  s.commit(false);
  drawFitting(s, () => {
    const pommel = at(-3.5, 0);
    s.dot(pommel[0], pommel[1], 0.85, HC.trim);
  });
}

/** the broad single-edged blade: a lit edge, a dark spine, a phosphor groove, and a tip clipped back to the spine */
function drawBlade(s: SpriteCanvas, at: Along): void {
  const L = REACH;
  s.begin();
  s.poly([at(DRUM.to, -1.1), at(DRUM.to, 1.6), at(L - 2, 1.45), at(L, -0.5), at(L - 1.4, -1.15)], HC.blade);
  s.commit();
  s.begin();
  for (let d = DRUM.to + 0.2; d < L - 0.6; d += 0.25) {
    const edge = at(d, 1.25 - Math.max(0, d - (L - 2.2)) * 0.8);
    const spine = at(d, -0.85);
    s.set(edge[0], edge[1], HC.bladeEdge);
    s.set(spine[0], spine[1], d < DRUM.to + 2 ? HC.bladeDeep : HC.bladeBack);
    if (d > DRUM.to + 1 && d < L - 4.5) {
      const groove = at(d, 0.15);
      s.set(groove[0], groove[1], HC.iris);
    }
  }
  s.commit(false);
}

/** the barrel along the spine, with a dark muzzle */
function drawBarrel(s: SpriteCanvas, at: Along): void {
  s.begin();
  const [b0, b1] = [at(DRUM.to - 0.4, MUZZLE.w), at(MUZZLE.d, MUZZLE.w)];
  s.stroke(b0[0], b0[1], b1[0], b1[1], 0.55, HC.steelDark);
  s.shadeEdges(HC.steelDark, HC.steel, HC.steelDeep);
  s.commit();
  s.begin();
  const muzzle = at(MUZZLE.d, MUZZLE.w);
  s.dot(muzzle[0], muzzle[1], 0.5, HC.steelDeep);
  s.commit(false);
}

/**
 * The revolving cylinder at the guard: a gunmetal drum with dark chambers, a brass band and the green warp crystal at its
 * hub. Open (`open` 1, the reload), it swings out to the spine side on its arm and shows its empty chambers.
 */
function drawDrum(s: SpriteCanvas, at: Along, open: number): void {
  const side = -DRUM.swing * open;
  const mid = (DRUM.from + DRUM.to) / 2;
  if (open > 0.05) {
    s.begin();
    const [a0, a1] = [at(mid, -0.4), at(mid, side)];
    s.stroke(a0[0], a0[1], a1[0], a1[1], 0.35, HC.steelDark);
    s.commit(false);
  }
  s.begin();
  s.poly(
    [
      at(DRUM.from, side - DRUM.half),
      at(DRUM.to, side - DRUM.half),
      at(DRUM.to + 0.3, side),
      at(DRUM.to, side + DRUM.half),
      at(DRUM.from, side + DRUM.half),
      at(DRUM.from - 0.3, side),
    ],
    HC.steel,
  );
  s.shadeEdges(HC.steel, HC.steelLight, HC.steelDeep, 2);
  s.commit();
  s.begin();
  for (const w of [-1.25, 1.25]) {
    const hole = at(mid, side + w);
    s.dot(hole[0], hole[1], 0.42, open > 0.5 ? HC.steelDeep : HC.trimDark);
  }
  const [r0, r1] = [at(DRUM.from + 0.5, side - DRUM.half + 0.2), at(DRUM.from + 0.5, side + DRUM.half - 0.2)];
  s.stroke(r0[0], r0[1], r1[0], r1[1], 0.28, HC.trim);
  s.commit(false);
  s.begin();
  const hub = at(mid, side);
  s.dot(hub[0], hub[1], 0.75, HC.iris);
  s.set(hub[0] - 0.25, hub[1] - 0.25, HC.eyeWhite);
  s.commit(false);
}

/**
 * Calder's chamber sword, built around a revolving cylinder: a brass pommel, a grip with a trigger guard, the cylinder at
 * the guard with the warp crystal at its hub, a barrel along the spine, and a broad single-edged blade with a phosphor
 * groove. `state` is the pose's `bs`: 1 swings the cylinder open for the reload.
 */
export const CALDER_BLADE: BladeLook = {
  reach: REACH,
  draw(s, hand, angle, state) {
    const at = heldAxis(hand, angle);
    drawBlade(s, at);
    drawBarrel(s, at);
    drawGrip(s, at);
    drawDrum(s, at, Math.max(0, Math.min(1, state)));
  },
};
