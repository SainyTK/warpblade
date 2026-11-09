/** her lamp pole: the shaft behind the hand, and the iron hook at its top the lantern hangs from */
export const LAMP_POLE = {
  /** pixels of pole behind the hand */
  butt: 8,
  /** the hook leaves the pole's top this far along it, curls over this far ahead, and ends this far across */
  shank: 1.2,
  curl: 1.2,
  across: 3.4,
  /** the hook's end, where the lantern's chain hangs, this far past the pole's top */
  end: 0.5,
} as const;

/** the lantern on its chain: a pendulum that swings with her motion */
export const LANTERN = {
  /** pixels of chain, and the lantern's size */
  chain: 3,
  size: 5,
  /** pull down on the swing, and how fast a swing dies away, a second */
  gravity: 320,
  damping: 3.2,
  /** the hook moving further than this in one frame jumped (a Swap, a respawn) and the swing starts over */
  jump: 24,
  /** limits on the hook's measured speed and acceleration, so a hit frame's snap flings it hard but not wild */
  speed: 260,
  accel: 5000,
  /** the furthest the lantern swings out from hanging straight down, radians */
  reach: 1.9,
  /** the light round it: radius and strength at rest, and with the shutter open in a Flare */
  light: { r: 14, k: 0.22 },
  flare: { r: 30, k: 0.6 },
  /** how bright it burns while she gathers U, before the levels add to it, and with each level reached */
  charge: 0.45,
  chargeLevel: 0.12,
  /** how bright it roars while Great Wick or Thousand Candles goes up */
  roar: 0.85,
  /** the light it throws the moment the Flare opens: radius, strength and seconds */
  flash: { r: 28, k: 0.4, life: 0.18 },
  /** frames the shutter stays open after the Flare's hit frame before it starts to close */
  open: 4,
} as const;
