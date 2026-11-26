import type { Settings } from "../types/settings";
import { clamp } from "./math";

/** saved options over the defaults, keeping only values of the right type, so an old or edited save cannot break a run */
export function mergeSettings(
  defaults: Settings,
  saved: Partial<Record<keyof Settings, unknown>>,
  steps: number,
): Settings {
  const flag = (key: "sound" | "shake" | "damageNumbers" | "vibration"): boolean =>
    typeof saved[key] === "boolean" ? saved[key] : defaults[key];
  const level = (key: "volume" | "music"): number => {
    const value = saved[key];
    return typeof value === "number" ? Math.round(clamp(value, 0, steps)) : defaults[key];
  };
  return {
    sound: flag("sound"),
    volume: level("volume"),
    music: level("music"),
    shake: flag("shake"),
    damageNumbers: flag("damageNumbers"),
    vibration: flag("vibration"),
  };
}
