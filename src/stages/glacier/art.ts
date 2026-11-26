import type { ArtDef, ArtLevel } from "../../types/art";
import { drawFrostBurst, frostSpray } from "./rimefang/burst";
import { drawFang } from "./rimefang/fang";

const level = (
  cardText: string,
  damageTimesAttack: number,
  radius: number,
  range: number,
  freeze: number,
): ArtLevel => ({
  cardText,
  damageTimesAttack,
  radius,
  range,
  speed: 210,
  delay: 0,
  freeze,
});

export const rimefang: ArtDef = {
  id: "rimefang",
  name: "Rime Fang",
  element: "frost",
  color: 0x7fdcf6,
  core: 0xf4feff,
  look: "shard",
  levels: [
    level("A fang of ice that freezes what it bites.", 4.0, 22, 130, 1.0),
    level("Bites harder and freezes longer.", 5.0, 25, 140, 1.25),
    level("A wider frost burst.", 6.4, 29, 150, 1.5),
    level("Freezes longer and chills the rest.", 8.0, 33, 160, 1.75),
    level("Its full power: a deep freeze.", 11.0, 38, 175, 2.1),
  ],
  status(foe, at) {
    foe.chill = Math.max(foe.chill, 2 + at * 0.6);
  },
  burst: frostSpray,
  drawBolt: drawFang,
  drawImpact: drawFrostBurst,
};
