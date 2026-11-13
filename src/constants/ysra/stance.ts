import { HERO_MOVE } from "../combat";
import { frame } from "../hero";

/** Ysra's one jump: pixels it rises (Kael 62) */
export const YSRA_JUMP_RISE = 46;

/**
 * The pole vault: she drives the glaive point into the floor ahead, swings up and over it, and lands about 70 px on.
 * Times are seconds from the press; the flight runs under heavier gravity so the arc reads as weight, not float.
 */
export const VAULT = {
  /** the plant: she stabs the point into the floor and loads onto it before she leaves the ground */
  plant: frame(5),
  /** where the point goes into the floor, pixels ahead of her feet */
  plantAhead: 20,
  peak: 40,
  /** pixels from the press to the landing on flat floor */
  travel: 70,
  gravity: 1.35,
  /** seconds between vaults, shown on its ability tab; a little longer than a vault on flat floor takes, so vaults chain */
  cooldown: 0.95,
  /** I held: the high vault rises this far and carries her this far, over a big foe */
  highPeak: 58,
  highTravel: 100,
  /** nothing touches her from the plant until this many seconds past the top of the arc */
  guardPastPeak: frame(3),
  /** the pose shown last crosses into the vault's first keys over this many frames, before the plant's stab */
  entryFrames: 2,
  /** Skyline: the second vault, thrown off the haft in the air, rises this much */
  airPeak: 24,
  /** the landing crouch after the flight, before she is free again */
  recover: frame(7),
} as const;

/** the dive: once per airtime, glaive first and down at 45 degrees, bursting where it hits */
export const DIVE = {
  /** the turn in the air before the drop, while she points the glaive down */
  tuck: frame(4),
  /** pixels per second along each axis, so the line is 45 degrees */
  speed: 300,
  /** the impact hits every foe this far to each side of the point, and this high */
  reach: 30,
  height: 30,
  power: 1.5,
  launch: -200,
  stun: 0.6,
  recover: frame(9),
} as const;

/** the vault crash (Vault Strike): the glaive driven down where she lands */
export const CRASH = {
  /** she raises the glaive overhead in the air before the drop */
  lift: frame(3),
  drop: 440,
  /** forward speed while it drops */
  drift: 70,
  reach: 36,
  power: 1.9,
  launch: -230,
  /** the clip time of the blow into the floor, and when the move ends */
  impactKey: frame(8),
} as const;

/** her guard on K: a firm block that costs little and lets little through, and a parry that opens the counter */
export const GUARD = {
  /** share of a blocked blow she still takes, and stamina per block */
  chip: 0.1,
  blockCost: 9,
  /** J is the counter thrust for this long after a parry */
  counterTime: 0.8,
  /** Heat a parry gives */
  parryHeat: 12,
} as const;

/** a side held away while she guards: a low hop back that nothing touches at first */
export const BACKSTEP = {
  distance: 36,
  /** pixels of the hop */
  hop: 5,
  cost: 20,
  guard: 0.15,
  /** a side held away that turned her this recently still counts as away */
  turnGrace: 0.15,
  /** the skid after the hop lands */
  skid: frame(4),
} as const;

/** Warpath: the charge shoulders foes it runs into */
export const WARPATH = {
  kx: 220,
  /** small foes are bumped up off their feet as well as aside, once Warpath throws them */
  launch: -150,
  stagger: 0.5,
  /** the same foe is not shouldered again for this long */
  again: 0.6,
  /** ahead of her feet, the box the shoulder hits */
  box: [0, -26, 12, 0] as const,
  /** Juggernaut: carried foes ride this far ahead of her feet, this far apart */
  carry: 26,
  stack: 7,
} as const;

/** the shockwave that runs along the floor both ways from a vault or dive landing (Vault Strike): its pixels per
 *  second, and how high above the floor it hits */
export const QUAKE = { speed: 230, height: 14 } as const;

/** seconds from leaving the floor to coming back to it, for a rise of this many pixels under this share of gravity */
const airtime = (rise: number, gravity: number): number => 2 * Math.sqrt((2 * rise) / (HERO_MOVE.gravity * gravity));

/** the vault on flat floor: when she leaves the floor, when she tucks over the haft, when she lands, and when she is free again */
export const VAULT_TIMES = (() => {
  const land = VAULT.plant + airtime(VAULT.peak, VAULT.gravity);
  return { launch: VAULT.plant, tuck: VAULT.plant + frame(2), land, end: land + VAULT.recover };
})();
/** her speed along the floor in the vault's flight, so the flight covers VAULT.travel; the high vault's covers its own */
export const VAULT_SPEED = VAULT.travel / (VAULT_TIMES.land - VAULT_TIMES.launch);
export const HIGH_VAULT_SPEED = VAULT.highTravel / airtime(VAULT.highPeak, VAULT.gravity);

/** the dive's clip: the tuck, the drop held until the floor, the blow into it and the pull out */
export const DIVE_TIMES = {
  drop: DIVE.tuck,
  hold: DIVE.tuck + frame(3),
  impact: DIVE.tuck + frame(4),
  end: DIVE.tuck + frame(4) + DIVE.recover,
} as const;

/** the backstep's clip: the hop, then the skid */
export const BACKSTEP_TIMES = (() => {
  const land = airtime(BACKSTEP.hop, 1);
  return { land, end: land + BACKSTEP.skid };
})();
/** her speed back along the floor in the hop, so the hop covers BACKSTEP.distance */
export const BACKSTEP_SPEED = BACKSTEP.distance / BACKSTEP_TIMES.land;

/** Haft Ward: a held guard burns foes pressed against it every `every` seconds, this far ahead of her feet; Temple Gate's
 *  ring bursts at most once every `ringEvery` seconds */
export const WARD = { every: 0.4, reach: 18, height: 34, ringEvery: 0.5 } as const;
