import type { SpriteCanvas } from "../../../../engine/sprite";
import { DAY_COLORS as DC } from "../../../../game/enemies/day/colors";

const K = DC.bark;

export function rootLeg(s: SpriteCanvas, hx: number, fx: number, lift: number, near: boolean): void {
  const base = near ? K[2] : K[1];
  s.begin();
  s.taper(hx, -7, fx, -1 - lift, near ? 2 : 1.7, 1.1, base, near ? 0.8 : -0.6);
  s.shadeEdges(base, near ? K[3] : K[2], near ? K[1] : DC.barkDeep, 2);
  s.commit();
  s.begin();
  const toe = near ? K[1] : DC.barkDeep;
  s.stroke(fx, -0.8 - lift, fx + 2.6, -0.2 - lift * 0.5, 0.55, toe);
  s.stroke(fx, -0.8 - lift, fx - 2.2, 0, 0.5, toe);
  s.stroke(fx, -0.6 - lift, fx + 0.6, 0.2 - lift * 0.3, 0.5, toe);
  s.set(fx + 2.4, -0.4 - lift, near ? K[3] : K[1]);
  s.commit();
}
