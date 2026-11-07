import type { HeroSource, SourceId } from "../types/build";

/** the hero's own sources: their hits build Flow, and the hero holds them from the start of the run; every other
 *  source is a skill's id */
export const HERO_SOURCES: ReadonlySet<SourceId> = new Set<SourceId>(["attacks", "abilities", "ultimate"]);

/** the icon of each hero's own sources on the end of run screen, by hero id; the ultimate shows the learned one's own icon when there is one */
export const HERO_SOURCE_ICONS: Readonly<Record<string, Readonly<Record<HeroSource, string>>>> = {
  kael: { attacks: "b_edge", abilities: "a_flame", ultimate: "b_ult" },
  ysra: { attacks: "y_heft", abilities: "r_flare", ultimate: "y_sunspear" },
  sable: { attacks: "sable_bolts", abilities: "sable_snare", ultimate: "sable_storm" },
  hulda: { attacks: "h_fists", abilities: "h_bellow", ultimate: "h_quake" },
};
