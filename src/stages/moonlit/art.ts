import { ignite } from "../../game/enemies/burn";
import type { ArtDef } from "../../types/art";
import { drawGloamImpact } from "./artLook";

const BURN = { base: 1.5, perLevel: 0.5 } as const;

export const gloamlantern: ArtDef = {
  id: "gloamlantern",
  name: "Gloam Lantern",
  element: "blaze",
  color: 0x9f8cff,
  core: 0xf2eaff,
  look: "flame",
  levels: [
    {
      cardText: "A ghost lantern drops and burns the foe ahead.",
      damageTimesAttack: 4.0,
      radius: 22,
      range: 130,
      speed: null,
      delay: 0.12,
      freeze: 0,
    },
    {
      cardText: "More damage, a wider blaze.",
      damageTimesAttack: 5.0,
      radius: 25,
      range: 140,
      speed: null,
      delay: 0.12,
      freeze: 0,
    },
    { cardText: "Burns longer.", damageTimesAttack: 6.4, radius: 28, range: 150, speed: null, delay: 0.12, freeze: 0 },
    {
      cardText: "A wider blaze, longer burn.",
      damageTimesAttack: 8.0,
      radius: 32,
      range: 160,
      speed: null,
      delay: 0.12,
      freeze: 0,
    },
    {
      cardText: "Full flame: the longest burn.",
      damageTimesAttack: 11.0,
      radius: 38,
      range: 175,
      speed: null,
      delay: 0.12,
      freeze: 0,
    },
  ],
  status(foe, level) {
    ignite(foe, BURN.base + BURN.perLevel * level);
  },
  drawImpact: drawGloamImpact,
};
