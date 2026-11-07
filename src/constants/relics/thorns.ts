import type { RelicDef } from "../../types/build";
import { ramp } from "../../utils/color";

/** Thorn Trail. Design: docs/growth-design.md */
export const THORNS: RelicDef = {
  id: "thorns",
  name: "Thorn Trail",
  text: "Moving leaves thorns that hurt foes standing in them.",
  levels: [
    { damage: 3, cooldown: 0.5, amount: 1, area: 1, duration: 2, text: "Thorns sprout where you move." },
    { damage: 3, cooldown: 0.5, amount: 2, area: 1, duration: 2, text: "Thorns sprout twice as often." },
    { damage: 5, cooldown: 0.5, amount: 2, area: 1.2, duration: 2, text: "Damage +2, larger thorns." },
    { damage: 5, cooldown: 0.5, amount: 2, area: 1.2, duration: 2.5, text: "Thorns last longer." },
    { damage: 8, cooldown: 0.45, amount: 3, area: 1.2, duration: 2.5, text: "Damage +3, more thorns." },
    { damage: 8, cooldown: 0.45, amount: 3, area: 1.4, duration: 3, text: "Larger thorns that last longer." },
    { damage: 11, cooldown: 0.4, amount: 3, area: 1.4, duration: 3, text: "Damage +3, they hurt more often." },
    { damage: 15, cooldown: 0.4, amount: 4, area: 1.6, duration: 3, text: "Damage +4, more, larger thorns." },
  ],
  evolution: {
    charm: "swiftness",
    name: "Bramble Wake",
    text: "Thorns follow you and grow while you move.",
    stats: {
      damage: 24,
      cooldown: 0.3,
      amount: 4,
      area: 2,
      duration: 3,
      text: "Thorns follow you and grow while you move.",
    },
  },
};

/** where thorns grow and how big they are; `area` scales their size, `amount` how many sprout per stretch of floor */
export const THORN_GROWTH = {
  /** art pixels of floor the hero covers for each thorn at amount 1 */
  stretch: 30,
  /** a thorn's half width and height at area 1 */
  halfWidth: 5,
  height: 7,
  /** extra thorns a landing on the floor sprouts, spread around the feet */
  landing: 2,
  /** seconds a thorn takes to push up out of the floor, and to sink back */
  sprout: 0.12,
  wither: 0.3,
} as const;

/** Bramble Wake's patch under the hero: its half width at area 1, the share of that it grows per art pixel moved, and its limits */
export const BRAMBLE_PATCH = {
  halfWidth: 9,
  growPerPixel: 0.012,
  /** the most it grows to, as a multiple of its starting width */
  most: 2.5,
  /** how fast it shrinks back while the hero stands still, as a share of its growth per second */
  shrink: 0.35,
} as const;

/** thorn colours, root to point: bark-dark wedges with bone tips; Bramble Wake's are briar crimson with rose-lit points */
export const THORN_COLORS = {
  trail: ramp(["#140c12", "#3a2630", "#6e4a48", "#b89478", "#f2e4cc"]),
  bramble: ramp(["#120a14", "#3e1434", "#7a2458", "#e0589a", "#ffd0ea"]),
} as const;
