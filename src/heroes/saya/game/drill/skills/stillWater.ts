import { hostMemory, rememberPerSeat } from "../../../../../game/seatMemory";
import { hero, progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
import { SKILL } from "../../../constants/skills/ids";
import type { SayaDrillSkill } from "../../../types/drillSkill";
import { sayaFx } from "../../skillFx";
import { storeCut } from "../../store";
import { later } from "../later";
import { sheathe } from "../sheathe";
import { cutAngle } from "../targets";
import { spellBonus } from "./spellPower";

const still = { pending: false };
rememberPerSeat(hostMemory(still));

export const STILL_WATER_DRILL: SayaDrillSkill = {
  id: SKILL.still,
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "still") {
      return;
    }
    sayaFx(
      SKILL.still,
      { x: foe.x - hero.face * 10, y: surfaceBelow(foe.x, foe.y - 4), face: hero.face },
      {
        damage:
          (spell.damage / 10) * progress.stats.ap * (1 + (values.power ?? 0) + (values.store ?? 0)) * (evolved ? 2 : 1),
      },
    );
    foe.frozen = Math.max(foe.frozen, spell.freeze + values.freeze);
    spellBonus(foe, spell, values.power ?? 0, SKILL.still);
    if (values.mp) {
      hero.mp = Math.min(progress.stats.mp, hero.mp + values.mp);
    }
    if (values.store) {
      storeCut(foe, progress.stats.ap * values.store, cutAngle(foe), "abilities");
    }
    if (values.release && !still.pending) {
      still.pending = true;
      later(0.05, () => {
        still.pending = false;
        sheathe("abilities", evolved ? { clean: true } : { factor: 0.8 });
      });
    }
  },
};
