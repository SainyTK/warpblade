import { disc, ellipseRing, glow, hairline, place, sparkle } from "../../engine/frame";
import type { Pose } from "../../types/pose";
import { TAU } from "../../utils/math";
import type { Fighter } from "../simulation";
import { SPELLS } from "../spells";
import { drawnLeftHand } from "./leftArm";

export function drawReadySpell({ x, y, face, spellBook }: Fighter, pose: Pose): void {
  const { selected, preparation } = spellBook;
  if (!preparation || preparation.remaining > 0) {
    return;
  }
  const [hx, hy] = drawnLeftHand(pose);
  const { color, core } = SPELLS[selected];
  const age = preparation.readyAge;
  const pulse = 0.74 + Math.sin(age * 17) * 0.23;
  place(x + face * hx, y + hy - 0.5);
  glow(0, -1, 12, color, 0.8 * pulse);
  ellipseRing(0, -1, 4.6 + pulse, 2.6, color, pulse * 0.78);
  disc(0, -1, 2.2, core, 0.9);
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * TAU + age * 8;
    const px = Math.cos(angle) * (5.5 + (i % 2));
    const py = Math.sin(angle) * 4 - 1;
    if (selected === "ice") {
      sparkle(px, py, 1.5, color, core, pulse * 0.7);
    } else {
      hairline(px, py, px - Math.cos(angle) * 2, py - (selected === "fire" ? 3.8 : 1.7), color, pulse);
    }
  }
  place();
}
