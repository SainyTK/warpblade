import type { RelicDef } from "../../types/build";

/** Ember Aura. Design: docs/growth-design.md */
export const AURA: RelicDef = {
  id: "aura",
  name: "Ember Aura",
  text: "A ring of embers burns foes close to you.",
  levels: [
    { damage: 4, cooldown: 0.8, area: 1, text: "Embers burn foes close by." },
    { damage: 5, cooldown: 0.8, area: 1.3, text: "Damage +1, wider ring." },
    { damage: 6, cooldown: 0.7, area: 1.3, text: "Damage +1, burns more often." },
    { damage: 7, cooldown: 0.7, area: 1.5, text: "Damage +1, wider ring." },
    { damage: 9, cooldown: 0.6, area: 1.5, text: "Damage +2, burns more often." },
    { damage: 10, cooldown: 0.6, area: 1.7, text: "Damage +1, wider ring." },
    { damage: 12, cooldown: 0.5, area: 1.7, text: "Damage +2, burns more often." },
    { damage: 16, cooldown: 0.5, area: 2, text: "Damage +4, wider ring." },
  ],
  evolution: {
    charm: "vigor",
    name: "Sun Heart",
    text: "A larger, hotter ring, and every kill in it heals you.",
    stats: { damage: 30, cooldown: 0.4, area: 2.6, text: "A larger, hotter ring, and every kill in it heals you." },
  },
};

/** the ring's size and the heat it gives off; `area` scales the radius */
export const AURA_REACH = {
  /** horizontal radius in art pixels at area 1 */
  radius: 22,
  /** the burning oval is this tall for its width, centred on the hero's middle */
  tall: 0.75,
  /** the drawn ring lies on the floor, this flat */
  floor: 0.3,
  /** height of the hero's middle above their feet */
  middle: 12,
} as const;

/** Sun Heart's healing: a share of max HP per kill inside the ring, with at most `cap` of max HP each second */
export const SUN_HEART_HEAL = { perKill: 0.015, cap: 0.05 } as const;
