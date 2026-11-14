import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { drawFitting, heldAxis } from "../../../rig";
import type { BladeLook, Vec } from "../../../types/rig";
import { WHITE } from "../../../utils/color";
import { BLADE_STATE, bladeStateOf, KATANA } from "../constants/blade";
import { drawScabbard } from "./scabbard";

type Along = (d: number, w: number) => Vec;

/** the blade's centre line bends toward its back as it nears the point */
const bend = (d: number): number => -KATANA.curve * (d / KATANA.reach) ** 2;

/** the wrapped grip, the round guard with the warp crystal set in it, and the pommel cap */
export function drawHilt(s: SpriteCanvas, at: Along): void {
  const [h0, h1] = [at(KATANA.grip, 0), at(1, 0)];
  s.begin();
  s.stroke(h0[0], h0[1], h1[0], h1[1], 0.65, HC.hilt);
  s.commit();
  s.begin();
  for (let d = KATANA.grip + 0.8; d < 0.8; d += 1.1) {
    const [x, y] = at(d, (Math.round(d * 2) % 2) * 0.4 - 0.2);
    s.set(x, y, HC.coatLight);
  }
  s.commit(false);
  drawFitting(s, () => {
    const cap = at(KATANA.grip - 0.3, 0);
    s.dot(cap[0], cap[1], 0.7, HC.trim);
  });
  s.begin();
  const g = at(KATANA.guardAt, 0);
  const [g0, g1] = [at(KATANA.guardAt, -KATANA.guard), at(KATANA.guardAt, KATANA.guard)];
  s.stroke(g0[0], g0[1], g1[0], g1[1], 0.7, HC.steelDeep);
  s.shadeEdges(HC.steelDeep, HC.steelDark, HC.hilt);
  s.commit();
  s.begin();
  s.dot(g[0], g[1], 0.55, HC.scarfLight);
  s.set(g[0] - 0.25, g[1] - 0.25, WHITE);
  s.commit(false);
}

/** the drawn blade: a collar, then a long curved single edge, white along the edge, a temper line, a dark back */
function drawSteel(s: SpriteCanvas, at: Along): void {
  const L = KATANA.reach;
  const r = KATANA.root;
  const outline: Vec[] = [];
  for (let d = r; d <= L - 1.6; d += 1) outline.push(at(d, bend(d) + 0.85));
  outline.push(at(L - 0.8, bend(L) + 0.35), at(L, bend(L) - 0.4));
  for (let d = L - 1.6; d >= r; d -= 1) outline.push(at(d, bend(d) - 0.6));
  s.begin();
  s.poly(outline, HC.blade);
  s.commit();
  s.begin();
  for (let d = r + 0.2; d < L - 0.6; d += 0.25) {
    const c = bend(d);
    const edge = at(d, c + 0.75 - Math.max(0, d - (L - 2)) * 0.35);
    const back = at(d, c - 0.5);
    const temper = at(d, c + 0.15 + Math.sin(d * 1.7) * 0.15);
    s.set(edge[0], edge[1], HC.bladeEdge);
    s.set(back[0], back[1], d < r + 2 ? HC.bladeDeep : HC.bladeBack);
    if (d < L - 2.5) s.set(temper[0], temper[1], HC.steelLight);
  }
  const tip = at(L - 0.5, bend(L) - 0.1);
  s.set(tip[0], tip[1], WHITE);
  s.commit(false);
  drawFitting(s, () => {
    const [c0, c1] = [at(KATANA.guardAt + 0.5, 0), at(r, 0)];
    s.stroke(c0[0], c0[1], c1[0], c1[1], 0.75, HC.trim);
  });
}

/**
 * Saya's katana in the near hand: drawn, it is the curved blade on its wrapped hilt; sheathed, the hand holds nothing
 * (the scabbard at the hip carries it); held for the guard, the whole sheathed katana lies in the hand.
 */
export const SAYA_BLADE: BladeLook = {
  reach: KATANA.reach,
  draw(s, hand, angle, state) {
    const kind = bladeStateOf(state);
    if (kind === BLADE_STATE.sheathed) return;
    const at = heldAxis(hand, angle);
    if (kind === BLADE_STATE.held) {
      drawScabbard(s, at(KATANA.root - 0.4, 0), at(KATANA.reach + 0.6, 0));
      drawHilt(s, at);
      return;
    }
    drawSteel(s, at);
    drawHilt(s, at);
  },
};
