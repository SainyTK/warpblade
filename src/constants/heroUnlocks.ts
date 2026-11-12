/**
 * Coins to unlock each hero on the hero screen. A hero not listed here is free and unlocked from the start (Kael, Ysra).
 *
 * Each new hero gets the next price: the n-th hero added here costs 300 x 1.35^(n - 1), rounded to the nearest 50.
 * That gives 300, 400, 550, 750, 1000, 1350, 1800, 2450 and 3300 for the first nine.
 * Basis (docs/meta-progress.md): a run that reaches wave 8 to 10 banks about 60 to 80 coins and a full clear about 440,
 * so the first hero takes a few good runs and the ninth about seven full clears.
 * A hero may be listed before it is in CHARACTERS; it shows up locked once it is added there.
 */
export const HERO_PRICES: Readonly<Record<string, number>> = {
  sable: 300,
  hulda: 400,
  orrin: 550,
  mirel: 750,
  wenna: 1000,
  tallis: 1350,
  jory: 1800,
  brannoc: 2450,
};
