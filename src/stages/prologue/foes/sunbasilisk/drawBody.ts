import type { SpriteCanvas } from "../../../../engine/sprite";
import { mix, WHITE } from "../../../../utils/color";
import { BASILISK_COLORS as C } from "./colors";
import { type SpinePoint, TAIL } from "./spine";

const S = C.scale;
const PLATES = [10, 12, 14, 16] as const;

function hide(s: SpriteCanvas, spine: readonly SpinePoint[]): void {
  s.begin();
  for (let i = 1; i < spine.length; i++) {
    const a = spine[i - 1];
    const b = spine[i];
    s.taper(a.x, a.y, b.x, b.y, a.r, b.r, S[1]);
  }
  s.shadeEdges(S[1], S[2], S[0], 3);
  for (const q of spine) if (q.r > 2) s.dot(q.x, q.y + q.r * 0.68, q.r * 0.34, C.belly[1]);
  s.shadeEdges(C.belly[1], C.belly[2], C.belly[0]);
  for (let i = 1; i < spine.length; i++) {
    const a = spine[i - 1];
    const b = spine[i];
    s.taper(a.x, a.y - a.r * 0.45, b.x, b.y - b.r * 0.45, a.r * 0.5, b.r * 0.5, S[3]);
  }
  s.shadeEdges(S[3], S[4], S[2], 2);
  for (const q of spine)
    for (let a = -0.9; a <= 0.9; a += 0.45) {
      const x = q.x + Math.sin(a) * q.r * 0.7;
      const y = q.y + Math.cos(a) * q.r * 0.1 - q.r * 0.2;
      s.set(x, y, S[1]);
      s.set(x + 0.5, y - 0.5, S[4]);
    }
  s.commit();
}

function ridge(s: SpriteCanvas, spine: readonly SpinePoint[]): void {
  s.begin();
  for (let i = 2; i < spine.length - 1; i++) {
    const q = spine[i];
    if (i / spine.length > TAIL + 0.05) continue;
    const len = 1 + q.r * 0.5;
    s.taper(q.x + 0.5, q.y - q.r + 0.5, q.x - len * 0.6, q.y - q.r - len, 0.6, 0.2, C.spine[1]);
  }
  s.shadeEdges(C.spine[1], C.spine[2], C.spine[0]);
  s.commit();
  s.begin();
  for (let i = 1; i < spine.length; i += 2) {
    const q = spine[i];
    if (i / spine.length > TAIL) continue;
    s.hairline(q.x, q.y - q.r * 0.6, q.x - 0.4, q.y + q.r * 0.4, S[0]);
  }
  s.commit(false);
}

function plates(s: SpriteCanvas, spine: readonly SpinePoint[], heat: number): void {
  const hot = heat > 0.8 ? WHITE : mix(C.crack, C.crackHot, heat);
  for (const i of PLATES) {
    const q = spine[i];
    const top = q.y - q.r;
    s.begin();
    s.poly(
      [
        [q.x - 3.2, top + 2],
        [q.x - 2.2, top - 2.2],
        [q.x + 1.6, top - 3],
        [q.x + 3.2, top + 2],
      ],
      C.stone[2],
    );
    s.shadeEdges(C.stone[2], C.stone[4], C.stone[1], 2);
    s.hairline(q.x - 0.5, top - 2, q.x + 0.5, top + 1, C.stone[1]);
    s.commit();
    s.begin();
    s.dot(q.x - 0.8, top - 2.3, 1.2, C.moss[2]);
    s.dot(q.x + 1, top - 2.6, 0.9, C.moss[3]);
    s.shadeEdges(C.moss[2], C.moss[4], C.moss[1]);
    s.commit();
    s.begin();
    s.hairline(q.x + 3.4, top + 1.5, q.x + 3.8, top + 4.5, hot);
    s.hairline(q.x + 3.8, top + 4.5, q.x + 3, top + 6.5, C.crack);
    s.commit(false);
  }
}

export function drawBody(s: SpriteCanvas, spine: readonly SpinePoint[], heat: number): void {
  hide(s, spine);
  ridge(s, spine);
  plates(s, spine, heat);
}
