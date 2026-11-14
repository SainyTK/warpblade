/** Brynn's abilities on I: her two base abilities and the three her spell skills teach */
export type BrynnAbility = "rend" | "quake" | "arc" | "pillars" | "cry";
/** her base abilities, known from the first second */
export type BaseAbility = "rend" | "quake";
/** the abilities her spell skills teach */
export type SpellAbility = Exclude<BrynnAbility, BaseAbility>;
