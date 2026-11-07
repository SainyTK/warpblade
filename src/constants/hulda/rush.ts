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
  /** blows on her during the rush deal this share and never flinch her */
  armour: 0.5,
  power: 0.6,
  kx: 180,
  stun: 0.4,
  /** the box her shoulder sweeps, from her feet */
  box: [0, -26, 12, 0] as const,
  /** Bull Horns: the first foe rides her shoulder and is slammed down at the end */
  hornsPower: 1.2,
  hornsStun: 0.8,
} as const;
