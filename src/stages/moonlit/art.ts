import type { ArtDef } from "../../types/art";

export const gloamlantern: ArtDef = {
  id: "gloamlantern",
  name: "Gloam Lantern",
  element: "blaze",
  color: 0x9f8cff,
  core: 0xf2eaff,
  look: "flame",
  levels: [
    {
      cardText: "A ghost flame that bursts on the foe ahead.",
      damageTimesAttack: 4.0,
      radius: 22,
      range: 130,
      speed: null,
      delay: 0.12,
      freeze: 0,
    },
    {
      cardText: "More damage and a wider burst.",
      damageTimesAttack: 5.0,
      radius: 25,
      range: 140,
      speed: null,
      delay: 0.12,
      freeze: 0,
    },
    { cardText: "More damage.", damageTimesAttack: 6.4, radius: 28, range: 150, speed: null, delay: 0.12, freeze: 0 },
    {
      cardText: "A wider burst and more damage.",
      damageTimesAttack: 8.0,
      radius: 32,
      range: 160,
      speed: null,
      delay: 0.12,
      freeze: 0,
    },
    {
      cardText: "Its full power.",
      damageTimesAttack: 11.0,
      radius: 38,
      range: 175,
      speed: null,
      delay: 0.12,
      freeze: 0,
    },
  ],
};
