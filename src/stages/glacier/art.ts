import type { ArtDef } from "../../types/art";

export const rimefang: ArtDef = {
  id: "rimefang",
  name: "Rime Fang",
  element: "frost",
  color: 0x7fe9ff,
  core: 0xeefcff,
  look: "shard",
  levels: [
    {
      cardText: "A fang of ice that freezes what it bites.",
      damageTimesAttack: 4.0,
      radius: 22,
      range: 130,
      speed: 200,
      delay: 0,
      freeze: 1.4,
    },
    {
      cardText: "More damage and a wider burst.",
      damageTimesAttack: 5.0,
      radius: 25,
      range: 140,
      speed: 200,
      delay: 0,
      freeze: 1.4,
    },
    { cardText: "More damage.", damageTimesAttack: 6.4, radius: 28, range: 150, speed: 200, delay: 0, freeze: 1.4 },
    {
      cardText: "A wider burst and more damage.",
      damageTimesAttack: 8.0,
      radius: 32,
      range: 160,
      speed: 200,
      delay: 0,
      freeze: 1.4,
    },
    { cardText: "Its full power.", damageTimesAttack: 11.0, radius: 38, range: 175, speed: 200, delay: 0, freeze: 1.4 },
  ],
};
