import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `damage` attack damage a stack of night deals each tick (every 0.5 s), `max` stacks, `duration` seconds,
 *  `landStacks` the nightfall's landing lays more, `airTaken` a foe with night takes more while airborne, `launchStacks`
 *  a launch lays more, `consume` (evolved) attack damage of each stack the landing takes */
const LEVELS = levelRows([
  { text: "Blows on foes in the air lay night that cuts as it burns.", values: { damage: 0.08, max: 4, duration: 3 } },
  { text: "Night 0.08 to 0.12.", values: { damage: 0.12 } },
  { text: "New: the nightfall's landing lays 2 night on each foe it cuts.", values: { landStacks: 2 } },
  { text: "Up to 6 night on a foe.", values: { max: 6 } },
  { text: "New: a foe with night takes 20% more while in the air.", values: { airTaken: 0.2 } },
  { text: "Night 0.12 to 0.2; it lasts 5 s.", values: { damage: 0.2, duration: 5 } },
  { text: "New: a launch lays 2 night.", values: { launchStacks: 2 } },
  { text: "Night 0.2 to 0.3; up to 8.", values: { damage: 0.3, max: 8 } },
]);

export const FALLING_NIGHT: SkillDef = {
  id: "ve_night",
  name: "Falling Night",
  kind: "dot",
  element: "void",
  risk: "timed",
  button: "auto",
  text: "Foes you strike in the air carry night that keeps cutting them.",
  levels: LEVELS,
  evolution: {
    partner: "ve_sky",
    name: "Starless Night",
    text: "The nightfall's landing takes all the night on each foe it cuts, each stack a blow of 0.8 times attack damage.",
    row: evolvedRow(LEVELS[7], "The landing takes all night at once.", { consume: 0.8 }),
  },
};
