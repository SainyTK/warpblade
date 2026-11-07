import { ramp } from "../../utils/color";

/** the pale rose of her clan's spirits (Shield-Sister, Spirit Bear, Ancestor's Fist), deep to bright */
export const SPIRIT = ramp(["#1e1420", "#3c2836", "#6e4858", "#b07c8a", "#e6bcc4", "#fff0f0", "#ffffff"]);

/** several triggers within this many seconds call one summon */
export const SUMMON_GATE = 0.3;

/** a shield-sister: her charge speed, where she starts behind the hero, her shield's box and how she fades */
export const SISTER = {
  speed: 220,
  start: 10,
  /** a second sister of the same call starts this much further back */
  gap: 14,
  box: [-7, -26, 7, 0] as const,
  kick: 120,
  /** seconds she rests between charges while she stays */
  rest: 1,
  /** seconds she takes to fade in and out */
  fade: 0.15,
  /** Thundering Herd: sisters beside each rush start this far back and charge this far */
  herdBack: 60,
  herdLength: 140,
} as const;

/** the spirit bear: its fall, its reach when it mauls, how far its roar reaches, its pace and how it fades */
export const BEAR = {
  /** it appears this high over the landing and falls this fast */
  height: 70,
  fall: 360,
  reach: 24,
  /** reach of a single maul without the swipe */
  bite: 14,
  roar: 50,
  /** its walking pace */
  walk: 40,
  /** seconds the roar's ring takes */
  roarTime: 0.3,
  fade: 0.25,
} as const;

/** the ancestor's fist: how high it appears, how fast it falls, the thrown attacker's flight and its size against hers */
export const FIST = {
  height: 60,
  fall: 420,
  /** seconds it hangs over the foe before it falls */
  hang: 0.12,
  linger: 0.3,
  scale: 1,
  evolvedScale: 2,
  /** a second fist comes this long after the first */
  second: 0.3,
  throwVx: 300,
  throwVy: -140,
} as const;
