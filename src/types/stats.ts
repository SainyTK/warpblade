/** ad: attack damage, ap: ability power, hp, mp and stamina: maxima, crit: chance 0 to 1, move and aspd: speed multipliers, haste: how fast spells recharge */
export type StatKey = "ad" | "ap" | "hp" | "mp" | "stamina" | "crit" | "move" | "aspd" | "haste";
export type Stats = Record<StatKey, number>;
