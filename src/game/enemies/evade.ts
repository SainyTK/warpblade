import { EVADE } from "../../constants/combat";
import { PAL } from "../../constants/palette";
import { sfx } from "../../services/audio";
import { PK } from "../../types/particle";
import { TAU } from "../../utils/math";
import { cue } from "../cue";
import { game, hero, particles, rng } from "../state";
import { kindOf } from "./kinds";

/** a swing begins: a drifting wisp in its path may slip away, more often in later waves */
export function wispsEvade(): void {
  if (game.wave < EVADE.fromWave) return;
  const chance = Math.min(EVADE.max, EVADE.base + EVADE.perWave * game.wave);
  for (const e of game.enemies) {
    if (!kindOf(e.type).evades || e.state !== kindOf(e.type).rest || e.air || e.stun > 0 || e.frozen > 0 || e.shock > 0)
      continue;
    const ahead = (e.x - hero.x) * hero.face;
    if (e.evadeCd > 0 || ahead < -6 || ahead > EVADE.reach || Math.abs(e.y - (hero.y - 18)) > 32) continue;
    e.evadeCd = EVADE.cooldown;
    if (!rng.chance(chance)) continue;
    e.vx = hero.face * EVADE.speed;
    e.vy = -50;
    cue(e.x, e.y - 12, "evade");
    for (let i = 0; i < 8; i++) {
      const a = rng.range(0, TAU);
      particles.spawn(PK.MOTE, e.x, e.y, Math.cos(a) * 60, Math.sin(a) * 60, rng.range(0.2, 0.4), {
        col: PAL.shadow[4],
        size: 0.7,
      });
    }
    sfx.evade();
  }
}
