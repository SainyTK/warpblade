import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { skin } from "../skin";

/** a point d along the weapon from the hand and w across it, below the rail when positive */
export type Along = (d: number, w: number) => [number, number];

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
  // the recurved limbs, up and down from the nose, tipped back
  part(s, HC.blade, HC.bladeEdge, HC.bladeDeep, () => {
    for (const side of [-1, 1]) {
      const root = at(nose + 0.5, 0);
      const mid = at(nose + 1.2, side * 3.5);
      const tip = at(nose - 0.3, side * 6);
      s.stroke(root[0], root[1], mid[0], mid[1], 0.6, HC.blade);
      s.stroke(mid[0], mid[1], tip[0], tip[1], 0.5, HC.bladeBack);
    }
  });
  // the string drawn back to the latch
  s.begin();
  const latch = at(nose - 4, -0.9);
  for (const side of [-1, 1]) {
    const tip = at(nose - 0.3, side * 6);
    s.stroke(tip[0], tip[1], latch[0], latch[1], 0.2, HC.trimLight);
  }
  s.commit(false);
  // the bolt's jade head at the nose
  s.begin();
  const head = at(L - 0.5, -0.9);
  const neck = at(L - 1.5, -0.9);
  s.set(neck[0], neck[1], skin.ramp[3]);
  s.set(head[0], head[1], skin.ramp[5]);
  s.commit(false);
}
