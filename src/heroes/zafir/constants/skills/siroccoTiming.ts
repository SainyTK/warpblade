import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type Numbers } from "./drillLevels";

const NATIVE: readonly Numbers[] = [
  { keen: 0.4 },
  { keen: 0.7 },
  { wave: 0.8 },
  { window: 0.15 },
  { streak: 0.15, streakCap: 0.6 },
  { keen: 1.5, wave: 1.6 },
  { whirl: 20 },
  { keen: 5, wave: 4 },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "The air slash deals +50%.", drill: { air: 0.5 } },
  { text: "New: one more air slash per jump.", drill: { slashes: 1 } },
  { text: "Air slash +50% to +90%.", drill: { air: 0.9 } },
  { text: "New: an air slash sends a hot gust ahead along the floor.", drill: { gust: 0.6 } },
  { text: "New: an air slash opens a wound.", drill: { wounds: 1 } },
  { text: "Air slash +90% to +200%; gust 0.6 to 1.4.", drill: { air: 2, gust: 1.4 } },
  { text: "New: a third air slash per jump.", drill: { slashes: 2 } },
  { text: "Air slash +200% to +500%; gust 1.4 to 3.5.", drill: { air: 5, gust: 3.5 } },
]);

export const SIROCCO_TIMING: SkillDef = {
  id: "za_sirocco",
  name: "Sirocco Descent",
  kind: "attack",
  element: "blaze",
  risk: "timed",
  button: "J",
  text: "The spinning descent, the air slash, hits harder, comes more often and sends hot gusts along the floor.",
  levels: LEVELS,
  evolution: {
    partner: "za_mirage",
    name: "Desert Noon",
    text: "Every air slash that lands calls a ring of noon light round you, 6 times attack damage to every foe within 40 px.",
    row: evolvedRow(LEVELS[7], "Air slashes call a ring of noon light.", {
      noon: 24,
      noonEvery: 3,
      ...drillValues({ noon: 6 }),
    }),
  },
};
