import { WIDE_MP } from "../../../constants/orrin/abilities";
import { hero } from "../../state";
import { cutForSharedAction, maySharedAct } from "../sharedCut";

/** a long press casts the wide form when the MP bar pays for it, and the plain form otherwise */
export const castsWide = (wide: boolean, mp: number): boolean => wide && hero.mp >= mp * WIDE_MP;

/**
 * An ability on I starts now if a shared action may cut in, paying its MP (more for the wide form); false keeps the
 * press waiting. The shared bar has already checked that it is ready and paid for.
 */
export function startAbility(mp: number, wide: boolean): boolean {
  if (!maySharedAct()) return false;
  cutForSharedAction();
  hero.mp -= wide ? mp * WIDE_MP : mp;
  return true;
}
