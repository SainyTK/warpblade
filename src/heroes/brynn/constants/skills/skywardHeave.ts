import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues } from "./drillLevels";

const LEVELS = drillLevels(
  [
    { text: "The heave hits harder and throws foes higher.", values: { power: 0.6, launch: 60 } },
    { text: "New: launched foes take +20% until they land.", values: { airBonus: 0.2 } },
    { text: "Heave power +0.6 to +1.4.", values: { power: 1.4 } },
    { text: "New: the heave reaches 16 px farther ahead.", values: { reach: 16 } },
    { text: "New: a foe the slam drives down bursts on the foes round it.", values: { crash: 1.2 } },
    { text: "Launched foes take +20% to +40%.", values: { airBonus: 0.4 } },
    { text: "New: the heave cuts behind her too.", values: { behind: 1 } },
    { text: "Heave power +1.4 to +3.4; the crash hits far harder.", values: { power: 3.4, crash: 3.5 } },
  ],
  [
    { text: "The second slash throws foes up.", drill: { launch: 210 } },
    { text: "New: foes in the air take an extra 0.4 AD from her slashes.", drill: { air: 0.4 } },
    { text: "New: one more air slash per jump.", drill: { airSlashes: 1 } },
    { text: "The heave throws foes higher.", drill: { launch: 270 } },
    { text: "Air bonus 0.4 to 0.9 AD.", drill: { air: 0.9 } },
    { text: "New: the heave staggers what it throws.", drill: { stagger: 0.5 } },
    { text: "New: two more air slashes per jump.", drill: { airSlashes: 2 } },
    { text: "Air bonus 0.9 to 2.6 AD.", drill: { air: 2.6 } },
  ],
);

export const SKYWARD_HEAVE: SkillDef = {
  id: "br_launch",
  name: "Skyward Heave",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "The second slash, Rising Heave, throws foes up for the slam and the air slash.",
  levels: LEVELS,
  evolution: {
    partner: "br_cleave",
    name: "Skyfall",
    text: "Foes the heave throws crash down after a moment for 2 AD.",
    row: evolvedRow(LEVELS[7], "Thrown foes crash down for 2 AD.", {
      ...drillValues({ crash: 2 }),
      crashFissure: 1.5,
    }),
  },
};
