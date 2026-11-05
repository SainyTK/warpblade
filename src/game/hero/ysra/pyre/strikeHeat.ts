import { OVERHEAT, SEARING } from "../../../../constants/ysra/heat";
import type { Enemy } from "../../../../types/enemy";
import { enemyCenter } from "../../../enemies/enemy";
import { burstEmbers } from "../../../spells/rites/emberBurst";
import { game, progress } from "../../../state";
import { onYsra } from "../events";
import { gainHeat, heatForStrike, overheatLeft, searing } from "./heat";

/** the foes the last blow struck: meleeHit marks each with the swing that hit it */
const struckFoes = (): Enemy[] => game.enemies.filter((e) => e.hp > 0 && e.swing === game.swing);

/** Searing Edge sets each struck foe alight; Overheat bursts in flame on each */
function burnStruck(): void {
  const sear = searing();
  const burst = overheatLeft() > 0;
  if (!sear && !burst) return;
  for (const e of struckFoes()) {
    if (sear) e.burn = Math.max(e.burn, SEARING.burn);
    if (!burst) continue;
    const [x, y] = enemyCenter(e);
    burstEmbers(x, y, progress.stats.ap * OVERHEAT.burstPower, OVERHEAT.burstRadius, OVERHEAT.burn);
  }
}

/** glaive blows that land build Heat and carry its fire */
export function listenStrikes(): void {
  onYsra("strike", ({ source, hits }) => {
    if (hits <= 0) return;
    burnStruck();
    gainHeat(heatForStrike(source, hits));
  });
}
