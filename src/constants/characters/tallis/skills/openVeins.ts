import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Blows from behind add a Bleed, 0.06x a second.",
    values: { damage: 0.06, max: 5, life: 4, front: 0, gloam: 0, slow: 0, spread: 0, burst: 0 },
  },
  { text: "Blows from the front add Bleed too.", values: { front: 1 } },
  { text: "Up to 10 stacks.", values: { max: 10 } },
  { text: "A hit on a bleeding foe gives 2 Gloam.", values: { gloam: 2 } },
  { text: "Bleeding foes are slowed; 0.1x.", values: { damage: 0.1, slow: 1 } },
  { text: "Bleed deals 0.14x.", values: { damage: 0.14 } },
  { text: "Bleed spreads when its foe dies; 6 s.", values: { life: 6, spread: 1 } },
  { text: "Bleed deals 0.2x.", values: { damage: 0.2 } },
]);

/** Open Veins. Design: docs/skills/tallis.md. Values: damage: attack damage a stack deals a second; max: most stacks; life: seconds stacks last; front: 1 blows from the front add stacks too; gloam: Gloam a hit on a bleeding foe gives; slow: 1 bleeding foes are slowed; spread: 1 Bleed passes to the nearest foe when its foe dies; burst: 1 a foe at most stacks bursts, 1.0x per stack to foes within 30 px (evolution) */
export const OPEN_VEINS: SkillDef = {
  id: "t_openVeins",
  name: "Open Veins",
  kind: "dot",
  risk: "easy",
  button: "auto",
  text: "His blows from behind leave a Bleed that stacks.",
  levels: LEVELS,
  evolution: {
    partner: "t_nightshade",
    name: "Exsanguinate",
    text: "A foe at most Bleed bursts, 1.0x per stack to every foe within 30 px.",
    row: evolvedRow(LEVELS[7], "A foe at most Bleed bursts.", { burst: 1 }),
  },
};
