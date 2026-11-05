import { detailCanvas, type SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import type { Enemy } from "../../../types/enemy";
import { mix, WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game } from "../../state";
import { RAIN_FOES as C, STORM_VOLT as V } from "./colors";
import { block, glint, hairline } from "./detail";
import { KITE_WINDUP } from "./stormkite";

const canvas = detailCanvas(44, 48, 22, 16);

type Point = [number, number];

/** the side veins: where each leaves a spar (spar 0 to 3 and how far along it) and the bends it takes into the hide */
const BRANCHES = [
  [0, 0.45, -1.2, 0.3, -1, 1.1],
  [0, 0.7, 1.4, 0.6, 0.8, 1.4],
  [1, 0.5, 0.4, -1.4, 1.2, -0.6],
  [1, 0.75, -0.6, 1.3, 0.2, 1.2],
  [2, 0.45, 1.2, 0.4, 0.6, 1.2],
  [2, 0.7, -1.3, 0.2, -0.8, 1],
  [3, 0.5, -0.4, -1.3, -1, -0.4],
  [3, 0.75, 0.5, 1.3, -0.4, 1],
] as const;

const along = (a: Point, b: Point, u: number): Point => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];

/**
 * A living storm kite: a diamond of taut storm hide stretched over violet veins, lit along its upper edges, with side
 * veins that crackle in turn and all at once as it charges; one glowing eye at the cross, a tail of bows in the wind.
 */
export function drawStormkite(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const wind = e.state === "wind";
  const charge = wind ? clamp(e.st / (KITE_WINDUP * waveScale(game.wave).windup)) : 0;
  const flap = wind ? 0 : Math.sin(time * 5) * 1.5;
  const lean = e.state === "dive" ? 2 : 0;
  const top: Point = [2 + lean, -9];
  const front: Point = [8 + lean * 0.5, -1 - flap];
  const bottom: Point = [-1 - lean, 8];
  const back: Point = [-8, -1 + flap];
  const hub: Point = [0.5, -0.5];
  s.clear();
  // the tail streams out behind and below, a twisted cord with three bows
  s.begin();
  let px0 = bottom[0];
  let py0 = bottom[1];
  const bows: Point[] = [];
  for (let i = 1; i <= 8; i++) {
    const x = bottom[0] - i * 1.4 - lean;
    const y = bottom[1] + i * 2.4;
    const wx = x + Math.sin(time * 7 - i * 0.8) * (0.4 + i * 0.35);
    s.stroke(px0, py0, wx, y, 0.7, C.kiteDark);
    if (i % 3 === 0) bows.push([wx, y]);
    px0 = wx;
    py0 = y;
  }
  s.shadeEdges(C.kiteDark, C.kite, C.kiteDeep);
  s.commit(false);
  s.begin();
  for (const [x, y] of bows) {
    s.stroke(x - 1.8, y - 1, x + 1.8, y + 1, 0.8, C.kiteVein);
    s.shadeEdges(C.kiteVein, C.veinHot, C.veinDeep);
    block(s, x - 0.5, y - 0.5, C.kiteRim);
  }
  s.commit();
  // the diamond: four facets of hide around the cross, the upper left one catching the light, the lower right in shade
  s.begin();
  s.poly([top, hub, back], C.kiteLight);
  s.poly([top, front, hub], C.kite);
  s.poly([back, hub, bottom], C.kite);
  s.poly([hub, front, bottom], C.kiteDark);
  s.shadeEdges(C.kiteLight, C.kiteRim, C.kiteDark, 2);
  s.shadeEdges(C.kite, C.kiteLight, C.kiteDark, 2);
  s.shadeEdges(C.kiteDark, C.kite, C.kiteDeep);
  // the hide sags between the spars: a soft fold of shade down each facet
  hairline(s, ...along(top, back, 0.5), ...along(hub, back, 0.35), C.kite);
  hairline(s, ...along(top, front, 0.5), ...along(hub, front, 0.35), C.kiteDark);
  hairline(s, ...along(back, bottom, 0.5), ...along(hub, bottom, 0.4), C.kiteDark);
  hairline(s, ...along(front, bottom, 0.5), ...along(hub, bottom, 0.45), C.kiteDeep);
  // the spars, white hot in flickers as the charge gathers, and the side veins crackling off them
  const vein = wind ? mix(C.kiteVein, WHITE, charge * (Math.sin(t * 60) > 0 ? 1 : 0.5)) : C.kiteVein;
  const spars: [Point, Point][] = [
    [top, hub],
    [front, hub],
    [bottom, hub],
    [back, hub],
  ];
  const spark = Math.floor(time * 7) % BRANCHES.length;
  BRANCHES.forEach(([k, u, ax, ay, bx, by], i) => {
    const [x0, y0] = along(spars[k][0], spars[k][1], u);
    const lit = wind ? Math.sin(t * 45 + i * 1.7) > -0.3 : i === spark;
    const c: Color = wind ? (lit ? C.veinHot : C.kiteVein) : lit ? C.kiteVein : C.veinDeep;
    hairline(s, x0, y0, x0 + ax, y0 + ay, c);
    hairline(s, x0 + ax, y0 + ay, x0 + ax + bx, y0 + ay + by, c);
  });
  for (const [end] of spars) s.stroke(hub[0], hub[1], ...along(hub, end, 0.86), 0.4, vein);
  // storm light glinting off the upper edges and the top tip
  glint(s, top[0] - 0.5, top[1] + 1, C.kiteGlint);
  glint(s, ...along(top, back, 0.35), C.kiteGlint);
  s.set(...along(top, back, 0.6), C.kiteGlint);
  s.set(...along(top, front, 0.3), C.kiteRim);
  // the eye at the cross of the veins: a dark socket, a violet iris and a hot core, all white as the charge gathers
  s.dot(hub[0], hub[1], 1.7, C.kiteDeep);
  s.dot(hub[0] + 0.2, hub[1] - 0.1, 1.05, wind ? V[3] : C.kiteVein);
  s.dot(hub[0] + 0.35, hub[1] - 0.25, 0.55, wind ? WHITE : C.eye);
  s.set(hub[0] - 0.3, hub[1] - 0.6, WHITE);
  s.commit();
  // the gathering charge crackles off its lower edges and pools in a ball under the tip
  if (wind) {
    s.begin();
    for (let i = 0; i < 4; i++) {
      const u = (Math.sin(t * 37 + i * 2.3) + 1) / 2;
      const left = i % 2 === 0;
      const [ax, ay] = along(left ? back : front, bottom, u);
      const c = charge > 0.6 ? WHITE : V[3];
      const side = left ? -1 : 1;
      hairline(s, ax, ay + 0.5, ax + side * 0.8, ay + 1.4, c);
      hairline(s, ax + side * 0.8, ay + 1.4, ax + side * 0.3, ay + 2.2, c);
    }
    if (charge > 0.3) {
      const r = 0.6 + charge;
      s.dot(bottom[0], bottom[1] + 1.5, r, V[3]);
      s.shadeEdges(V[3], V[4], V[2]);
      block(s, bottom[0] - 0.5, bottom[1] + 1, WHITE);
    }
    s.commit(false);
  }
  s.outline(C.outline);
  return s;
}
