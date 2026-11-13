import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Berserk lasts 2 s longer and Last Cleave strikes twice.",
    values: { extra: 2, strikes: 2, wider: 0, repay: 2, extend: 0, stun: 0, power: 1, world: 0 },
  },
  { text: "Last Cleave rings 20% wider.", values: { wider: 0.2 } },
  { text: "Last Cleave deals 1.5x.", values: { power: 1.5 } },
  { text: "Repays triple in it.", values: { repay: 3 } },
  { text: "Each kill adds 0.5 s.", values: { extend: 0.5 } },
  { text: "2x; 35% wider.", values: { power: 2, wider: 0.35 } },
  { text: "The roar stuns foes 1 s.", values: { stun: 1 } },
  { text: "3x; 3 s longer.", values: { power: 3, extra: 3 } },
]);

/** Unending Rage. Design: docs/skills/brannoc.md. Values: extra: seconds Berserk lasts longer; strikes: times Last Cleave strikes; wider: share wider its ring is; repay: a multiple on repays in it; extend: seconds each kill in it adds; stun: seconds the roar stuns foes; power: a multiple on Last Cleave's damage; world: 1 Last Cleave splits the floor across the stage (evolution) */
export const UNENDING_RAGE: SkillDef = {
  id: "b_unending",
  name: "Unending Rage",
  kind: "ultimate",
  risk: "timed",
  button: "U",
  text: "Replaces Berserk: it lasts longer, and Last Cleave strikes twice.",
  ultimate: "unendingRage",
  levels: LEVELS,
  evolution: {
    partner: "b_bloodTrail",
    name: "World Ender",
    text: "Last Cleave splits the floor across the whole stage, 4x.",
    row: evolvedRow(LEVELS[7], "Last Cleave splits the floor across the stage, 4x.", { world: 1, power: 4 }),
  },
};
