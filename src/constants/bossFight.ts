export const BOSS_ENTRANCE = {
  roarAt: 0.25,
  hold: 2.2,
  slow: 0.6,
  shake: { time: 0.8, amp: 5 },
  ring: 80,
  light: 120,
  card: 2.6,
} as const;

export const BOSS_SHIFT = {
  untouchable: 1.2,
  slow: 0.5,
  flash: 0.3,
  ring: 120,
  shake: { time: 0.6, amp: 4 },
  push: { reach: 150, speed: 330, lift: -190 },
  addsAt: 0.6,
  addSpread: 90,
} as const;

export const BOSS_FINALE = {
  slow: 1.8,
  bursts: 8,
  every: 0.17,
  spread: 20,
  flashAt: 1.45,
  flash: 0.5,
  done: 3.2,
  card: 3.4,
} as const;

export const BOSS_ARENA = {
  shadow: 0x05030b,
  gather: 0.68,
  fight: 0.2,
  rage: 0.3,
  finale: 0.45,
  tint: 0.16,
  ease: 3,
  bars: 12,
  sealWidth: 7,
  glow: 110,
} as const;

export const BOSS_HASTE = { calm: 1.3, enraged: 1.6, calmCombo: 0.5 } as const;

export const BOSS_TELEGRAPH = { ring: 34, light: 70 } as const;

export const BOSS_PHASES = { second: 0.7, third: 0.35 } as const;

export const BOSS_FRENZY = { haste: 1.9, enraged: 2.4, enragedPower: 1.5 } as const;

export const ENRAGE_AFTER = { elite: null, mini: 90, boss: 240 } as const;

export const BOSS_POISE = {
  share: 0.08,
  growth: 1.4,
  idle: 2,
  drain: 0.06,
  broken: 2.6,
} as const;

export const CONTROL_RESIST = { keep: 0.6, forget: 8 } as const;
