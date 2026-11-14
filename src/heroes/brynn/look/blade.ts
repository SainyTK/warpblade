import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { drawFitting, heldAxis } from "../../../rig";
import type { BladeLook, Vec } from "../../../types/rig";
import { WHITE } from "../../../utils/color";

/** Anvilheart from the hand: the tip, where the slab's broad body ends and the chisel tip starts, its half width, the
 *  crystal's place, the guard, and the grip back to the pommel */
const SWORD = { reach: 26, shoulder: 23.4, half: 2.4, crystal: 4, guard: 1.3, guardHalf: 3.8, grip: -4.8 } as const;

/** the blade state at which Anvilheart is carried on the back of the shoulder, drawn behind the body (`BEHIND`) */
export const CARRIED = 0.5;

/** the slab: a broad body with a chisel tip, a lit edge, a dark back, a fuller groove down the middle */
function drawSlab(s: SpriteCanvas, at: (d: number, w: number) => Vec): void {
  const { reach: L, shoulder: T, half: H } = SWORD;
  s.begin();
  s.poly([at(2, -H), at(2, H), at(T, H), at(L, -0.3), at(L - 0.8, -H)], HC.blade);
  s.shadeEdges(HC.blade, HC.bladeEdge, HC.bladeBack, 2);
  s.commit();
  s.begin();
  for (let d = 2.4; d < L - 0.4; d += 0.25) {
    const edge = at(d, d < T ? H - 0.35 : H - 0.35 - (d - T) * 1.05);
    s.set(edge[0], edge[1], HC.bladeEdge);
    if (d > 6 && d < T - 1.5) {
      const groove = at(d, -0.2);
      const lip = at(d, 0.35);
      s.set(groove[0], groove[1], HC.bladeDeep);
      s.set(lip[0], lip[1], HC.bladeEdge);
    }
  }
  const tip = at(L - 0.5, -0.3);
  s.set(tip[0], tip[1], WHITE);
  s.commit(false);
}

/** the crimson warp crystal set in the blade just above the guard, with a white glint */
function drawCrystal(s: SpriteCanvas, at: (d: number, w: number) => Vec): void {
  const c = SWORD.crystal;
  s.begin();
  s.poly([at(c - 1.3, 0), at(c, 1.2), at(c + 1.3, 0), at(c, -1.2)], HC.scarf);
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark);
  const glint = at(c - 0.3, -0.4);
  s.set(glint[0], glint[1], WHITE);
  s.commit();
}

/** the heavy cross guard with turned-down ends, the long two-hand grip and the pommel */
function drawHilt(s: SpriteCanvas, at: (d: number, w: number) => Vec): void {
  const { guard: g, guardHalf: gh, grip } = SWORD;
  s.begin();
  const [h0, h1] = [at(grip, 0), at(g, 0)];
  s.stroke(h0[0], h0[1], h1[0], h1[1], 0.7, HC.hilt);
  s.commit();
  s.begin();
  for (let d = grip + 0.8; d < g - 0.4; d += 1.4) {
    const [a, b] = [at(d, -0.6), at(d + 0.5, 0.6)];
    s.hairline(a[0], a[1], b[0], b[1], HC.gloveLight);
  }
  s.commit(false);
  drawFitting(s, () => {
    const [a, b, c, d] = [at(g + 0.6, -gh), at(g, -gh + 0.6), at(g, gh - 0.6), at(g + 0.6, gh)];
    s.stroke(a[0], a[1], b[0], b[1], 0.65, HC.trim);
    s.stroke(b[0], b[1], c[0], c[1], 0.85, HC.trim);
    s.stroke(c[0], c[1], d[0], d[1], 0.65, HC.trim);
  });
  const pommel = at(grip - 0.5, 0);
  s.begin();
  s.dot(pommel[0], pommel[1], 0.9, HC.steel);
  s.shadeEdges(HC.steel, HC.steelLight, HC.steelDeep);
  s.commit();
}

/** Anvilheart whole, held in `hand` and pointing along `angle` */
export function drawAnvilheart(s: SpriteCanvas, hand: Readonly<Vec>, angle: number): void {
  const at = heldAxis(hand, angle);
  drawSlab(s, at);
  drawCrystal(s, at);
  drawHilt(s, at);
}

/**
 * Brynn's greatsword in the near hand. While it rides on her shoulder (the blade state at `CARRIED` or more) it is
 * drawn behind her body by her extras, so the hand only holds the grip here.
 */
export const BRYNN_BLADE: BladeLook = {
  reach: SWORD.reach,
  draw(s, hand, angle, state) {
    if (state >= CARRIED) return;
    drawAnvilheart(s, hand, angle);
  },
};
