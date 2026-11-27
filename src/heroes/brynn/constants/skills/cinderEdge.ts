import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  { text: "Her slashes lay searing embers that burn foes.", values: { damage: 0.06, max: 4, stacks: 1, finisher: 1 } },
  { text: "New: the third slash lays 3 embers.", values: { finisher: 3 } },
  { text: "New: the third slash spreads a foe's embers to the foes beside it.", values: { spread: 1 } },
  { text: "Embers burn 0.06 to 0.12 AD a tick; a foe holds 8.", values: { damage: 0.12, max: 8 } },
  { text: "New: a dash lays 2 embers on each foe it passes through.", values: { dash: 2 } },
  { text: "Embers burn 0.12 to 0.22 AD.", values: { damage: 0.22 } },
  { text: "New: each slash lays 2 embers; a foe holds 12.", values: { stacks: 2, max: 12 } },
  { text: "Embers burn 0.22 to 0.45 AD.", values: { damage: 0.45 } },
]);

export const CINDER_EDGE: SkillDef = {
  id: "br_cinder",
  name: "Cinder Edge",
  kind: "dot",
  element: "blaze",
  risk: "easy",
  button: "auto",
  text: "Her slashes lay searing embers, and the third slash lays the most.",
  levels: LEVELS,
  evolution: {
    partner: "br_arc",
    name: "Forge Heart",
    text: "A foe filled with embers bursts into a crimson blast that burns those round it.",
    row: evolvedRow(LEVELS[7], "A foe full of embers bursts.", { burst: 0.5 }),
  },
};
