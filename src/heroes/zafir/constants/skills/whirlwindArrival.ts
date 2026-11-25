import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type Numbers } from "./drillLevels";

const NATIVE: readonly Numbers[] = [
  { reach: 1.2, whirl: 10 },
  { path: 0.5 },
  { wounds: 1 },
  { charges: 2 },
  { path: 0.8, strike: 2.4 },
  { ring: 1 },
  { cost: 7 },
  { path: 1.6, strike: 3, reach: 1.4 },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "Warp recharge -15%; warp strike +30%.", drill: { cooldown: 0.85, damage: 1.3 } },
  { text: "New: the arrival opens two wounds on every foe within 34 px.", drill: { wounds: 2 } },
  { text: "Warp strike +30% to +60%.", drill: { damage: 1.6 } },
  { text: "New: the arrival staggers the foes it cuts.", drill: { stagger: 0.4 } },
  { text: "New: the arrival throws a sand ring that cuts 40 px each side.", drill: { ring: 1.2 } },
  { text: "Warp recharge -15% to -30%; warp strike +60% to +120%.", drill: { cooldown: 0.7, damage: 2.2 } },
  { text: "New: the sand ring blinds minions for 1.5 s.", drill: { blind: 1.5 } },
  {
    text: "Warp recharge -30% to -40%; warp strike +120% to +300%; ring 1.2 to 3.",
    drill: { cooldown: 0.6, damage: 4, ring: 3 },
  },
]);

export const WHIRLWIND_ARRIVAL: SkillDef = {
  id: "za_arrival",
  name: "Whirlwind Arrival",
  kind: "movement",
  element: "storm",
  risk: "timed",
  button: "L",
  text: "The warp strike recharges sooner and hits harder, and the arrival spins a ring of sand round you.",
  levels: LEVELS,
  evolution: {
    partner: "za_sirocco",
    name: "Dust Devil Step",
    text: "Every arrival leaves a small sandstorm turning round you for 1.5 s.",
    row: evolvedRow(LEVELS[7], "Arrivals leave a small sandstorm.", {
      keen: 1,
      wounds: 3,
      ...drillValues({ storm: 1.5 }),
    }),
  },
};
