import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues } from "./drillLevels";

const LEVELS = drillLevels(
  [
    { text: "Warp costs 7 MP and recharges in 1.6 s.", values: { cost: 7, recharge: 1.6, charges: 1 } },
    { text: "New: the spinning sword cuts every foe it passes.", values: { path: 0.8 } },
    { text: "New: the shock ring reaches 16 px farther and hits harder.", values: { ring: 16, ringPower: 0.4 } },
    { text: "Recharge 1.6 to 1.2 s.", values: { recharge: 1.2 } },
    { text: "New: two warp charges.", values: { charges: 2 } },
    { text: "The passing cut 0.8 to 2 AD.", values: { path: 2 } },
    { text: "New: the arrival chop hits 3 AD.", values: { strike: 3 } },
    { text: "Chop 3 to 6 AD; the ring and the cut hit far harder.", values: { strike: 6, ringPower: 1.5, path: 3 } },
  ],
  [
    { text: "Warp recharge -15%, damage +30%.", drill: { cooldown: 0.85, damage: 0.3 } },
    { text: "New: the arrival rings foes near her for 0.8 AD.", drill: { ring: 0.8, radius: 32 } },
    { text: "New: the arrival gives back the air dash and air slash.", drill: { refresh: 1 } },
    { text: "New: the ring staggers.", drill: { stagger: 0.5 } },
    { text: "Recharge -15% to -30%; ring 1.6 AD.", drill: { cooldown: 0.7, ring: 1.6 } },
    { text: "Warp damage +30% to +100%.", drill: { damage: 1 } },
    { text: "The ring reaches 48 px.", drill: { radius: 48 } },
    { text: "Recharge -45%; damage +200%; ring 4 AD.", drill: { cooldown: 0.55, damage: 2, ring: 4 } },
  ],
);

export const SPINNING_THROW: SkillDef = {
  id: "br_spin",
  name: "Spinning Throw",
  kind: "movement",
  element: "void",
  risk: "timed",
  button: "J",
  text: "The warp strike recharges sooner, hits harder and lands with a shock ring.",
  levels: LEVELS,
  evolution: {
    partner: "br_crater",
    name: "Anvil Drop",
    text: "Every arrival quakes the floor and throws foes up.",
    row: evolvedRow(LEVELS[7], "Every arrival quakes the floor.", {
      ...drillValues({ quake: 2 }),
      wheel: 1.5,
      wheelPower: 1.2,
    }),
  },
};
