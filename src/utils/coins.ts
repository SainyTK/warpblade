/** coins a foe drops: its base, raised by a bonus share; a fraction left over drops one more coin when roll is below it */
export function coinDrop(base: number, bonus: number, roll: number): number {
  const exact = base * (1 + bonus);
  const whole = Math.floor(exact);
  return whole + (roll < exact - whole ? 1 : 0);
}
