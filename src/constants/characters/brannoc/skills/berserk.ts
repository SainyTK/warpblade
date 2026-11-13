import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Last Cleave deals 1.3x; each kill in Berserk adds 0.5 s.",
    values: { power: 1.3, extend: 0.5, strikes: 1, wider: 0, stun: 0, repay: 2, extra: 0, settle: 0, world: 0 },
  },
  { text: "Last Cleave strikes twice.", values: { strikes: 2 } },
  { text: "Last Cleave deals 1.6x and rings 25% wider.", values: { power: 1.6, wider: 0.25 } },
  { text: "The roar stuns foes 1 s.", values: { stun: 1 } },
  { text: "Blows repay triple in Berserk.", values: { repay: 3 } },
  { text: "Last Cleave deals 2x; Berserk lasts 1 s longer.", values: { power: 2, extra: 1 } },
  { text: "The last strike of Last Cleave wins back the whole debt.", values: { settle: 1 } },
  { text: "Last Cleave strikes three times; Berserk lasts 2 s longer.", values: { strikes: 3, extra: 2 } },
]);

/** Berserk, the skill that upgrades his special. Design: docs/skills/brannoc.md. Values (read by `castBerserk` through `ultimateValues`): power: a multiple on Last Cleave's damage; extend: seconds each kill in Berserk adds; strikes: times Last Cleave strikes; wider: share wider its ring is; stun: seconds the roar stuns foes; repay: a multiple on repays in Berserk; extra: seconds Berserk lasts longer; settle: 1 the last strike wins back the whole debt; world: 1 Last Cleave splits the floor across the stage (evolution) */
export const BERSERK_SKILL: SkillDef = {
  id: "b_berserk",
  name: "Berserk",
  kind: "ultimate",
  risk: "timed",
  button: "U",
  text: "Berserk lasts longer as he kills, and Last Cleave strikes harder, wider and more than once.",
  levels: LEVELS,
  evolution: {
    partner: "b_bloodTrail",
    name: "World Ender",
    text: "Every strike of Last Cleave splits the floor across the whole stage, 3x.",
    row: evolvedRow(LEVELS[7], "Last Cleave splits the floor across the stage, 3x.", { world: 1, power: 3 }),
  },
};
