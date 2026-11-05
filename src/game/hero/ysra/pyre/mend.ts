import { PAL } from "../../../../constants/palette";
import { PK } from "../../../../types/particle";
import { hero, particles, progress, rng } from "../../../state";

/** heal this share of max HP, with green motes rising off her */
export function mend(share: number): void {
  hero.hp = Math.min(progress.stats.hp, hero.hp + progress.stats.hp * share);
  for (let i = 0; i < 8; i++)
    particles.spawn(PK.STAR, hero.x + rng.range(-6, 6), hero.y - rng.range(4, 26), 0, -rng.range(20, 40), 0.6, {
      col: rng.pick([PAL.heal[3], PAL.heal[4]]),
      size: rng.range(0.6, 1.4),
    });
}
