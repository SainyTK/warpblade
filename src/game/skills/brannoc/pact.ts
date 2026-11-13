import { OATH_ADD } from "../../../constants/brannoc/skills";
import { place } from "../../../engine/frame";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { drawPactAura } from "../../effects/brannoc/pactAura";
import { brannoc } from "../../hero/brannoc/memory";
import { game, hero } from "../../state";
import { skillValues, withCharms } from "../query";

const ID = "b_pact";
/** the aura fades in over its last this many seconds */
const FADE = 0.5;

/**
 * Blood Pact: a spell on I paid in HP. It opens the pact for its seconds; his kit reads the pact for its crits, its
 * first Bloodied blow, its Fury and its hold on the debt. Oathbound makes every kill in the pact keep it 1 s longer.
 */
export const pactSkill: SkillBehavior = {
  create: () => ({}),
  draw() {
    if (brannoc.pactT <= 0) return;
    place();
    drawPactAura(hero.x, hero.y, game.t, Math.min(1, brannoc.pactT / FADE));
  },
  on: {
    cast(_m, event) {
      if (event.ability !== ID) return;
      brannoc.pactT = withCharms("duration", skillValues(ID).time ?? 5);
      brannoc.pactFirst = false;
    },
    kill() {
      if (brannoc.pactT <= 0 || !skillValues(ID).oath) return;
      brannoc.pactT += OATH_ADD;
    },
  },
};
