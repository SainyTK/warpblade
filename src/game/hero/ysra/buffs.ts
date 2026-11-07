import { objectMemory, rememberPerSeat } from "../../seatMemory";

/**
 * Bonuses one part of Ysra's kit grants and another reads, so no part imports another: seconds of Riposte and of
 * Sun Piercer's crits after a counter, seconds the Eternal Hearth glow lights the glaive, the full-Heat bonus to her
 * blows while the bar is full, the pixels Overheat's tongue of flame adds to her reach, and the share of damage Sunflock's
 * hawks take off her while they fly.
 */
export const buffs = { riposte: 0, riposteBonus: 0, crits: 0, glow: 0, glowBonus: 0, full: 0, reach: 0, guard: 0 };
rememberPerSeat(objectMemory(buffs));

/** count the timed buffs down */
export function tickBuffs(dt: number): void {
  buffs.riposte = Math.max(0, buffs.riposte - dt);
  buffs.crits = Math.max(0, buffs.crits - dt);
  buffs.glow = Math.max(0, buffs.glow - dt);
}

/** every bonus on her glaive blows now, added into one share (0.5 is +50%) */
export const blowBonus = (): number =>
  (buffs.riposte > 0 ? buffs.riposteBonus : 0) + (buffs.glow > 0 ? buffs.glowBonus : 0) + buffs.full;

export function resetBuffs(): void {
  Object.assign(buffs, { riposte: 0, riposteBonus: 0, crits: 0, glow: 0, glowBonus: 0, full: 0, reach: 0, guard: 0 });
}
