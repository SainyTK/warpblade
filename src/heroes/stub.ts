import type { CharacterDef } from "../types/character";
import { KAEL } from "./kael/character";

/**
 * A hero not built yet: Kael's data under the hero's own id, name, accent and price, flagged `stub`. Each of the eight
 * new sword heroes starts as one so the roster is whole while they are built; a finished hero replaces its
 * `character.ts` and `index.ts` and no longer calls this. When no hero calls it, this file, `CharacterDef.stub` and the
 * filter on it in `roster.ts` go.
 */
export function stubCharacter(own: Pick<CharacterDef, "id" | "name" | "accent" | "price">): CharacterDef {
  return {
    ...KAEL,
    ...own,
    title: "Not built yet",
    blurb: `A stand-in that plays as ${KAEL.name} until ${own.name} is built.`,
    achievements: [],
    stub: true,
  };
}
