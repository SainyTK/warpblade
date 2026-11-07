import { HOLD } from "../../../constants/hulda/grab";
import { skillValues } from "../../skills/query";
import { inIron } from "./fury";

const ID = "h_unbroken";

/** the share of her walk she keeps while holding a foe: all of it in Unbroken's iron from level 6 */
export const holdWalk = (): number => (inIron() && skillValues(ID).fullHold ? 1 : HOLD.walk);

/** Unbroken's added share on throws while iron */
export const ironThrowBonus = (): number => (inIron() ? (skillValues(ID).throwBonus ?? 0) : 0);

/** Iron Titan: her grab holds minis and bosses while iron */
export const ironBigGrab = (): boolean => inIron() && skillValues(ID).bigGrab > 0;
