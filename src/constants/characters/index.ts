import type { CharacterDef } from "../../types/character";
import { KAEL } from "./kael";
import { SABLE } from "./sable/index";
import { YSRA } from "./ysra/index";

/** every playable hero, in the order the hero screen shows them */
export const CHARACTERS: readonly CharacterDef[] = [KAEL, YSRA, SABLE];
