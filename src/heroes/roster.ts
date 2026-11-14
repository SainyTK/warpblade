import type { CharacterDef } from "../types/character";
import { ALDRIC } from "./aldric/character";
import { BRYNN } from "./brynn/character";
import { CALDER } from "./calder/character";
import { CERISE } from "./cerise/character";
import { KAEL } from "./kael/character";
import { SAYA } from "./saya/character";
import { VESPER } from "./vesper/character";
import { YUN } from "./yun/character";
import { ZAFIR } from "./zafir/character";

/**
 * The roster: every playable hero's data by id, in the order the hero screen shows them. This is the data half of the
 * hero registry: it imports each hero's `character.ts` and nothing that touches game state, so constants, stores and
 * menus may read it. The code half is `src/heroes/index.ts`.
 */
export const ROSTER = {
  kael: KAEL,
  cerise: CERISE,
  aldric: ALDRIC,
  vesper: VESPER,
  saya: SAYA,
  yun: YUN,
  brynn: BRYNN,
  zafir: ZAFIR,
  calder: CALDER,
} satisfies Record<string, CharacterDef>;

/** a hero's id: a key of the roster */
export type HeroId = keyof typeof ROSTER;

/** every playable hero, in the order the hero screen shows them */
export const CHARACTERS: readonly CharacterDef[] = Object.values(ROSTER);
