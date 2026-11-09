import type { SkillDef } from "../../../../types/skill";

/** Lampflies. Design: docs/skills/wenna.md. Values: chance: chance a J hit sends them; cooldown: seconds between swarms; count: lampflies it sends; power: ability power of each lampfly's strike; chill: 1 their strikes chill; stay: seconds they stay circling her after their dart (0: they fade); swarm: 1 every cast on I sends a swarm too (evolution) */
export const LAMPFLIES: SkillDef = {
  id: "w_lampflies",
  name: "Lampflies",
  kind: "summon",
  risk: "easy",
  button: "J",
  text: "A blow that lands may shake lampflies out of her lantern.",
  levels: [
    {
      text: "15% on a J hit: three lampflies dart for 0.3x.",
      values: { chance: 0.15, cooldown: 2, count: 3, power: 0.3, chill: 0, stay: 0, swarm: 0 },
    },
    { text: "25% chance.", values: { chance: 0.25, cooldown: 2, count: 3, power: 0.3, chill: 0, stay: 0, swarm: 0 } },
    {
      text: "Five lampflies.",
      values: { chance: 0.25, cooldown: 2, count: 5, power: 0.3, chill: 0, stay: 0, swarm: 0 },
    },
    {
      text: "Lampflies deal 0.4x.",
      values: { chance: 0.25, cooldown: 2, count: 5, power: 0.4, chill: 0, stay: 0, swarm: 0 },
    },
    {
      text: "Lampflies chill.",
      values: { chance: 0.25, cooldown: 2, count: 5, power: 0.4, chill: 1, stay: 0, swarm: 0 },
    },
    {
      text: "They circle you 5 s.",
      values: { chance: 0.25, cooldown: 2, count: 5, power: 0.4, chill: 1, stay: 5, swarm: 0 },
    },
    {
      text: "Lampflies deal 0.6x.",
      values: { chance: 0.25, cooldown: 2, count: 5, power: 0.6, chill: 1, stay: 5, swarm: 0 },
    },
    {
      text: "Lampflies deal 0.8x.",
      values: { chance: 0.25, cooldown: 2, count: 5, power: 0.8, chill: 1, stay: 5, swarm: 0 },
    },
  ],
  evolution: {
    partner: "w_lampVolley",
    name: "Lantern Swarm",
    text: "Every cast on I sends a swarm too.",
    row: {
      text: "Every cast sends a swarm.",
      values: { chance: 0.25, cooldown: 2, count: 5, power: 0.8, chill: 1, stay: 5, swarm: 1 },
    },
  },
};
