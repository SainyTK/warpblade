import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { skin } from "../skin";

/** a point d along the weapon from the hand and w across it, below the rail when positive */
export type Along = (d: number, w: number) => [number, number];

/** the limbs: how far each reaches across the stock, how far forward its belly bows, how far back its tip sweeps, and
 *  its radius from root to tip */
const LIMB = { span: 5.5, belly: 1.6, sweep: 0.8, root: 1, mid: 0.8, tip: 0.5 } as const;

/** a part filled then lit from the top left with its own light and dark edges */
function part(s: SpriteCanvas, base: number, light: number, dark: number, draw: () => void): void {
  s.begin();
  draw();
  s.shadeEdges(base, light, dark);
  s.commit();
}

/**
 * A repeating crossbow: a dark wooden stock from the shoulder butt to the nose, a bolt box on top with its crank lever,
 * a steel rail, recurved jade-steel limbs at the nose with the string drawn back, and a jade bolt head showing at the tip.
 */
export function drawCrossbow(s: SpriteCanvas, at: Along): void {
  const L = skin.reach;
  const nose = L - 4;
  // the stock, wider at the butt
  part(s, HC.hilt, HC.gloveLight, HC.outline, () => {
    s.poly([at(-6.5, -0.8), at(nose, -0.6), at(nose, 1), at(1, 1.2), at(-1, 2.8), at(-6.5, 2.4)], HC.hilt);
  });
  // the bolt box riding on top, with bone buckles
  part(s, HC.coatDark, HC.coatLight, HC.coatDeep, () => {
    s.poly([at(-0.5, -0.9), at(4.5, -0.9), at(4, -3.6), at(0, -3.6)], HC.coatDark);
  });
  s.begin();
  const [b0, b1] = [at(0.5, -2.3), at(3.5, -2.3)];
  s.set(b0[0], b0[1], HC.trim);
  s.set(b1[0], b1[1], HC.trim);
  s.commit(false);
  // the crank lever folded back along the box
  s.begin();
  const [c0, c1] = [at(0, -3.4), at(-3, -4.2)];
  s.stroke(c0[0], c0[1], c1[0], c1[1], 0.45, HC.steelDark);
  s.commit();
  // the rail, steel with a lit top
  s.begin();
  const [r0, r1] = [at(4.5, -0.9), at(L - 1, -0.9)];
  s.stroke(r0[0], r0[1], r1[0], r1[1], 0.4, HC.steel);
  s.commit(false);
  // a steel stirrup under the nose
  s.begin();
  const [t0, t1] = [at(nose - 0.5, 1.2), at(nose + 1.4, 1.6)];
  s.stroke(t0[0], t0[1], t1[0], t1[1], 0.35, HC.steelDark);
  s.commit(false);
  // the recurved limbs, up and down from the nose: thick at the root, swept back and curling forward at the tip
  const tips = [-1, 1].map((side) => at(nose - LIMB.sweep, side * LIMB.span));
  part(s, HC.bladeBack, HC.blade, HC.bladeDeep, () => {
    for (const side of [-1, 1]) {
      const root = at(nose + 0.6, side * 0.4);
      const mid = at(nose + LIMB.belly, side * LIMB.span * 0.55);
      const tip = at(nose - LIMB.sweep, side * LIMB.span);
      s.taper(root[0], root[1], mid[0], mid[1], LIMB.root, LIMB.mid, HC.bladeBack);
      s.taper(mid[0], mid[1], tip[0], tip[1], LIMB.mid, LIMB.tip, HC.bladeBack);
    }
  });
  // a glint where each limb bows furthest, and bone nocks at the tips
  s.begin();
  for (const side of [-1, 1]) {
    const glint = at(nose + LIMB.belly, side * LIMB.span * 0.5);
    s.set(glint[0], glint[1], HC.bladeEdge);
  }
  for (const tip of tips) s.set(tip[0], tip[1], HC.trimLight);
  s.commit(false);
  // the string drawn back to the latch, one image pixel fine
  s.begin();
  const latch = at(nose - 4, -0.9);
  for (const tip of tips) s.hairline(tip[0], tip[1], latch[0], latch[1], HC.trim);
  s.commit(false);
  // the bolt's jade head at the nose
  s.begin();
  const head = at(L - 0.5, -0.9);
  const neck = at(L - 1.5, -0.9);
  s.set(neck[0], neck[1], skin.ramp[3]);
  s.set(head[0], head[1], skin.ramp[5]);
  s.commit(false);
}
