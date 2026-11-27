import { skillValues } from "../../../../game/skills/query";
import { game, hero } from "../../../../game/state";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { SKILL } from "../../constants/skillIds";
import { BREATH, yunFx } from "../fx";
import { fillSwords } from "../swords";

interface Memory extends SkillMemory {
  wave: number;
}

/** Sage's Breath: its numbers are read where swords come back; from level 8 every sword is back as a wave starts */
export const sagesBreath: SkillBehavior = {
  create: (): Memory => ({ wave: game.wave }),
  update(memory) {
    const m = memory as Memory;
    if (m.wave === game.wave) return;
    m.wave = game.wave;
    if (!skillValues(SKILL.breath).wave) return;
    fillSwords();
    yunFx(SKILL.breath, "nova", { x: hero.x, y: hero.y, face: hero.face, reach: 18 }, { signature: BREATH });
  },
};
