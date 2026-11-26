export const DRILL_STATUS = {
  moonLift: -190,
  galeStacks: { stacks: 1, max: 4, power: 0.14, every: 0.5, duration: 3 },
  galePush: 70,
  galeStagger: 0.25,
  threadMark: { seconds: 3, bonus: 0.15 },
  threadPull: 60,
  infusedEcho: { power: 0.3, delay: 0.09 },
  finisherLaunch: -240,
  finisherLeap: 230,
  airJuggle: -150,
} as const;

export const TIER_EFFECT = {
  waveShare: 0.35,
  danceShare: 0.22,
  danceGap: 0.07,
  phantomLife: 0.32,
} as const;
