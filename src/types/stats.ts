/** ad: attack damage, ap: ability power, hp and mp: maxima, crit: chance 0 to 1, move and aspd: speed multipliers */
export type StatKey = "ad" | "ap" | "hp" | "mp" | "crit" | "move" | "aspd";
export type Stats = Record<StatKey, number>;
