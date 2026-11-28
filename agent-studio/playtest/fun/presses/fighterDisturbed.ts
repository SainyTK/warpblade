import type { FighterProbe } from "./types";

export const fighterDisturbed = (base: FighterProbe, cur: FighterProbe): boolean =>
  cur.hp < base.hp || cur.state === "hurt" || cur.state === "dead";
