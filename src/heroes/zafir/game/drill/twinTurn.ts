import { drillSession, swingTouches } from "../../../../drill";
import { dealDamage } from "../../../../game/damage";
import { createSlash } from "../../../../game/effects/slash";
import { game, progress } from "../../../../game/state";
import type { DrillSpell } from "../../../../types/drill";
import type { Enemy } from "../../../../types/enemy";
import { TWIN_RING, TWIN_TURN } from "../../constants/drill/strikes";
import { later } from "./later";

type Land = (foe: Enemy, infusion: DrillSpell | null) => void;

export function twinTurn(land: Land): void {
  later(TWIN_TURN.delay, () => {
    const session = drillSession();
    if (!session) {
      return;
    }
    const { profile, modifiers, fighter: h } = session;
    const strike = profile.strikes.third;
    const reach = strike.reach * modifiers.strikeReach;
    game.fx.push(createSlash(h.x, h.y, h.face, { ...TWIN_RING, R: reach }));
    const power = strike.damage * modifiers.strikeDamage * modifiers.finisherDamage * TWIN_TURN.share;
    const infusion = h.swordInfusion?.spell ?? null;
    for (const foe of game.enemies) {
      if (foe.hp <= 0 || !swingTouches(foe, h.x - reach - 6, h.x + reach + 6, h.y, strike.height + 8)) {
        continue;
      }
      const hit = dealDamage(foe, progress.stats.ad * power, { fromX: h.x, source: "attacks", melee: true });
      if (hit === "hit") {
        infusion?.status?.(foe);
        land(foe, infusion);
      }
    }
  });
}
