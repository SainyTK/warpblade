/** game time between two bot decisions */
export const BOT_TICK_MS = 50;
export const DEFAULT_RUNS = 1;
/** game minutes a bot run may last before it is stopped */
export const DEFAULT_MAX_MINUTES = 30;
/** a foe this close in x can be struck */
export const STRIKE_REACH = 24;
/** a foe this far above the hero needs a jump to reach */
export const HIGH_FOE = 28;
/** foe states in which a blow or a shot is on its way */
export const BLOW_STATES: ReadonlySet<string> = new Set(["lunge", "swipe", "charge", "dive", "leap", "beam", "shoot"]);
/** the foe state before a blow */
export const WINDUP_STATE = "wind";
/** a blow this close is dodged; a wind-up only when closer still */
export const BLOW_RANGE = { x: 56, y: 70 } as const;
export const WINDUP_RANGE = { x: 30, y: 70 } as const;
/** the foe state after a blow, when it is open to a counter */
export const RECOVER_STATE = "recover";
/** step out from under a high foe winding up or shooting this close */
export const HAZARD_RANGE = { x: 44, y: 90 } as const;
/** least game time between two dodges, and between two jumps over a foe */
export const DODGE_GAP_MS = 400;
export const VAULT_GAP_MS = 1200;
export const WARP_RANGE = { min: 70, max: 200 } as const;
export const SPELL_RANGE = 110;
export const ULT_RANGE = 110;
/** how long the skilled bot holds U to charge the ultimate */
export const ULT_HOLD_MS = 600;
/** J held this long is the warp (the game's long press is 250 ms) */
export const WARP_HOLD_MS = 320;
/** the skilled bot raises a held skill that has reached this level, so it heads for an evolution */
export const NEAR_EVOLUTION_LEVEL = 5;
/** otherwise it takes a new skill by kind in this order, then the highest skill level, then a charm, then a boon */
export const PICK_PRIORITY = ["ultimate", "attack", "summon", "spell", "dot", "movement", "passive"] as const;
/** a chest screen ignores input for a moment after it opens; the bot waits this long before it presses J */
export const CHEST_WAIT_MS = 600;
/** a pick ignores input for a moment after it opens; try again this often, this many times */
export const PICK_RETRY_MS = 100;
export const PICK_RETRIES = 30;
