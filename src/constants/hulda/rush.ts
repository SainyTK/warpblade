import { frame } from "../hero";

/** L: an armoured shoulder charge along the floor */
export const RUSH = {
  cost: 25,
  load: frame(2),
  /** seconds she charges, at this speed times move speed */
  time: 0.32,
  speed: 200,
  recover: frame(6),
  cooldown: 0.4,
  /** the rush clip's stride, from `stride[0]` after the load to `stride[1]`, loops while a skill makes the rush longer */
  stride: [frame(2), frame(8)] as const,
  /** blows on her during the rush deal this share and never flinch her */
  armour: 0.5,
  power: 0.6,
  kx: 180,
  stun: 0.4,
  /** the box her shoulder sweeps, from her feet */
  box: [0, -26, 12, 0] as const,
  /** Bull Horns: foes on her shoulder are slammed down this stunned, and from level 7 minions are thrown up this fast */
  hornsStun: 0.8,
  hornsLaunch: -220,
} as const;
