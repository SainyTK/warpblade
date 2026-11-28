import type { SpriteCanvas } from "../../../../engine/sprite";
import { DRAKE } from "./colors";
import type { DrakePose } from "./pose";

type Pt = readonly [number, number];
const W = DRAKE.membrane;
const E = DRAKE.ember;
const ELBOW: Pt = [7, 1];
const WRIST: Pt = [13, 3.5];
const TIPS: readonly Pt[] = [
  [26, 9],
  [21, 16],
  [14, 18],
  [7, 15],
];
const ROOT_BACK: Pt = [0, 9];
const LEAST_LIFT = 0.3;

function frame(p: DrakePose, root: Pt, near: boolean): (q: Pt) => Pt {
  const swing = 0.3 - p.flap * 0.75;
  const lift = (Math.abs(swing) < LEAST_LIFT ? LEAST_LIFT * (Math.sign(swing) || 1) : swing) * (near ? 1 : 0.85);
  const fold = 1 - p.sweep * 0.45;
  return ([u, v]) => [root[0] - v * (1 + p.sweep * 0.3) - u * 0.2 * fold, root[1] - u * lift * fold];
}

function scallop(at: (q: Pt) => Pt): Pt[] {
  const edge: Pt[] = [at([0, 0]), at(ELBOW), at(WRIST), at(TIPS[0])];
  for (let i = 1; i < TIPS.length; i++) {
    const [ax, ay] = TIPS[i - 1];
    const [bx, by] = TIPS[i];
    edge.push(at([(ax + bx) / 2 - 2.5, (ay + by) / 2 - 2]));
    edge.push(at(TIPS[i]));
  }
  edge.push(at([(TIPS[3][0] + ROOT_BACK[0]) / 2 - 1.5, (TIPS[3][1] + ROOT_BACK[1]) / 2 - 1]));
  edge.push(at(ROOT_BACK));
  return edge;
}

export function drawWing(s: SpriteCanvas, p: DrakePose, root: Pt, near: boolean): void {
  const at = frame(p, root, near);
  const outer = near ? W[3] : W[2];
  const inner = near ? W[1] : W[0];
  s.begin();
  s.poly(scallop(at), outer);
  s.shadeEdges(outer, near ? E[1] : W[3], W[0]);
  s.commit();
  s.begin();
  s.poly([at([0, 0]), at(ELBOW), at([10, 9]), at([5, 11]), at(ROOT_BACK)], inner);
  s.commit(false);
  const bone = near ? DRAKE.hide[3] : DRAKE.hide[2];
  s.begin();
  const [ex, ey] = at(ELBOW);
  const [wx, wy] = at(WRIST);
  const [rx, ry] = at([0, 0]);
  s.stroke(rx, ry, ex, ey, near ? 1.1 : 0.9, bone);
  s.stroke(ex, ey, wx, wy, near ? 0.9 : 0.7, bone);
  s.shadeEdges(bone, DRAKE.hide[4], DRAKE.hide[1]);
  s.commit();
  s.begin();
  const vein = p.heat > 0.6 ? E[4] : near ? E[3] : E[1];
  for (const tip of TIPS) {
    const [tx, ty] = at(tip);
    s.hairline(wx, wy, tx, ty, near ? DRAKE.hide[3] : DRAKE.hide[2]);
  }
  for (const tip of TIPS) {
    const [mx, my] = at([(WRIST[0] + tip[0] * 2) / 3, (WRIST[1] + tip[1] * 2) / 3]);
    const [tx, ty] = at(tip);
    s.hairline(mx, my, tx, ty, vein);
    s.set(tx, ty, near ? E[4] : E[2]);
  }
  const [lx, ly] = at(TIPS[0]);
  s.hairline(wx, wy, lx, ly, near ? E[4] : E[2]);
  s.hairline(ex, ey, wx, wy, near ? E[3] : E[1]);
  s.set(wx, wy, near ? DRAKE.horn[3] : DRAKE.horn[1]);
  s.commit(false);
}
