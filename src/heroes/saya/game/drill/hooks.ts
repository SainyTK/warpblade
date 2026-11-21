import { drillFighter } from "../../../../drill";
import { progress } from "../../../../game/state";
import type { DrillHooks, DrillModifiers, DrillSpell } from "../../../../types/drill";
import type { Enemy } from "../../../../types/enemy";
import { DRILL_STORE } from "../../constants/drill/store";
import type { DrillBlow } from "../../types/drillSkill";
import { drawStoredCuts, resetStore, storeCut, tickStore } from "../store";
import { heldSkills } from "./held";
import { resetLater, tickLater } from "./later";
import { sheathe } from "./sheathe";
import { cutAngle } from "./targets";

const currentBlow = (): DrillBlow => drillFighter()?.swing?.kind ?? "warp";

function storeFactor(blow: DrillBlow): number {
  let factor = 1;
  for (const [skill, state] of heldSkills()) {
    factor += skill.store?.(blow, state) ?? 0;
  }
  return factor;
}

function storeFromSword(foe: Enemy, blow: DrillBlow, infusion: DrillSpell | null): void {
  if (blow !== "third") {
    storeCut(foe, progress.stats.ad * DRILL_STORE[blow] * storeFactor(blow), cutAngle(foe));
  }
  if (infusion) {
    storeCut(foe, progress.stats.ap * DRILL_STORE.infused, cutAngle(foe) + 0.6, "abilities");
  }
}

export function sayaModifiers(neutral: DrillModifiers): DrillModifiers {
  const modifiers = { ...neutral };
  for (const [skill, state] of heldSkills()) {
    skill.modify?.(modifiers, state);
  }
  return modifiers;
}

export const SAYA_DRILL_HOOKS: DrillHooks = {
  swordHit: (foe, infusion) => {
    const blow = currentBlow();
    storeFromSword(foe, blow, infusion);
    for (const [skill, state] of heldSkills()) {
      skill.swordHit?.(foe, blow, infusion, state);
    }
  },
  slashed: (strike, landed) => {
    if (strike === "third") {
      sheathe();
    }
    for (const [skill, state] of heldSkills()) {
      skill.slashed?.(strike, landed, state);
    }
  },
  spellHit: (foe, spell) => {
    for (const [skill, state] of heldSkills()) {
      skill.spellHit?.(foe, spell, state);
    }
  },
  dashed: (foes) => {
    for (const [skill, state] of heldSkills()) {
      skill.dashed?.(foes, state);
    }
  },
  released: (cast) => {
    for (const [skill, state] of heldSkills()) {
      skill.released?.(cast, state);
    }
    if (cast.tier.level >= 3) {
      sheathe("ultimate");
    }
  },
  tick: (dt) => {
    tickLater(dt);
    tickStore(dt);
    for (const [skill, state] of heldSkills()) {
      skill.tick?.(dt, state);
    }
  },
  draw: drawStoredCuts,
  reset: () => {
    resetLater();
    resetStore();
  },
};
