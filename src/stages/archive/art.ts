import type { ArtDef } from "../../types/art";

export const inkwave: ArtDef = {
  id: "inkwave",
  name: "Ink Tide",
  element: "void",
  color: 0x6a5cff,
  core: 0xd8d2ff,
  look: "shard",
  levels: [
    {
      cardText: "A wave of living ink that rolls through foes.",
      damageTimesAttack: 4.0,
      radius: 22,
      range: 130,
      speed: 150,
      delay: 0,
      freeze: 0,
    },
    {
      cardText: "More damage and a wider burst.",
      damageTimesAttack: 5.0,
      radius: 25,
      range: 140,
      speed: 150,
      delay: 0,
      freeze: 0,
    },
    { cardText: "More damage.", damageTimesAttack: 6.4, radius: 28, range: 150, speed: 150, delay: 0, freeze: 0 },
    {
      cardText: "A wider burst and more damage.",
      damageTimesAttack: 8.0,
      radius: 32,
      range: 160,
      speed: 150,
      delay: 0,
      freeze: 0,
    },
    { cardText: "Its full power.", damageTimesAttack: 11.0, radius: 38, range: 175, speed: 150, delay: 0, freeze: 0 },
  ],
};
