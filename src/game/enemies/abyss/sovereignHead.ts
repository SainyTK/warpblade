import { WHITE } from "../../../utils/color";
import { TAU } from "../../../utils/math";
import { AC, VOID } from "./colors";
import type { Pt } from "./paint";
import type { SovereignBody } from "./sovereignBody";
import { ARMOUR, CROWN } from "./sovereignColors";

/** the gorget round the neck, under the helm */
const GORGET = { at: [1.5, -38.5] as Pt, r: 3.2 } as const;
/** the helm: a high iron dome, a faceguard jutting the way it faces, its jaw cut square over the gorget */
const HELM: readonly Pt[] = [
  [-3, -46],
  [4.5, -46],
  [6.6, -43.6],
  [7.1, -40.6],
  [5.6, -38.2],
  [0, -38.2],
  [-3, -39.5],
  [-3.6, -43],
];
/** the visor's eye slit in image pixels, the near eye a little larger: "s" slit, "h" hot centre, "g" glow */
const VISOR = ["..ssssss.sssss", ".sghhhgssghhhg", "..sssss..sssss"];
/** the visor's top left corner */
const VISOR_AT: Pt = [0, -43.5];
/** the brow ridge over the visor, and the ridge down the faceguard below it */
const BROW: readonly [Pt, Pt] = [
  [-1.2, -44.1],
  [6.4, -43.8],
];
const RIDGE: readonly [Pt, Pt] = [
  [5.6, -42.4],
  [6.1, -39.2],
];
/** the slits of the grille over its mouth */
const GRILLE: readonly number[] = [2.5, 3.5, 4.5];
/** the crack of void light that splits the helm once it is enraged */
const HELM_CRACK: readonly Pt[] = [
  [-1.5, -46],
  [-0.6, -44.8],
  [-1.6, -43.6],
  [-0.8, -41.5],
];
/** the crown's band across the brow */
const BAND: readonly Pt[] = [
  [-3.3, -44.6],
  [5.3, -44.6],
  [5.6, -46.6],
  [-3.6, -46.6],
];
/** the crown's points: root, tip and root radius, the tallest in the middle, raked out a little at the sides */
const POINTS: readonly (readonly [number, number, number, number, number])[] = [
  [-3, -46, -5, -50.5, 0.9],
  [-0.6, -46.4, -1.6, -53, 1.1],
  [1.8, -46.4, 1.8, -56, 1.3],
  [4.2, -46.4, 5.2, -53, 1.1],
  [5.4, -46, 7.4, -50.5, 0.9],
];
/** the gem on the band, in image pixels: "t" setting, "f" void fire */
const GEM = [".t.", "tft", ".t."];
/** the black sun that burns behind its crown once it is enraged: its center, radius, arcs, how fast they turn and how
 *  far the rays off them reach */
const CORONA = { at: [1.4, -48] as Pt, r: 9.5, arcs: 6, gap: 0.28, spin: 1.1, ray: 3.5 } as const;

/** a broken ring of void light behind the crown, turning: the black sun it was crowned under */
export function drawCorona(b: SovereignBody): void {
  if (!b.enraged) return;
  const { g, time } = b;
  const [cx, cy] = b.at(...CORONA.at);
  const steps = Math.ceil(TAU * CORONA.r * g.s.res * 1.3);
  b.g.s.begin();
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * TAU;
    const along = (((((a + time * CORONA.spin) / TAU) * CORONA.arcs) % 1) + 1) % 1;
    if (along < CORONA.gap) continue;
    const tone = along > 0.85 ? VOID[5] : along > 0.55 ? VOID[4] : VOID[3];
    g.set(cx + Math.cos(a) * CORONA.r, cy + Math.sin(a) * CORONA.r, tone);
    g.set(cx + Math.cos(a) * (CORONA.r - 0.5), cy + Math.sin(a) * (CORONA.r - 0.5), VOID[2]);
  }
  // a ray of black fire stands off the middle of each arc, flickering in length like the sun's own
  for (let j = 0; j < CORONA.arcs; j++) {
    const a = ((j + (1 + CORONA.gap) / 2) / CORONA.arcs) * TAU - time * CORONA.spin;
    const reach = CORONA.ray * (0.7 + 0.3 * Math.sin(time * 8 + j * 2.4));
    const [ux, uy] = [Math.cos(a), Math.sin(a)];
    g.hairline(
      cx + ux * (CORONA.r + 0.5),
      cy + uy * (CORONA.r + 0.5),
      cx + ux * (CORONA.r + reach),
      cy + uy * (CORONA.r + reach),
      VOID[3],
    );
    g.set(cx + ux * (CORONA.r + 0.5), cy + uy * (CORONA.r + 0.5), VOID[5]);
  }
  b.g.s.commit(false);
}

