import type { Enemy } from "../../../../types/enemy";
import { enemyCenter } from "../../../enemies/enemy";
import { skillValues } from "../../../skills/query";
import { scorch } from "../../../skills/ysra/scorch";
import { burstEmbers } from "../../../spells/rites/emberBurst";
import { game, progress } from "../../../state";
import { struckThisSwing } from "../../../world";
import { buffs } from "../buffs";
import { onYsra } from "../events";
import { gainHeat, heatForStrike, overheatLeft } from "./heat";

/** the Eternal Hearth glow's burst on each struck foe reaches this far */
const GLOW_BURST = 12;

/** the foes the last blow struck: meleeHit marks each with the swing that hit it */
const struckFoes = (): Enemy[] => game.enemies.filter((e) => e.hp > 0 && struckThisSwing(e));

/** Overheat bursts in flame on each struck foe (Sunheart's bursts scorch too); the Eternal Hearth glow bursts as well */
function burstStruck(): void {
  const hot = overheatLeft() > 0;
  const glow = buffs.glow > 0;
  if (!hot && !glow) return;
  const o = skillValues("y_overheat");
  const spark = skillValues("y_kindling").spark ?? 0;
  for (const e of struckFoes()) {
    const [x, y] = enemyCenter(e);
    if (hot) burstEmbers(x, y, progress.stats.ad * o.burst, o.radius, 1);
    if (hot && o.scorch) scorch(e, o.scorch);
    if (glow) burstEmbers(x, y, progress.stats.ad * spark, GLOW_BURST, 1);
  }
}

/** glaive blows that land build Heat and carry its fire */
export function listenStrikes(): void {
  onYsra("strike", ({ source, hits }) => {
    if (hits <= 0) return;
    burstStruck();
    gainHeat(heatForStrike(source, hits));
  });
}
