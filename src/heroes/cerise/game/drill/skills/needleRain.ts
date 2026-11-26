import { game, progress } from "../../../../../game/state";
import type { CeriseDrillSkill } from "../../../types/drillSkill";
import { createNeedle } from "../../effects/needle";
import { spellStrike } from "./strike";

const ID = "ce_needle";

function rain(x: number, y: number, count: number, power: number, pin: number): void {
  const spread = 14;
  for (let i = 0; i < count; i++) {
    const offset = (i - (count - 1) / 2) * spread * (i % 2 ? 1 : -1) * 0.5;
    game.fx.push(
      createNeedle(x + offset, y, i * 0.05, progress.stats.ap * power, (foe) => {
        if (pin) {
          foe.pinned = Math.max(foe.pinned, pin);
        }
      }),
    );
  }
}

export const NEEDLE_RAIN_DRILL: CeriseDrillSkill = {
  id: ID,
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "flurry") {
      return;
    }
    rain(foe.x, foe.y - 14, values.needles, values.power, values.pin ?? 0);
    if (evolved) {
      spellStrike(foe, (spell.damage / 10) * values.storm, ID);
    }
  },
  swordHit(foe, infusion, { values }) {
    if (infusion?.id === "flurry" && values.edge) {
      rain(foe.x, foe.y - 14, values.edge, values.power * 0.5, 0);
    }
  },
};
