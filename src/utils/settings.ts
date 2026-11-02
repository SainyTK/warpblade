import type { Settings } from "../types/settings";
import { clamp } from "./math";

/** saved options over the defaults, keeping only values of the right type, so an old or edited save cannot break a run */
export function mergeSettings(
  defaults: Settings,
  saved: Partial<Record<keyof Settings, unknown>>,
  steps: number,
): Settings {
  const flag = (key: "sound" | "shake" | "damageNumbers"): boolean =>
    typeof saved[key] === "boolean" ? saved[key] : defaults[key];
  const volume = typeof saved.volume === "number" ? Math.round(clamp(saved.volume, 0, steps)) : defaults.volume;
  return { sound: flag("sound"), volume, shake: flag("shake"), damageNumbers: flag("damageNumbers") };
}
