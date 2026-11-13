/** the keys the harness presses, by what they do; the game's own map is src/constants/input.ts */
export const KEYS = {
  left: "KeyA",
  right: "KeyD",
  up: "KeyW",
  down: "KeyS",
  attack: "KeyJ",
  /** guard, and a parry when pressed just as a blow lands */
  guard: "KeyK",
  /** the front dodge */
  dodge: "KeyL",
  /** the selected spell, or a hero's rite */
  spell: "KeyI",
  ultimate: "KeyU",
  cycle: "KeyO",
  pause: "Escape",
  select: "KeyJ",
  back: "Escape",
} as const;
/** every key a hero acts with during play, for the smoke test */
export const ACTION_KEYS = [
  KEYS.up,
  KEYS.attack,
  KEYS.guard,
  KEYS.dodge,
  KEYS.spell,
  KEYS.ultimate,
  KEYS.cycle,
] as const;
/** HUD tabs that are not abilities on I: the warp, used by holding J */
export const MOVE_TABS: readonly string[] = ["warpTab"];
