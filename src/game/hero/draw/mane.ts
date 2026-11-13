import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Vec } from "./reach";

/** each braid sits this far either side of the rope, and narrows from its root to the tie */
const PART = 0.9;
const ROOT = 1.2;
const TIP = 0.7;

/** one braid along the rope, shifted `off` pixels across it, each plait lit on alternate sides, tied at the end */
function drawBraid(s: SpriteCanvas, rope: readonly Vec[], off: number, light: boolean): void {
  const n = rope.length;
  const at = (i: number): Vec => {
    const [a, b] = [rope[Math.max(0, i - 1)], rope[Math.min(n - 1, i + 1)]];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    // the braids part a little more toward their ends
    const k = off * (1 + (i / n) * 0.5);
    return [rope[i][0] + ((b[1] - a[1]) / len) * k, rope[i][1] - ((b[0] - a[0]) / len) * k];
  };
  const body = light ? HC.hair : HC.hairDark;
  s.begin();
  for (let i = 1; i < n; i++) {
    const [a, b] = [at(i - 1), at(i)];
    const r0 = ROOT + ((TIP - ROOT) * (i - 1)) / (n - 1);
    const r1 = ROOT + ((TIP - ROOT) * i) / (n - 1);
    s.taper(a[0], a[1], b[0], b[1], r0, r1, body);
  }
  s.shadeEdges(body, light ? HC.hairLight : HC.hair, HC.hairDeep);
  for (let i = 1; i < n; i++) {
    const [a, b] = [at(i - 1), at(i)];
    s.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + (i % 2 ? -0.4 : 0.4), light ? HC.hairGlint : HC.hairLight);
  }
  s.commit(false);
  const tie = at(n - 1);
  s.begin();
  s.dot(tie[0], tie[1], 0.7, HC.scarf);
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark);
  s.commit(false);
}

/** a wild mane's two thick braids, trailing along the ponytail's rope: the far one darker, the near one lit */
export function drawMane(s: SpriteCanvas, tail: readonly Vec[]): void {
  if (tail.length < 2) return;
  drawBraid(s, tail, -PART, false);
  drawBraid(s, tail, PART, true);
}
