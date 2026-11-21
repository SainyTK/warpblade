import { ellipseRing, fleck, glow, hairline, place, sparkle } from "../../engine/frame";
import type { Fighter, Session } from "../../types/drill";
import { TAU } from "../../utils/math";
import { CHARGE_START } from "../constants";
import { chargedTier } from "../simulation";

const AURAS = {
  warmup: { radius: 11, motes: 4, rings: 0, strength: 0.3 },
  crescent: { radius: 15, motes: 7, rings: 1, strength: 0.46 },
  spires: { radius: 18, motes: 9, rings: 2, strength: 0.57 },
  rift: { radius: 21, motes: 11, rings: 2, strength: 0.65 },
  nova: { radius: 24, motes: 13, rings: 3, strength: 0.77 },
};

export function drawSkillCharge({ profile, fighter }: Session): void {
  const { x, y, chargeHeldFor }: Fighter = fighter;
  if (chargeHeldFor === null || chargeHeldFor < CHARGE_START) {
    return;
  }
  const tier = chargedTier(profile, chargeHeldFor);
  const kind = tier?.look ?? "warmup";
  const color = tier?.color ?? 0xb5d5ff;
  const { radius, motes, rings, strength } = AURAS[kind];
  const pulse = 0.84 + Math.sin(chargeHeldFor * 21) * 0.16;
  place(x, y);
  glow(0, -17, radius + 11, color, strength * pulse);
  for (let i = 0; i < rings; i++) {
    const span = radius + pulse * 2 - i * 2;
    ellipseRing(0, -3 - i * 12, span, 3.3 + i, color, strength * pulse * (1 - i * 0.15));
  }
  for (let i = 0; i < motes; i++) {
    const theta = (i / motes) * TAU + chargeHeldFor * (3.3 + rings * 0.6);
    const px = Math.cos(theta) * (radius + (i % 3) * 2);
    const py = -((chargeHeldFor * (31 + rings * 6) + i * 5) % (29 + rings * 5));
    if (kind === "rift" && i % 3 === 0) {
      hairline(px, py, px - 4, py - 4, color, 0.9 * pulse);
      hairline(px - 4, py - 4, px, py - 9, 0xeecbff, 0.78 * pulse);
    } else if (kind === "nova" && i % 3 === 0) {
      sparkle(px, py, 2 + pulse, color, 0xffffff, 0.8 * pulse);
    } else if (kind === "spires") {
      hairline(px, py, px + 0.4, py + 4, color, 0.69 * pulse);
    } else {
      fleck(px, py, color, 0.85 * pulse);
    }
  }
  place();
}
