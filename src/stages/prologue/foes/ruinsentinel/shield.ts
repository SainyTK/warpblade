import type { SpriteCanvas } from "../../../../engine/sprite";
import { mix, WHITE } from "../../../../utils/color";
import { SENTINEL_COLORS as C } from "./colors";
import type { SentinelPose } from "./pose";

const S = C.shield;
const RAYS = 8;

export function drawShield(s: SpriteCanvas, p: SentinelPose): void {
  const x = p.shieldX + p.lean;
  const y = p.shieldY;
  s.begin();
  s.poly(
    [
      [x - 3, y],
      [x + 3.5, y],
      [x + 4, y - 20],
      [x + 1.5, y - 24.5],
      [x - 2.5, y - 23],
      [x - 3.5, y - 12],
    ],
    S[2],
  );
  s.shadeEdges(S[2], S[3], S[1], 2);
  s.hairline(x - 2, y - 1, x - 2.5, y - 21, S[1]);
  s.commit();
  s.begin();
  const cx = x + 0.5;
  const cy = y - 13.5;
  for (let i = 0; i < RAYS; i++) {
    const a = (i / RAYS) * Math.PI * 2;
    s.hairline(cx + Math.cos(a) * 2, cy + Math.sin(a) * 2.4, cx + Math.cos(a) * 3.2, cy + Math.sin(a) * 3.8, C.sunDim);
  }
  s.dot(cx, cy, 1.8, C.sun);
  s.shadeEdges(C.sun, C.sunLit, C.sunDim);
  s.commit(false);
  s.begin();
  const crack = p.heat > 0.7 ? WHITE : mix(C.crack, C.crackHot, p.heat);
  s.hairline(x + 3.5, y - 18, x + 1.5, y - 15, C.crack);
  s.hairline(x + 1.5, y - 15, x + 2.5, y - 10, C.crack);
  s.hairline(x + 2.5, y - 10, x + 0.5, y - 5, C.crack);
  s.set(x + 1.5, y - 15, crack);
  s.set(x + 2, y - 11, crack);
  s.commit(false);
  s.begin();
  for (let i = 0; i < 4; i++) s.dot(x - 2.5 + i * 1.3, y - 23.5 + Math.abs(i - 1.5) * 0.4, 0.9, C.moss[1]);
  s.taper(x - 2.8, y - 22, x - 3.3, y - 17, 0.5, 0.25, C.moss[1]);
  s.shadeEdges(C.moss[1], C.moss[2], C.moss[0]);
  s.set(x - 1.5, y - 24.4, C.moss[4]);
  s.commit();
}
