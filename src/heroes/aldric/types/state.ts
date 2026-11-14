declare module "../../../types/hero" {
  interface KitStates {
    aldric: "rush" | "call";
  }
}

/** what Aldric casts with I: his two base abilities and the three spells his skills teach */
export type AldricAbility = "rush" | "pillar" | "lance" | "mend" | "rally";

/** what Aldric's kit remembers between presses; each co-op seat keeps its own */
export interface AldricState {
  /** Valor, 0 to `VALOR.most`, and seconds left of Radiance */
  valor: number;
  radiance: number;
  /** seconds into the Guard bash under way, below 0 when none; seconds before the next; whether it is a Counterbash */
  bashT: number;
  bashCd: number;
  counter: boolean;
  /** seconds since the guard last blocked a blow */
  sinceBlock: number;
  /** seconds left of Bulwark after a warp arrival, and how many blows it still takes */
  barrier: number;
  barrierBlows: number;
  /** seconds before each ability comes back, and the length of each one's current wait */
  cd: Record<AldricAbility, number>;
  cdFull: Record<AldricAbility, number>;
  /** the ability under way, its wide form, its power, and whether it already went off */
  castAbility: AldricAbility;
  castWide: boolean;
  castPower: number;
  /** ground the guard walk has covered, for its steps */
  guardStride: number;
  /** a wave of Radiance already flew for this move */
  waved: boolean;
  /** seconds left of Rallying Cry's quicker blows */
  rally: number;
  /** seconds left of Mending Light's healing over time */
  mending: number;
  /** the dome of Sanctuary: where it stands, its radius and seconds left */
  domeX: number;
  domeR: number;
  domeLeft: number;
}
