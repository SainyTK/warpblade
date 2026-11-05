import { HERO_MOVE } from "../combat";
import { frame } from "../hero";

/** Ysra's one jump: pixels it rises with Up held all the way (Kael 62) */
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
  /** seconds between vaults, shown on the HUD tab */
  cooldown: 1.2,
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

/** the brace and its parry */
export const BRACE = {
  /** stamina per blocked blow; Firm Stance takes this share off per rank */
  blockCost: 12,
  firmCut: 0.3,
  /** a blow in this long after the press is a parry; Ember Parry doubles it */
  parryWindow: 0.12,
  /** the attacker reels this long; bosses half as long */
  parryStun: 1,
  /** world slow motion after a parry, in seconds */
  parrySlow: 0.35,
  /** Counter Thrust: J is the counter for this long after a parry */
  counterTime: 0.8,
  /** Ember Parry sets the attacker on fire for this many seconds */
  emberBurn: 3,
  /** a blow from within this many pixels behind her middle still counts as the front */
  frontSlack: 2,
  /** the parry knocks aside a foe within this many pixels of where the blow came from */
  attackerReach: 40,
  /** pushed back this fast by a block; Bulwark keeps this share of it */
  pushback: 110,
  bulwarkPush: 0.15,
  /** after a block or parry, more blows from the front in this long are taken without cost */
  shieldTime: 0.22,
} as const;

/** L with a side held away: a low hop back that nothing touches at first */
export const BACKSTEP = {
  distance: 30,
  /** pixels of the hop */
  hop: 5,
  cost: 25,
  guard: 0.12,
  /** a side held away that turned her this recently still counts as away */
  turnGrace: 0.15,
  /** the skid after the hop lands */
  skid: frame(4),
} as const;

/** Warpath: the charge shoulders foes it runs into */
export const WARPATH = {
  power: 0.35,
  kx: 220,
  /** small foes are bumped up off their feet as well as aside */
  launch: -150,
  stagger: 0.5,
  /** the same foe is not shouldered again for this long */
  again: 0.6,
  /** ahead of her feet, the box the shoulder hits */
  box: [0, -26, 12, 0] as const,
} as const;

/** Earthshaker: the shockwave that runs along the floor both ways from a vault or dive landing */
export const QUAKE = {
  speed: 230,
  range: 96,
  power: 0.7,
  stun: 0.5,
  /** pixels above the floor the wave hits */
  height: 14,
} as const;

/** Unbroken: below this share of her HP she takes this much of the damage */
export const UNBROKEN = { below: 1 / 3, scale: 0.7 } as const;

/** seconds from leaving the floor to coming back to it, for a rise of this many pixels under this share of gravity */
const airtime = (rise: number, gravity: number): number => 2 * Math.sqrt((2 * rise) / (HERO_MOVE.gravity * gravity));

/** the vault on flat floor: when she leaves the floor, when she tucks over the haft, when she lands, and when she is free again */
export const VAULT_TIMES = (() => {
  const land = VAULT.plant + airtime(VAULT.peak, VAULT.gravity);
  return { launch: VAULT.plant, tuck: VAULT.plant + frame(2), land, end: land + VAULT.recover };
})();
/** her speed along the floor in the vault's flight, so the flight covers VAULT.travel */
export const VAULT_SPEED = VAULT.travel / (VAULT_TIMES.land - VAULT_TIMES.launch);

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

/**
 * The brace clip in segments: raising the guard, a held loop that breathes, the jolt of a block and the snap of a
 * parry. Each segment goes back into the loop when it ends.
 */
export const BRACE_TIMES = {
  loopFrom: frame(4),
  loopTo: frame(40),
  block: frame(40),
  blockEnd: frame(48),
  parry: frame(48),
  parryEnd: frame(62),
} as const;
