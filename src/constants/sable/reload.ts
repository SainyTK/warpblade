/**
 * The reload: an empty quiver starts it, so does J with Down held on the floor, and a J pressed inside the bright window
 * finishes it at once and primes the bolts. A J pressed before the window spends the try, and one after it jams the
 * crank and costs extra time; presses in the grace are the shots that emptied the quiver, and do nothing.
 */
export const RELOAD = {
  /** seconds a plain reload takes, cut by attack speed */
  dur: 1.05,
  /** the bright window, as parts of the reload's own length */
  window: [0.42, 0.62] as const,
  /** a J this early in the reload, as a part of its length, neither times it nor jams it */
  grace: 0.25,
  /** Down let go this many seconds before the J tap still counts as held, since a tap is read when J comes up */
  downGrace: 0.15,
  /** a jam adds this many seconds */
  jam: 0.45,
  /** a perfect reload primes this many bolts */
  primed: 4,
  /** seconds the HUD flashes after a perfect reload, a jam or an empty quiver */
  flash: 0.5,
} as const;