/** the helm over its gorget, the burning eyes in its visor slit, and the crown of bone points on its brow */
export function drawHead(b: SovereignBody): void {
  const { g, time, hot } = b;
  b.g.s.begin();
  g.dot(...b.at(...GORGET.at), GORGET.r, ARMOUR.dark);
  b.g.s.shadeEdges(ARMOUR.dark, ARMOUR.light, ARMOUR.deep, 2);
  b.g.s.commit();
  b.g.s.begin();
  g.poly(
    HELM.map((p) => b.at(...p)),
    ARMOUR.base,
  );
  b.g.s.shadeEdges(ARMOUR.base, ARMOUR.sheen, ARMOUR.dark, 2);
  g.hairline(...b.at(...BROW[0]), ...b.at(...BROW[1]), ARMOUR.sheen);
  g.set(...b.at(BROW[0][0] + 1, BROW[0][1] - 0.5), ARMOUR.glint);
  g.hairline(...b.at(...RIDGE[0]), ...b.at(...RIDGE[1]), ARMOUR.light);
  g.hairline(...b.at(RIDGE[0][0] - 0.5, RIDGE[0][1]), ...b.at(RIDGE[1][0] - 0.5, RIDGE[1][1]), ARMOUR.deep);
  for (const x of GRILLE) g.hairline(...b.at(x, -40.8), ...b.at(x, -39.6), ARMOUR.deep);
  g.pixels(VISOR, { s: ARMOUR.deep, h: hot ? WHITE : AC.eye, g: hot ? AC.eye : AC.eyeDim }, ...b.at(...VISOR_AT));
  if (b.enraged) {
    // tears of void light run down the jaw guard from the eyes
    const flicker = Math.sin(time * 7) > -0.3;
    g.hairline(...b.at(1.8, -42.5), ...b.at(1.8, -40.8), flicker ? VOID[4] : VOID[3]);
    g.hairline(...b.at(5.2, -42.5), ...b.at(5.2, -41.4), VOID[3]);
    for (let i = 1; i < HELM_CRACK.length; i++)
      g.hairline(...b.at(...HELM_CRACK[i - 1]), ...b.at(...HELM_CRACK[i]), i % 2 ? VOID[4] : VOID[2]);
  }
  b.g.s.commit();
  // the crown, its points tipped with void fire that burns white once it is enraged
  b.g.s.begin();
  g.poly(
    BAND.map((p) => b.at(...p)),
    CROWN.base,
  );
  for (const [x0, y0, x1, y1, r] of POINTS) g.taper(...b.at(x0, y0), ...b.at(x1, y1), r, 0.3, CROWN.base);
  // enraged, the bone blanches and its lit edges burn white
  if (b.enraged) b.g.s.shadeEdges(CROWN.base, CROWN.glint, CROWN.base, 2);
  else b.g.s.shadeEdges(CROWN.base, CROWN.light, CROWN.dark, 2);
  g.hairline(...b.at(-3.2, -45.1), ...b.at(5.3, -45.1), CROWN.dark);
  g.pixels(GEM, { t: CROWN.glint, f: hot ? VOID[5] : VOID[3] }, ...b.at(0.9, -46.4));
  POINTS.forEach(([, , x, y], i) => {
    const flick = Math.sin(time * 6 + i * 1.7);
    const tip = b.at(x, y);
    g.set(tip[0], tip[1] + 0.5, b.enraged ? WHITE : flick > 0 ? VOID[4] : VOID[3]);
    g.set(tip[0], tip[1], b.enraged ? VOID[5] : VOID[3]);
    // enraged, a lick of flame stands off each point
    if (b.enraged && flick > -0.4) g.set(tip[0], tip[1] - 0.5 - (flick > 0.5 ? 0.5 : 0), VOID[4]);
  });
  b.g.s.commit();
}
