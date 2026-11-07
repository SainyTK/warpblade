import { COIN_PAID_FOES } from "../constants/coins";
import { waveQuota } from "./waves";

/** the share of its base coins a minion drops in a wave, so a run's coins stay level as waves bring more foes */
export const coinShare = (wave: number): number =>
  Math.min(
    1,
    Math.min(COIN_PAID_FOES.base + Math.floor(wave / COIN_PAID_FOES.every), COIN_PAID_FOES.most) / waveQuota(wave),
  );

/** coins a foe drops: its base, raised by a bonus share; a fraction left over drops one more coin when roll is below it */
export function coinDrop(base: number, bonus: number, roll: number): number {
  const exact = base * (1 + bonus);
  const whole = Math.floor(exact);
  return whole + (roll < exact - whole ? 1 : 0);
}
