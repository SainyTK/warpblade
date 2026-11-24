import { CHILL_PACE } from "../../constants/combat";
import { PAL, SPARKS } from "../../constants/palette";
import type { Enemy } from "../../types/enemy";
import { PK } from "../../types/particle";
import { dealDamage } from "../damage";
import { fxRng, particles, progress } from "../state";
import { actAsBurner } from "./burn";
import { enemyCenter } from "./enemy";
import { updateSkillStatus } from "./skillStatus";

/** burn ticks this fraction of ability power */
const BURN_POWER = 0.2;

/** burning, shocked, frozen and chilled foes, skill stacks and marks; returns the time scale the foe moves at */
export function updateStatus(e: Enemy, dt: number): number {
  e.flash = Math.max(0, e.flash - dt);
  e.frozen = Math.max(0, e.frozen - dt);
  e.chill = Math.max(0, e.chill - dt);
  e.shock = Math.max(0, e.shock - dt);
  e.evadeCd = Math.max(0, e.evadeCd - dt);
  e.halt = Math.max(0, e.halt - dt);
  e.pinned = Math.max(0, e.pinned - dt);
  e.blind = Math.max(0, e.blind - dt);
  updateSkillStatus(e, dt);
  // a pinned foe stays where the glaive holds it
  if (e.pinned > 0) e.vx = 0;
  const [cx, cy] = enemyCenter(e);
  if (e.burn > 0) {
    e.burn -= dt;
    if (fxRng.chance(0.3))
      particles.spawn(
        PK.FIRE,
        cx + fxRng.range(-5, 5),
        cy + fxRng.range(-4, 6),
        fxRng.range(-8, 8),
        -20,
        fxRng.range(0.2, 0.4),
        {
          col: 0,
          size: fxRng.range(1, 1.8),
        },
      );
    e.burnTick -= dt;
    if (e.burnTick <= 0) {
      e.burnTick = 0.4;
      actAsBurner(e);
      dealDamage(e, progress.stats.ap * BURN_POWER, { dot: true, source: "abilities" });
    }
  }
  if (e.shock > 0 && fxRng.chance(0.25))
    particles.spawn(
      PK.SPARK,
      cx + fxRng.range(-6, 6),
      cy + fxRng.range(-6, 6),
      fxRng.range(-60, 60),
      fxRng.range(-60, 20),
      0.1,
      {
        sparks: SPARKS.volt,
      },
    );
  if (e.chill > 0 && fxRng.chance(0.08))
    particles.spawn(PK.FLAKE, cx + fxRng.range(-6, 6), cy + fxRng.range(-8, 4), 0, 10, fxRng.range(0.4, 0.7), {
      col: PAL.ice[4],
    });
  return e.shock > 0 ? 0 : e.frozen > 0 ? 0.3 : e.chill > 0 ? CHILL_PACE : 1;
}
