/** what Kael's kit remembers between presses for his skills; each co-op seat keeps its own */
export interface KaelState {
  /** Keen moves landed in a row, for Keen Edge's streak */
  keenStreak: number;
  /** Keen moves landed since the last gold cross cut, for Peerless Edge */
  keenCount: number;
  /** seconds left in which every move is Keen (Peerless Edge) */
  freeKeen: number;
  /** warps ready to throw (Warpcraft's charges) */
  warpCharges: number;
  /** seconds before Blink Step can blink again, once it has its own recharge */
  blinkCd: number;
  /** seconds left in which back attacks hit harder after a phase cut */
  phaseBack: number;
  /** the last phase cut was the evolved passage, so the finisher after it strikes every foe around */
  passage: boolean;
  /** seconds before Rift Walker can chain again */
  chainCd: number;
  /** seconds left of Endless Edges' storm round Kael */
  stormLeft: number;
  /** Keen blows landed in the storm since its last cut, each a volley more */
  stormVolleys: number;
}
