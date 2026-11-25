import { addStacks } from "../../game/enemies/skillStatus";
import { game } from "../../game/state";
import type { ArtDef } from "../../types/art";
import { createSporeburstCloud, poisonSpec, SPORE_SOURCE } from "./sporeburst/cloud";
import { drawSporeburstImpact } from "./sporeburst/drawImpact";

const CLOUD = { share: 0.8, life: 2.6, lifePerLevel: 0.4 } as const;

export const sporeburst: ArtDef = {
  id: "sporeburst",
  name: "Spore Burst",
  element: "venom",
  color: 0xc6e05a,
  core: 0xf8ffd0,
  look: "flame",
  levels: [
    {
      cardText: "Spores burst on the foe ahead and linger, poisoning.",
      damageTimesAttack: 4.0,
      radius: 22,
      range: 130,
      speed: null,
      delay: 0.14,
      freeze: 0,
    },
    {
      cardText: "More damage and a wider cloud.",
      damageTimesAttack: 5.0,
      radius: 25,
      range: 140,
      speed: null,
      delay: 0.14,
      freeze: 0,
    },
    {
      cardText: "The cloud lingers longer.",
      damageTimesAttack: 6.4,
      radius: 28,
      range: 150,
      speed: null,
      delay: 0.14,
      freeze: 0,
    },
    {
      cardText: "A wider cloud and stronger poison.",
      damageTimesAttack: 8.0,
      radius: 32,
      range: 160,
      speed: null,
      delay: 0.14,
      freeze: 0,
    },
    {
      cardText: "Its full power: a thick, lasting cloud.",
      damageTimesAttack: 11.0,
      radius: 38,
      range: 175,
      speed: null,
      delay: 0.14,
      freeze: 0,
    },
  ],
  status(foe, level) {
    addStacks(foe, SPORE_SOURCE, poisonSpec(level));
  },
  burst(x, y, level) {
    const row = sporeburst.levels[Math.max(0, Math.min(4, level - 1))];
    const life = CLOUD.life + CLOUD.lifePerLevel * level;
    game.fx.push(createSporeburstCloud(x, y, row.radius * CLOUD.share, life, level));
  },
  drawImpact: drawSporeburstImpact,
};
