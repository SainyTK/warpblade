import { fleck, glow, hairline, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { skillValues } from "../../../../game/skills/query";
import { nearestFoe } from "../../../../game/skills/targets";
import { game, progress } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { hex, WHITE } from "../../../../utils/color";
import { lerp } from "../../../../utils/math";
import { SAND_SPARKS } from "../../constants/palette";
import { openWounds } from "../wounds";

const ID = "za_hawk";
/** a dive: seconds rising to its height over the foe, then stooping onto it */
const DIVE = { rise: 0.22, stoop: 0.16, height: 46 } as const;
/** the hawk's colours: dark back, tawny wing, pale belly */
const PLUMAGE = [hex("#3a2418"), hex("#a8763a"), hex("#f0cf8a")] as const;

/** a hawk with wings at `flap` (0 spread, 1 folded), its beak toward `dir` */
function drawHawk(x: number, y: number, dir: number, flap: number): void {
  const span = 6 * (1 - flap * 0.7);
  const lift = 3 * (1 - flap);
  hairline(x - span, y - lift, x, y, PLUMAGE[1]);
  hairline(x + span, y - lift, x, y, PLUMAGE[1]);
  hairline(x - span * 0.6, y - lift * 0.5, x + span * 0.6, y - lift * 0.5, PLUMAGE[0]);
  fleck(x, y + 1, PLUMAGE[2]);
  fleck(x + dir, y, WHITE);
}

/**
 * A desert hawk called at (x, y): it climbs over the nearest foe and stoops onto it, cutting it, opening wounds and, at
 * Desert Hawk's level 6, knocking it down; it dives as many times as the skill gives, choosing the nearest foe each time.
 */
export function callHawk(x0: number, y0: number): void {
  const v = skillValues(ID);
  if (!v.power) return;
  let x = x0;
  let y = y0;
  let t = 0;
  let dives = v.dives ?? 1;
  let foe: Enemy | null = nearestFoe(x, y);
  let from: [number, number] = [x, y];
  const fx: Effect = {
    update(dt) {
      if (!foe || foe.hp <= 0) foe = nearestFoe(x, y);
      if (!foe) return false;
      t += dt;
      const [tx, ty] = enemyCenter(foe);
      if (t < DIVE.rise) {
        const u = t / DIVE.rise;
        x = lerp(from[0], tx, u * 0.6);
        y = lerp(from[1], ty - DIVE.height, u);
        return true;
      }
      const u = Math.min(1, (t - DIVE.rise) / DIVE.stoop);
      x = lerp(x, tx, u);
      y = lerp(ty - DIVE.height, ty, u * u);
      if (u < 1) return true;
      dealDamage(foe, progress.stats.ad * v.power, { fromX: x, ky: -20, source: ID, stun: v.stun });
      openWounds(foe, v.wounds ?? 0);
      game.fx.push(createImpact(tx, ty, 1, false, SAND_SPARKS));
      dives--;
      t = 0;
      from = [x, y];
      foe = null;
      return dives > 0;
    },
    draw() {
      place();
      const stooping = t >= DIVE.rise;
      drawHawk(
        x,
        y,
        foe ? Math.sign(enemyCenter(foe)[0] - x) || 1 : 1,
        stooping ? 1 : Math.abs(Math.sin(t * 30)) * 0.6,
      );
      if (stooping) glow(x, y, 6, SAND_SPARKS[2], 0.25);
    },
  };
  game.fx.push(fx);
}
