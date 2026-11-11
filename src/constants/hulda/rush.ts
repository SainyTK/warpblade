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
  /** the stride's middle key after the load, where the feet pass the other way; the charge's last key, `lastKey` before
   *  its end, repeats it */
  midStride: frame(5),
  lastKey: frame(1),
  /**
   * Once her shoulder has met a foe and no other foe stands within this many pixels ahead of it, the charge stops at the
   * next stride key and she skids out just past the foe, so a lone foe stays a step behind her.
   */
  ahead: 24,
  /** blows on her during the rush deal this share and never flinch her */
  armour: 0.5,
  power: 0.6,
  /** a short shove: the foe reels where her shoulder met it, so the skid leaves her a step past it */
  kx: 60,
  stun: 0.4,
  /** the box her shoulder sweeps, from her feet */
  box: [0, -26, 12, 0] as const,
  /** Bull Horns: foes on her shoulder are slammed down this stunned, and from level 7 minions are thrown up this fast */
  hornsStun: 0.8,
  hornsLaunch: -220,
} as const;
