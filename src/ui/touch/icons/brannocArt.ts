import type { BrannocAbility } from "../../../types/brannoc";
import type { TouchButtonAction } from "../../../types/touch";
import type { IconArt } from "./iconArt";
import { JUMP } from "./sharedArt";

/** placeholder until Brannoc's button art lands */
export function brannocArt(_action: TouchButtonAction, _ability: BrannocAbility, _known: readonly BrannocAbility[]): IconArt {
  return JUMP;
}
