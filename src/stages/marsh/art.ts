import type { ArtDef } from "../../types/art";

export const mirespit: ArtDef = {
  id: "mirespit",
  name: "Mire Spit",
  element: "venom",
  color: 0x8fd14f,
  core: 0xe8ffb0,
  look: "flame",
  levels: [
    {
      cardText: "A glob of bog rot that poisons where it lands.",
      damageTimesAttack: 4.0,
      radius: 22,
      range: 130,
      speed: 190,
      delay: 0,
      freeze: 0,
    },
    {
      cardText: "More damage and a wider burst.",
      damageTimesAttack: 5.0,
      radius: 25,
      range: 140,
      speed: 190,
      delay: 0,
      freeze: 0,
    },
    { cardText: "More damage.", damageTimesAttack: 6.4, radius: 28, range: 150, speed: 190, delay: 0, freeze: 0 },
    {
      cardText: "A wider burst and more damage.",
      damageTimesAttack: 8.0,
      radius: 32,
      range: 160,
      speed: 190,
      delay: 0,
      freeze: 0,
    },
    { cardText: "Its full power.", damageTimesAttack: 11.0, radius: 38, range: 175, speed: 190, delay: 0, freeze: 0 },
  ],
};
