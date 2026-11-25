import type { ArtDef } from "../../types/art";

export const sporeburst: ArtDef = {
  id: "sporeburst",
  name: "Spore Burst",
  element: "venom",
  color: 0xc6e05a,
  core: 0xf8ffd0,
  look: "flame",
  levels: [
    {
      cardText: "A cloud of spores that bursts and lingers.",
      damageTimesAttack: 4.0,
      radius: 22,
      range: 130,
      speed: null,
      delay: 0.14,
      freeze: 0,
    },
    {
      cardText: "More damage and a wider burst.",
      damageTimesAttack: 5.0,
      radius: 25,
      range: 140,
      speed: null,
      delay: 0.14,
      freeze: 0,
    },
    { cardText: "More damage.", damageTimesAttack: 6.4, radius: 28, range: 150, speed: null, delay: 0.14, freeze: 0 },
    {
      cardText: "A wider burst and more damage.",
      damageTimesAttack: 8.0,
      radius: 32,
      range: 160,
      speed: null,
      delay: 0.14,
      freeze: 0,
    },
    {
      cardText: "Its full power.",
      damageTimesAttack: 11.0,
      radius: 38,
      range: 175,
      speed: null,
      delay: 0.14,
      freeze: 0,
    },
  ],
};
