import type { SkillDef } from "../../../../types/skill";

/** Hunting Hawk: A hawk dives on the foe she hits. Values: chance: chance a landed bolt calls the hawk; cooldown: least seconds between calls; power: attack damage of a dive; stay: seconds the hawk hunts; every: seconds between dives; hawks: hawks at once; launch: a dive throws the foe up; carry: attack damage of a carried foe's drop; venom: poison stacks each dive lays. Design: docs/skills/sable.md */
export const HUNTING_HAWK: SkillDef = {
  id: "s_hawk",
  name: "Hunting Hawk",
  kind: "summon",
  risk: "easy",
  button: "auto",
  text: "A hawk dives on the foe she hits.",
  levels: [
    {
      text: "A hawk may dive on the foe you hit.",
      values: { chance: 0.1, cooldown: 2, power: 1.2, stay: 0, every: 1.2, hawks: 1, launch: 0, carry: 0, venom: 0 },
    },
    {
      text: "The hawk comes more often.",
      values: { chance: 0.18, cooldown: 2, power: 1.2, stay: 0, every: 1.2, hawks: 1, launch: 0, carry: 0, venom: 0 },
    },
    {
      text: "The hawk stays and dives again.",
      values: { chance: 0.18, cooldown: 2, power: 1.2, stay: 4, every: 1.2, hawks: 1, launch: 0, carry: 0, venom: 0 },
    },
    {
      text: "The hawk strikes harder.",
      values: { chance: 0.18, cooldown: 1.5, power: 2, stay: 4, every: 1.2, hawks: 1, launch: 0, carry: 0, venom: 0 },
    },
    {
      text: "The hawk throws foes into the air.",
      values: { chance: 0.18, cooldown: 1.5, power: 2, stay: 4, every: 1.2, hawks: 1, launch: 140, carry: 0, venom: 0 },
    },
    {
      text: "Two hawks hunt at once.",
      values: { chance: 0.18, cooldown: 1.5, power: 2, stay: 4, every: 1.2, hawks: 2, launch: 140, carry: 0, venom: 0 },
    },
    {
      text: "The hawk carries foes up and drops them.",
      values: { chance: 0.18, cooldown: 1.5, power: 2, stay: 4, every: 1.2, hawks: 2, launch: 140, carry: 2, venom: 0 },
    },
    {
      text: "The hawks hunt longer and harder.",
      values: {
        chance: 0.18,
        cooldown: 1.5,
        power: 1.6,
        stay: 6,
        every: 1.2,
        hawks: 2,
        launch: 140,
        carry: 2,
        venom: 0,
      },
    },
  ],
  evolution: {
    partner: "s_venom",
    name: "Shrike Flock",
    text: "Four hawks that never leave, each dive laying three poison stacks.",
    row: {
      text: "Four hawks that never leave and poison.",
      values: {
        chance: 1,
        cooldown: 1.5,
        power: 1.6,
        stay: 999,
        every: 1.2,
        hawks: 4,
        launch: 140,
        carry: 2,
        venom: 3,
      },
    },
  },
};
