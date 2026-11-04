/** the keys the harness presses, by what they do; the game's own map is src/constants/input.ts */
export const KEYS = {
  left: "KeyA",
  right: "KeyD",
  up: "KeyW",
  down: "KeyS",
  attack: "KeyJ",
  /** warp strike, or a hero's own move on K such as a vault */
  skill: "KeyK",
  /** dash, or a hero's own move on L such as a brace */
  defend: "KeyL",
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
  KEYS.skill,
  KEYS.defend,
  KEYS.spell,
  KEYS.ultimate,
  KEYS.cycle,
] as const;
/** HUD tabs that are not spells, and the key that uses each; any other tab in the row is a spell, cast with I */
export const HUD_TAB_KEYS: Readonly<Record<string, string>> = { warpTab: KEYS.skill };
