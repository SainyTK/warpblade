import type { ArtDef } from "../../types/art";

export const riftlance: ArtDef = {
  id: "riftlance",
  name: "Rift Lance",
  element: "storm",
  color: 0xc39bff,
  core: 0xfff3a6,
  look: "spark",
  levels: [
    {
      cardText: "A lance of rift lightning that flies far.",
      damageTimesAttack: 4.0,
      radius: 22,
      range: 130,
      speed: 260,
      delay: 0,
      freeze: 0,
    },
    {
      cardText: "More damage and a wider burst.",
      damageTimesAttack: 5.0,
      radius: 25,
      range: 140,
      speed: 260,
      delay: 0,
      freeze: 0,
    },
    { cardText: "More damage.", damageTimesAttack: 6.4, radius: 28, range: 150, speed: 260, delay: 0, freeze: 0 },
    {
      cardText: "A wider burst and more damage.",
      damageTimesAttack: 8.0,
      radius: 32,
      range: 160,
      speed: 260,
      delay: 0,
      freeze: 0,
    },
    { cardText: "Its full power.", damageTimesAttack: 11.0, radius: 38, range: 175, speed: 260, delay: 0, freeze: 0 },
  ],
};
