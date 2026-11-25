import type { ArtDef } from "../../types/art";

export const forgeflare: ArtDef = {
  id: "forgeflare",
  name: "Forge Flare",
  element: "blaze",
  color: 0xff8a3c,
  core: 0xfff0b0,
  look: "flame",
  levels: [
    {
      cardText: "Molten iron erupts from the floor ahead.",
      damageTimesAttack: 4.0,
      radius: 22,
      range: 130,
      speed: null,
      delay: 0.1,
      freeze: 0,
    },
    {
      cardText: "More damage and a wider burst.",
      damageTimesAttack: 5.0,
      radius: 25,
      range: 140,
      speed: null,
      delay: 0.1,
      freeze: 0,
    },
    { cardText: "More damage.", damageTimesAttack: 6.4, radius: 28, range: 150, speed: null, delay: 0.1, freeze: 0 },
    {
      cardText: "A wider burst and more damage.",
      damageTimesAttack: 8.0,
      radius: 32,
      range: 160,
      speed: null,
      delay: 0.1,
      freeze: 0,
    },
    {
      cardText: "Its full power.",
      damageTimesAttack: 11.0,
      radius: 38,
      range: 175,
      speed: null,
      delay: 0.1,
      freeze: 0,
    },
  ],
};
