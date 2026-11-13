import type { GuardStyle, WarpStyle } from "../../types/moveset";
import { drawThrownSword } from "../effects/thrownWeapon";

/** TEMPORARY while each hero's rework lands (task T-mac-253): the shared warp with Kael's sword drawn */
export const PROVISIONAL_WARP: WarpStyle = { drawThrown: drawThrownSword };
/** TEMPORARY while each hero's rework lands: a plain guard with no parry reward of its own */
export const PROVISIONAL_GUARD: GuardStyle = { chip: 0.25, blockCost: 15, parried: () => {} };
