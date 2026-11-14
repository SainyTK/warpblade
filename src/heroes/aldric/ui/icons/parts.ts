import { BASE_HERO_COLORS as HC } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { DAWN_RAMP } from "../../constants/light";

/** Aldric's shapes for his 16 by 16 skill icons */
type S = SpriteCanvas;

/** the kite shield face on, centred at (cx, cy), `h` tall: white enamel, gold rim, rising sun and crystal */
export function kite(s: S, cx: number, cy: number, h: number): void {
  const w = h * 0.42;
  const top = cy - h * 0.45;
  const pts: [number, number][] = [
    [cx - w, top],
    [cx + w, top],
    [cx + w, cy + h * 0.05],
    [cx, cy + h * 0.55],
    [cx - w, cy + h * 0.05],
  ];
  s.begin();
  s.poly(pts, DAWN_RAMP[3]);
  s.commit();
  s.begin();
  s.poly(
    pts.map(([x, y]) => [cx + (x - cx) * 0.7, cy - h * 0.03 + (y - cy) * 0.75] as [number, number]),
    HC.eyeWhite,
  );
  s.commit(false);
  s.begin();
  for (const dx of [-0.6, 0, 0.6]) s.stroke(cx, top + h * 0.32, cx + dx * w, top + h * 0.1, 0.3, DAWN_RAMP[2]);
  s.dot(cx, top + h * 0.32, Math.max(0.8, h * 0.08), DAWN_RAMP[3]);
  s.set(cx, top + h * 0.3, WHITE);
  s.commit(false);
}

/** a beam of dawn light falling from the top of the icon to (x, y) */
export function beam(s: S, x: number, y: number, w: number): void {
  s.begin();
  s.stroke(x, 0, x, y, w, DAWN_RAMP[4]);
  s.commit(false);
  s.begin();
  s.stroke(x, 0, x, y, Math.max(0.3, w * 0.4), WHITE);
  s.commit(false);
}

/** a dome of light over the floor line */
export function dome(s: S, cx: number, base: number, r: number): void {
  s.begin();
  for (let a = 0; a <= Math.PI; a += 0.15) s.set(cx + Math.cos(a) * r, base - Math.sin(a) * r * 0.85, DAWN_RAMP[4]);
  s.stroke(cx - r, base, cx + r, base, 0.4, DAWN_RAMP[3]);
  s.commit(false);
}
