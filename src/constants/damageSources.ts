import type { HeroSource, SourceId } from "../types/build";

/** the hero's own sources: their hits build Flow, and the hero holds them from the start of the run; every other
 *  source is a skill's id */
export const HERO_SOURCES: ReadonlySet<SourceId> = new Set<SourceId>(["attacks", "abilities", "ultimate"]);

/** the icon of each hero's own sources on the end of run screen, by hero id; the ultimate shows the learned one's own icon when there is one */
export const HERO_SOURCE_ICONS: Readonly<Record<string, Readonly<Record<HeroSource, string>>>> = {
  kael: { attacks: "kael_attacks", abilities: "kael_abilities", ultimate: "kael_ultimate" },
  ysra: { attacks: "y_heft", abilities: "r_flare", ultimate: "y_sunspear" },
  sable: { attacks: "sable_bolts", abilities: "sable_snare", ultimate: "sable_storm" },
  hulda: { attacks: "h_fists", abilities: "h_bellow", ultimate: "h_quake" },
  orrin: { attacks: "o_chain", abilities: "o_whirl", ultimate: "o_pendulum" },
  mirel: { attacks: "m_staff", abilities: "m_field", ultimate: "m_hour" },
  wenna: { attacks: "w_lamp", abilities: "w_wicks", ultimate: "w_great" },
  tallis: { attacks: "t_knives", abilities: "t_smoke", ultimate: "t_gloaming" },
  jory: { attacks: "j_mallets", abilities: "j_boom", ultimate: "j_drumroll" },
};
