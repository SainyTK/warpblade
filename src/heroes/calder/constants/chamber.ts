/** Calder's chamber: the rounds it holds, the reload and the round each Trigger fires into the wound */

/** rounds a full chamber holds before Drum Cylinder adds more */
export const CHAMBER_ROUNDS = 6;

/**
 * The reload on J with an empty chamber, in seconds of its clip: the cylinder swings out, rounds go in, and it snaps
 * shut at `loaded`. A J pressed while the cylinder glints (`quickFrom` to `quickTo`) is a quick reload: the cylinder
 * snaps shut at once and the rounds are hot. A press before the glint spoils it. Past `loaded` J cuts into the string.
 */
export const RELOAD = { dur: 0.6, loaded: 0.42, quickFrom: 0.16, quickTo: 0.3 } as const;

/** the blast of a round fired into a blow's wound: on the struck foe, and a smaller splash on foes close by */
export const TRIGGER = { blast: 1.2, splash: 0.5, reach: 18, kx: 60 } as const;

/** hot rounds' blasts hit this much harder */
export const HOT_BLAST = 1.5;

/** seconds the arms kick back after a round goes off, and seconds the meter flashes on a dry click */
export const RECOIL_TIME = 0.14;
export const CLICK_FLASH = 0.35;

/** the chamber's colours on the HUD: the rounds, and hot rounds */
export const CHAMBER_TINT = { cold: "#b4ff5a", hot: "#ffe066" } as const;
