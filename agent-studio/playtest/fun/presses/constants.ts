import type { PressAction } from "./types";

export const PRESSES_START = { stage: "prologue", section: 1, paint: "off" } as const;
export const PROBE_STEP_MS = 8;
export const KEY_HOLD_MS = 64;
export const EARLY_SECOND_MS = 100;
export const PAIR_WINDOW_MS = 1800;
export const SECOND_WINDOW_MS = 900;
export const RESPONSE_WINDOW_MS = 480;
export const SETTLE_MS = 2600;
export const REST_MS = 2500;
export const HOME_TOLERANCE = 6;
export const RESET_TRIES = 40;
export const RESET_STEP_MS = 60;
export const RESET_WAIT_MS = 100;
export const FACE_TAP_MS = 16;
export const MOVE_EPSILON = 0.25;
export const MP_SPEND_EPSILON = 1;
export const RAW_FILE = "presses.json";

export const ACTION_KEY: Readonly<Record<PressAction, string>> = {
  J: "KeyJ",
  K: "KeyK",
  L: "KeyL",
  I: "KeyI",
  U: "KeyU",
  jump: "KeyW",
};

export const PRESS_PAIRS: readonly (readonly [PressAction, PressAction])[] = [
  ["J", "J"],
  ["J", "K"],
  ["J", "L"],
  ["J", "I"],
  ["I", "U"],
  ["jump", "J"],
  ["L", "J"],
];

export const PRESS_TIMINGS = ["100ms", "after"] as const;
export const RESPONSE_ACTIONS: readonly PressAction[] = ["J", "K", "L", "I", "U", "jump"];
export const RESPONSE_PHASES: readonly number[] = [0];

export const MEASURE_PRESSES = "M1.1";
export const MEASURE_RESPONSE = "M1.2";

export const FIGHTER_MODULES = { drill: "/src/drill/index.ts", state: "/src/game/state.ts" } as const;
export const HERO_ATTEMPTS = 2;
