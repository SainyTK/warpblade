import type { Settings } from "../types/settings";

/** the volume moves in this many steps */
export const VOLUME_STEPS = 10;

export const DEFAULT_SETTINGS: Settings = {
  sound: true,
  volume: 9,
  shake: true,
  damageNumbers: true,
};
