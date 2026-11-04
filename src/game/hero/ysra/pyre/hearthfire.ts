import { PAL } from "../../../../constants/palette";
import { HEARTHFIRE } from "../../../../constants/ysra/heat";
import { PK } from "../../../../types/particle";
import { hasPerk } from "../../../progress";
import { hero, particles, progress, rng } from "../../../state";

/** Hearthfire: each rite heals a share of max HP, with green motes rising off her */
export function healFromRite(): void {
  if (!hasPerk("hearthfire")) return;
  hero.hp = Math.min(progress.stats.hp, hero.hp + progress.stats.hp * HEARTHFIRE.heal);
  for (let i = 0; i < 8; i++)
    particles.spawn(PK.STAR, hero.x + rng.range(-6, 6), hero.y - rng.range(4, 26), 0, -rng.range(20, 40), 0.6, {
      col: rng.pick([PAL.heal[3], PAL.heal[4]]),
      size: rng.range(0.6, 1.4),
    });
}
