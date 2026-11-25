import { addStacks } from "../../game/enemies/skillStatus";
import { progress } from "../../game/state";
import type { ArtDef } from "../../types/art";
import { drawMireBolt, drawMireImpact } from "./artLook";

const POISON = { every: 0.5, duration: 4, share: 0.05, perLevel: 0.012 } as const;

export const mirespit: ArtDef = {
  id: "mirespit",
  name: "Mire Spit",
  element: "venom",
  color: 0x8fd14f,
  core: 0xe8ffb0,
  look: "flame",
  levels: [
    {
      cardText: "Spit bog rot that poisons and slows.",
      damageTimesAttack: 4.0,
      radius: 22,
      range: 130,
      speed: 190,
      delay: 0,
      freeze: 0,
    },
    {
      cardText: "More damage, a wider splash.",
      damageTimesAttack: 5.0,
      radius: 25,
      range: 140,
      speed: 190,
      delay: 0,
      freeze: 0,
    },
    {
      cardText: "Poison stacks higher.",
      damageTimesAttack: 6.4,
      radius: 28,
      range: 150,
      speed: 190,
      delay: 0,
      freeze: 0,
    },
    {
      cardText: "Stronger poison, longer slow.",
      damageTimesAttack: 8.0,
      radius: 32,
      range: 160,
      speed: 190,
      delay: 0,
      freeze: 0,
    },
    {
      cardText: "Full rot: the widest splash.",
      damageTimesAttack: 11.0,
      radius: 38,
      range: 175,
      speed: 190,
      delay: 0,
      freeze: 0,
    },
  ],
  status(foe, level) {
    addStacks(foe, "mirespit", {
      stacks: 1 + Math.floor(level / 2),
      max: 3 + level,
      damage: progress.stats.ap * (POISON.share + POISON.perLevel * level),
      every: POISON.every,
      duration: POISON.duration,
    });
    foe.chill = Math.max(foe.chill, 0.8 + 0.2 * level);
  },
  drawBolt: drawMireBolt,
  drawImpact: drawMireImpact,
};
