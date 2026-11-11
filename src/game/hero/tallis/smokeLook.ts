import { SMOKE_KNOT } from "../../../constants/tallis/abilities";
import { SMOKE } from "../../../constants/tallis/look";
import { shade } from "../../../engine/frame";
import type { SmokeCloud } from "../../../types/tallis";
import { game } from "../../state";

/** the billows a cloud is made of: where each sits across the cloud and up it, its size, and how fast it curls */
const PUFFS = [
  [-0.66, 0.2, 0.34, 1.3],
  [-0.32, 0.3, 0.44, 0.9],
  [0.04, 0.26, 0.48, 1.1],
  [0.4, 0.3, 0.42, 0.8],
  [0.7, 0.2, 0.32, 1.4],
  [-0.44, 0.64, 0.36, 1],
  [0.1, 0.7, 0.4, 1.2],
  [0.5, 0.6, 0.32, 0.9],
  [-0.1, 0.96, 0.27, 1.5],
] as const;

/** the light falls from the upper left, as the dusk rose rim along the billows' tops shows */
const LIGHT = [-0.45, -0.89] as const;
/** how far inside a billow's edge the smoke reaches full strength, as a share of its radius */
const SOFT = 0.1;
/** how far inside its edge a billow's lit and dark crescents reach, as a share of its radius */
const CRESCENT = 0.55;

/** the billows of one cloud this frame, reused from cloud to cloud */
const billows = PUFFS.map(() => ({ x: 0, y: 0, r: 0 }));

/**
 * One Smoke Knot: round billows rolling out over its first moment and curling after, each shaded as a ball of smoke
 * with a lit upper side, a dusk rose rim on top and a dark underside, blended over the scene so a foe inside still
 * shows as a shape. Over its last moment the billows shrink apart and climb.
 */
export function drawCloud(c: SmokeCloud): void {
  const grow = Math.min(1, c.t / SMOKE_KNOT.roll);
  const thin = Math.min(1, (c.life - c.t) / SMOKE_KNOT.thin);
  const half = c.w / 2;
  let top = c.y;
  PUFFS.forEach(([u, v, size, curl], i) => {
    const b = billows[i];
    b.x = c.x + u * half * (0.35 + 0.65 * grow) + Math.sin(game.t * curl + i * 1.7) * 2;
    b.y = c.y - v * c.h * (0.4 + 0.6 * grow) - (1 - thin) * (5 + v * 10) + Math.cos(game.t * curl * 0.8 + i) * 1;
    b.r = size * c.h * (0.5 + 0.5 * grow) * (0.35 + 0.65 * thin);
    top = Math.min(top, b.y - b.r);
  });
  shade(
    c.x - half - 6,
    top - 1,
    c.x + half + 6,
    c.y,
    (x, y, out) => {
      let best = 0;
      let lit = 0;
      for (const b of billows) {
        const dx = (x - b.x) / b.r;
        const dy = (y - b.y) / b.r;
        const d = dx * dx + dy * dy;
        if (d >= 1) continue;
        const inside = 1 - Math.sqrt(d);
        if (inside <= best) continue;
        best = inside;
        lit = dx * LIGHT[0] + dy * LIGHT[1];
      }
      if (best <= 0) return;
      out.a = Math.min(1, best / SOFT) * SMOKE.solid * (0.5 + 0.5 * thin);
      // only a billow's edge is shaded: a pale crescent where it faces the light, a dark one on its far side
      const edge = lit * (1 - Math.min(1, best / CRESCENT));
      out.c =
        edge > 0.5
          ? SMOKE.rim
          : edge > 0.26
            ? SMOKE.lit
            : edge > 0.08
              ? SMOKE.mid
              : edge > -0.3
                ? SMOKE.body
                : SMOKE.under;
    },
    { soft: true },
  );
}
