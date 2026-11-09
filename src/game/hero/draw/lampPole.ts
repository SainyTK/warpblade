import { HERO_COLORS as HC } from "../../../constants/palette";
import { LAMP_POLE } from "../../../constants/wenna/lantern";
import type { SpriteCanvas } from "../../../engine/sprite";
import { skin } from "../skin";

/** a point d along the pole from the hand and w across it, toward its front */
type Along = (d: number, w: number) => [number, number];

/** the hook's curl in this many steps from the shank to its end */
const CURL_STEPS = 8;

/** the iron hook: a shank out of the pole's top, a curl over toward the front and a short end hanging back down */
function drawHook(s: SpriteCanvas, at: Along): void {
  const L = skin.reach;
  const { shank, curl, across, end } = LAMP_POLE;
  const top = L + shank;
  const points: [number, number][] = [at(L - 0.6, 0), at(top, 0)];
  for (let i = 1; i <= CURL_STEPS; i++) {
    const a = (i / CURL_STEPS) * Math.PI;
    points.push(at(top + Math.sin(a) * curl, (across / 2) * (1 - Math.cos(a))));
  }
  points.push(at(L + end, across));
  s.begin();
  for (let i = 1; i < points.length; i++)
    s.stroke(points[i - 1][0], points[i - 1][1], points[i][0], points[i][1], 0.36, HC.blade);
  s.shadeEdges(HC.blade, HC.bladeEdge, HC.bladeDeep);
  s.commit();
  s.begin();
  const glint = at(top + curl * 0.9, across * 0.3);
  s.set(glint[0], glint[1], HC.bladeEdge);
  s.commit(false);
}

/**
 * Wenna's lamp pole: dark wood with a grain from an iron butt cap through the hand to an iron collar, topped by the iron
 * hook her lantern hangs from (the lantern itself swings in the world, drawn by her kit). `reach` is the pole ahead of
 * the hand.
 */
export function drawLampPole(s: SpriteCanvas, at: Along): void {
  const L = skin.reach;
  const butt = LAMP_POLE.butt;
  s.begin();
  const [b0, b1] = [at(-butt, 0), at(L, 0)];
  s.stroke(b0[0], b0[1], b1[0], b1[1], 0.5, HC.hilt);
  s.shadeEdges(HC.hilt, HC.glove, HC.outline);
  s.commit();
  s.begin();
  for (let d = -butt + 3; d < L - 3; d += 5.5) {
    const [g0, g1] = [at(d, -0.25), at(d + 1.5, -0.25)];
    s.hairline(g0[0], g0[1], g1[0], g1[1], HC.gloveLight);
  }
  s.commit(false);
  s.begin();
  const cap = at(-butt - 0.3, 0);
  s.dot(cap[0], cap[1], 0.6, HC.blade);
  const collar = at(L - 1, 0);
  s.dot(collar[0], collar[1], 0.65, HC.blade);
  s.shadeEdges(HC.blade, HC.bladeEdge, HC.bladeDeep);
  s.commit();
  drawHook(s, at);
}
