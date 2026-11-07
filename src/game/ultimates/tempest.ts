import { ULT_LEVELS } from "../../constants/ultimate";
import { createLightning } from "../spells/lightning";
import { game, progress, rng } from "../state";
import { surfaceBelow } from "../world";
import { ultSpan, ultTargets } from "./targets";

/** strikes on each foe in reach; together they deal the level's power once */
const PER_FOE = [3, 3, 4, 4] as const;
/** strikes on empty floor, for the storm's look; they arc to a foe close by */
const LOOSE = [0, 2, 5, 10] as const;
const MAX_STRIKES = 30;
/** how long the storm lasts */
const SPAN = 1.1;

/** Tempest: bolt after bolt on the foes in reach, each arcing to one more, shocking them still */
export function castTempest(level: number): void {
  const foes = ultTargets(level);
  const [x0, x1] = ultSpan(level);
  const per = PER_FOE[level - 1];
  const damage = (ULT_LEVELS[level - 1].power * progress.stats.ap) / per;
  const aimed = foes.flatMap((foe) => Array<typeof foe>(per).fill(foe)).slice(0, MAX_STRIKES);
  const strikes = rng.shuffle([...aimed, ...Array<null>(LOOSE[level - 1]).fill(null)]);
  const glow = Math.min(1, 3 / strikes.length);
  strikes.forEach((foe, i) => {
    const x = rng.range(x0, x1);
    game.fx.push(
      createLightning(foe, [x, surfaceBelow(x, 0)], {
        damage,
        arcDamage: damage * 0.3,
        arcs: 1,
        shock: 1.2,
        delay: i * (SPAN / strikes.length),
        glow,
        source: "ultimate",
      }),
    );
  });
}
