import { PAL, SPARKS } from "../../constants/palette";
import { CHILL_PACE } from "../../constants/relics/bell";
import type { Enemy } from "../../types/enemy";
import { PK } from "../../types/particle";
import { dealDamage } from "../damage";
import { particles, progress, rng } from "../state";
import { actAsBurner } from "./burn";
import { enemyCenter } from "./enemy";

/** burn ticks this fraction of ability power */
const BURN_POWER = 0.2;

/** burning, shocked, frozen and chilled foes; returns the time scale the foe moves at */
export function updateStatus(e: Enemy, dt: number): number {
  e.flash = Math.max(0, e.flash - dt);
  e.frozen = Math.max(0, e.frozen - dt);
  e.chill = Math.max(0, e.chill - dt);
  e.shock = Math.max(0, e.shock - dt);
  e.charged = Math.max(0, e.charged - dt);
  e.evadeCd = Math.max(0, e.evadeCd - dt);
  e.stagger = Math.max(0, e.stagger - dt);
  e.pinned = Math.max(0, e.pinned - dt);
  // a pinned foe stays where the glaive holds it
  if (e.pinned > 0) e.vx = 0;
  const [cx, cy] = enemyCenter(e);
  if (e.burn > 0) {
    e.burn -= dt;
    if (rng.chance(0.3))
      particles.spawn(
        PK.FIRE,
        cx + rng.range(-5, 5),
        cy + rng.range(-4, 6),
        rng.range(-8, 8),
        -20,
        rng.range(0.2, 0.4),
        {
          col: 0,
          size: rng.range(1, 1.8),
        },
      );
    e.burnTick -= dt;
    if (e.burnTick <= 0) {
      e.burnTick = 0.4;
      actAsBurner(e);
      dealDamage(e, progress.stats.ap * BURN_POWER, { dot: true, source: "abilities" });
    }
  }
  if (e.shock > 0 && rng.chance(0.25))
    particles.spawn(
      PK.SPARK,
      cx + rng.range(-6, 6),
      cy + rng.range(-6, 6),
      rng.range(-60, 60),
      rng.range(-60, 20),
      0.1,
      {
        sparks: SPARKS.volt,
      },
    );
  if (e.chill > 0 && rng.chance(0.08))
    particles.spawn(PK.FLAKE, cx + rng.range(-6, 6), cy + rng.range(-8, 4), 0, 10, rng.range(0.4, 0.7), {
      col: PAL.ice[4],
    });
  return e.shock > 0 ? 0 : e.frozen > 0 ? 0.3 : e.chill > 0 ? CHILL_PACE : 1;
}
