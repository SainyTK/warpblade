import type { CharacterDef } from "../../types/character";
import { HULDA } from "./hulda/index";
import { KAEL } from "./kael";
import { MIREL } from "./mirel/index";
import { ORRIN } from "./orrin/index";
import { SABLE } from "./sable/index";
import { YSRA } from "./ysra/index";

/** every playable hero, in the order the hero screen shows them */
export const CHARACTERS: readonly CharacterDef[] = [KAEL, YSRA, SABLE, HULDA, ORRIN, MIREL];
