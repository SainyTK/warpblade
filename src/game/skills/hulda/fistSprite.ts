import { SPIRIT } from "../../../constants/hulda/spirits";
import { HERO_COLORS as HC } from "../../../constants/palette";
import { glow, place } from "../../../engine/frame";
import { blit, detailCanvas, type SpriteCanvas } from "../../../engine/sprite";

/** a canvas per size, the gauntlet drawn into it once */
const drawn = new Map<number, SpriteCanvas>();

/**
 * Her iron gauntlet grown huge, knuckles down, its knuckles at the origin: a wrapped forearm banded in leather, an iron
 * cuff, a squared fist with its finger ridges, a thumb at its side and a row of lit studs on the striking face. `k` is
 * its size: 1 stands as tall as she does.
 */
function fistAt(k: number): SpriteCanvas {
  const ready = drawn.get(k);
  if (ready) return ready;
  const s = detailCanvas(Math.ceil(24 * k), Math.ceil(36 * k), Math.ceil(12 * k), Math.ceil(33 * k));
  const P = (pts: readonly (readonly [number, number])[]) => pts.map(([x, y]) => [x * k, y * k] as const);
  s.begin();
  s.poly(
    P([
      [-3, -30],
      [3, -30],
      [3.5, -11],
      [-3.5, -11],
    ]),
    HC.glove,
  );
  s.shadeEdges(HC.glove, HC.gloveLight, HC.trimDark, Math.ceil(k));
  for (let y = -27; y < -12; y += 3) s.hairline(-3.2 * k, y * k, 3.2 * k, (y + 1.2) * k, HC.trimDark);
  s.commit();
  s.begin();
  s.poly(
    P([
      [-5, -12],
      [5, -12],
      [5, -8],
      [-5, -8],
    ]),
    HC.steel,
  );
  s.shadeEdges(HC.steel, HC.steelLight, HC.steelDeep, Math.ceil(k));
  s.commit();
  s.begin();
  s.poly(
    P([
      [-6, -8],
      [6, -8],
      [7, -3],
      [6, 0],
      [-6, 0],
      [-7, -3],
    ]),
    HC.steel,
  );
  s.dot(-7 * k, -5.5 * k, 1.8 * k, HC.steel);
  s.shadeEdges(HC.steel, HC.steelLight, HC.steelDeep, Math.ceil(k * 1.5));
  for (const x of [-3, 0, 3]) s.hairline(x * k, -4 * k, x * k, -0.5 * k, HC.steelDeep);
  s.commit();
  s.begin();
  for (const x of [-4.5, -1.5, 1.5, 4.5]) s.dot(x * k, 0.2 * k, 0.6 * k, HC.steelGlint);
  s.commit(false);
  s.outline(HC.outline);
  drawn.set(k, s);
  return s;
}

/** the ancestor's fist with its knuckles at (x, y), `k` times her height, in the spirits' pale light, faded by `alpha` */
export function drawAncestorFist(x: number, y: number, k: number, alpha: number): void {
  blit(fistAt(k), x, y, false, { alpha: alpha * 0.9, tint: SPIRIT[5], tintAmount: 0.35, soft: true });
  place();
  glow(x, y - 12 * k, 14 * k, SPIRIT[4], 0.3 * alpha);
}
