import { drillSession } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { progress } from "../../../../../game/state";
import { SKILL } from "../../../constants/skills/ids";
import type { SayaDrillSkill } from "../../../types/drillSkill";
import { storeCut } from "../../store";
import { cutAngle } from "../targets";
import { spellBonus } from "./spellPower";

export const CRESCENT_WAVE_DRILL: SayaDrillSkill = {
  id: SKILL.crescent,
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "crescent") {
      return;
    }
    spellBonus(foe, spell, values.power ?? 0, SKILL.crescent);
    storeCut(foe, progress.stats.ap * values.store, cutAngle(foe), "abilities");
    if (values.stagger) {
      staggerFoe(foe, values.stagger);
    }
    if (values.chill) {
      foe.chill = Math.max(foe.chill, values.chill);
    }
    const session = drillSession();
    const rain = session?.profile.spells.find((option) => option.id === "rain");
    if (evolved && session && rain) {
      session.elementImpacts.push({
        spell: rain,
        x: foe.x,
        y: foe.y,
        face: session.fighter.face,
        age: 0,
        fromSword: true,
      });
      spellBonus(foe, rain, 0.5, SKILL.crescent);
    }
  },
  swordHit(foe, _blow, infusion, { values }) {
    if (infusion?.id === "crescent" && values.infused) {
      storeCut(foe, progress.stats.ap * values.infused, cutAngle(foe), "abilities");
    }
  },
};
