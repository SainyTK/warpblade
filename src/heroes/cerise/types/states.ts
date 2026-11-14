/** Cerise's own states, which her kit runs: a riposte link, the Flurry, the Rose Line cast and Rose Tempest */
declare module "../../../types/hero" {
  interface KitStates {
    cerise: "riposte" | "flurry" | "lineCast" | "tempest";
  }
}

export {};
