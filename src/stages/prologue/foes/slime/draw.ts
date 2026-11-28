import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { glowEye } from "../../../../game/enemies/day/paint";
import type { Enemy } from "../../../../types/enemy";
import { SLIME_COLORS as C } from "./colors";
import { type SlimePose, slimePose } from "./pose";

const canvas = detailCanvas(26, 24, 13, 21);
const G = C.gel;
const OUTLINE_STEPS = 18;

function dome(p: SlimePose): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i <= OUTLINE_STEPS; i++) {
    const a = Math.PI + (i / OUTLINE_STEPS) * Math.PI;
    const rise = -Math.sin(a);
    const shoulder = rise > 0.5 ? p.lean * (rise - 0.5) : 0;
    const flare = 1.18 - 0.42 * rise ** 1.5;
    const crown = Math.sign(Math.sin(a)) * Math.abs(Math.sin(a)) ** 0.75;
    points.push([Math.cos(a) * p.half * flare + shoulder + p.quiver, crown * p.tall + 0.4]);
  }
  return points;
}

function body(s: SpriteCanvas, p: SlimePose, hot: boolean): void {
  s.begin();
  s.poly(dome(p), G[2]);
  s.shadeEdges(G[2], G[3], G[1], 2);
  s.commit();
  s.begin();
  s.dot(-p.half * 0.35, -p.tall * 0.3, 0.9, hot ? C.coreHot : C.core);
  s.set(-p.half * 0.35, -p.tall * 0.3, hot ? C.coreHot : C.core);
  s.set(-p.half * 0.35 - 1.5, -p.tall * 0.18, C.core);
  s.commit(false);
  s.begin();
  s.hairline(-p.half + 1, -0.3, p.half - 1, -0.3, C.gelDeep);
  s.hairline(-p.half + 1.6, -0.8, p.half - 1.6, -0.8, G[1]);
  s.commit(false);
  s.begin();
  s.stroke(-p.half * 0.55 + p.lean * 0.3, -p.tall * 0.62, -p.half * 0.3 + p.lean * 0.3, -p.tall * 0.78, 0.4, G[4]);
  s.set(-p.half * 0.55 + p.lean * 0.3, -p.tall * 0.62, C.shine);
  s.set(-p.half * 0.62, -p.tall * 0.42, G[3]);
  s.commit(false);
}

function moss(s: SpriteCanvas, p: SlimePose, time: number): void {
  const top = -p.tall + 1;
  const x = p.lean * 0.9 + p.quiver - 0.5;
  s.begin();
  s.dot(x - 1.6, top + 0.6, 1.4, C.moss[2]);
  s.dot(x + 0.6, top + 0.2, 1.6, C.moss[2]);
  s.dot(x + 2.4, top + 0.9, 1.1, C.moss[2]);
  s.shadeEdges(C.moss[2], C.moss[3], C.moss[1]);
  s.commit();
  const sway = Math.sin(time * 3) * 0.6;
  s.begin();
  s.hairline(x + 0.5, top - 0.4, x + 0.8 + sway, top - 3, C.stem);
  s.commit(false);
  s.begin();
  s.poly(
    [
      [x + 0.8 + sway, top - 2.8],
      [x + 3.6 + sway, top - 4.6],
      [x + 2 + sway, top - 2.2],
    ],
    C.leaf[2],
  );
  s.poly(
    [
      [x + 0.6 + sway, top - 2.4],
      [x - 2 + sway, top - 3.6],
      [x - 0.6 + sway, top - 1.8],
    ],
    C.leaf[1],
  );
  s.shadeEdges(C.leaf[2], C.leaf[3], C.leaf[0]);
  s.commit();
}

function face(s: SpriteCanvas, p: SlimePose, fierce: boolean): void {
  const y = -p.tall * 0.55;
  const x = p.half * 0.2 + p.lean * 0.7 + p.quiver;
  s.begin();
  if (p.hurt) {
    s.hairline(x - 0.5, y - 0.5, x + 0.5, y + 0.5, C.eye);
    s.hairline(x + 2.5, y - 0.5, x + 3.5, y + 0.5, C.eye);
    s.commit(false);
    return;
  }
  s.block(x - 0.5, y - 1.5, C.eye, 1, 2);
  s.block(x + 2.5, y - 1.5, C.eye, 1, 2);
  if (fierce) {
    glowEye(s, x - 0.5, y - 1.5, C.core, C.coreHot);
    glowEye(s, x + 2.5, y - 1.5, C.core, C.coreHot);
  } else {
    s.set(x - 0.5, y - 1.5, C.eyeGlint);
    s.set(x + 2.5, y - 1.5, C.eyeGlint);
  }
  s.hairline(x + 0.5, y + 1, x + 2, y + 1, G[1]);
  s.commit(false);
}

export function drawSlime(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = slimePose(e, t);
  const fierce = e.state === "wind" || e.state === "lunge";
  s.clear();
  body(s, p, fierce);
  moss(s, p, time);
  face(s, p, fierce);
  s.outline(C.outline);
  return s;
}
