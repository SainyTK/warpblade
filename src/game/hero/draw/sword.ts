import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { WHITE } from "../../../utils/color";
import { skin } from "../skin";
import type { Vec } from "./reach";

/** a point d along the weapon from the hand and w across it, toward the edge */
type Along = (d: number, w: number) => [number, number];

/** a trim fitting lit from the top left */
function fitting(s: SpriteCanvas, draw: () => void): void {
  s.begin();
  draw();
  s.shadeEdges(HC.trim, HC.trimLight, HC.trimDark);
  s.commit();
}

/** the crystal sword: pommel, wrapped grip, guard, then a tapered blade with a lit edge, a dark back and a white tip */
function drawBlade(s: SpriteCanvas, at: Along): void {
  const L = skin.reach;
  s.begin();
  s.poly([at(2.4, -0.9), at(2.4, 1.1), at(L - 2.2, 0.9), at(L, 0), at(L - 2.2, -0.8)], HC.blade);
  s.commit();
  s.begin();
  for (let d = 2.6; d < L - 1; d += 0.25) {
    const edge = at(d, 0.8 - Math.max(0, d - (L - 2.6)) * 0.4);
    const back = at(d, -0.6);
    s.set(edge[0], edge[1], HC.bladeEdge);
    s.set(back[0], back[1], d < 4.5 ? HC.bladeDeep : HC.bladeBack);
  }
  const tip = at(L - 0.8, 0);
  s.set(tip[0], tip[1], WHITE);
  s.commit(false);
  fitting(s, () => {
    const [g0, g1] = [at(1.7, -2.7), at(1.7, 2.7)];
    s.stroke(g0[0], g0[1], g1[0], g1[1], 0.65, HC.trim);
  });
  s.begin();
  const [h0, h1] = [at(-2.4, 0), at(1, 0)];
  s.stroke(h0[0], h0[1], h1[0], h1[1], 0.6, HC.hilt);
  s.commit();
  fitting(s, () => {
    const pommel = at(-3, 0);
    s.dot(pommel[0], pommel[1], 0.85, HC.trim);
  });
}

/** a glaive: a long wrapped haft through the hand with a butt cap, a collar, then a curved blade of forge-fire */
function drawGlaive(s: SpriteCanvas, at: Along): void {
  const L = skin.reach;
  const head = 8;
  const neck = L - head;
  s.begin();
  const [h0, h1] = [at(-7, 0), at(neck, 0)];
  s.stroke(h0[0], h0[1], h1[0], h1[1], 0.55, HC.hilt);
  s.shadeEdges(HC.hilt, HC.gloveLight, HC.outline);
  s.commit();
  s.begin();
  for (let d = -6; d < neck - 1; d += 2.5) {
    const w = at(d, 0);
    s.set(w[0], w[1], HC.trimDark);
  }
  s.commit(false);
  fitting(s, () => {
    const cap = at(-7.5, 0);
    s.dot(cap[0], cap[1], 0.75, HC.trim);
  });
  // the blade swells on its edge side and sweeps back to a hooked point
  const bulge = (u: number) => Math.sin(Math.PI * Math.min(1, u * 1.15)) * 2.2;
  const edge: [number, number][] = [];
  const spine: [number, number][] = [];
  for (let d = 0.5; d <= head; d += 0.5) {
    const u = d / head;
    edge.push(at(neck + d, u > 0.85 ? bulge(u) * 0.5 : bulge(u) + 0.6));
    spine.push(at(neck + d, -0.5));
  }
  s.begin();
  s.poly([...spine, ...edge.reverse()], HC.blade);
  s.shadeEdges(HC.blade, HC.bladeEdge, HC.bladeBack, 2);
  s.commit();
  s.begin();
  for (let d = 1; d < head - 1; d += 0.5) {
    const back = at(neck + d, -0.3);
    s.set(back[0], back[1], d < 3 ? HC.bladeDeep : HC.bladeBack);
  }
  const tip = at(L - 0.3, bulge(1) * 0.5);
  s.set(tip[0], tip[1], WHITE);
  s.commit(false);
  fitting(s, () => {
    const [c0, c1] = [at(neck, -1.6), at(neck, 1.6)];
    s.stroke(c0[0], c0[1], c1[0], c1[1], 0.6, HC.trim);
  });
}

/** the hero's weapon in the hand at this angle */
export function drawSword(s: SpriteCanvas, hand: Vec, angle: number): void {
  const ca = Math.cos(angle);
  const sn = Math.sin(angle);
  const at: Along = (d, w) => [hand[0] + ca * d - sn * w, hand[1] + sn * d + ca * w];
  if (skin.weapon === "glaive") drawGlaive(s, at);
  else drawBlade(s, at);
}
