import { DEFAULT_SETTINGS, VOLUME_STEPS } from "../constants/settings";
import { sfx } from "../services/audio";
import { loadSettings, saveSettings } from "../services/settingsStorage";
import type { Settings } from "../types/settings";
import { mergeSettings } from "../utils/settings";

/** The one owner of the player's options. Every change is saved and applied here. */
export const settings: Settings = mergeSettings(DEFAULT_SETTINGS, loadSettings(), VOLUME_STEPS);
const listeners = new Set<() => void>();

function apply(): void {
  sfx.enabled = settings.sound;
  sfx.setVolume(settings.volume / VOLUME_STEPS);
}

export function setSetting<K extends keyof Settings>(key: K, value: Settings[K]): void {
  settings[key] = value;
  saveSettings(settings);
  apply();
  for (const listener of listeners) listener();
}
export function onSettingsChange(listener: () => void): void {
  listeners.add(listener);
}
export const toggleSound = (): void => setSetting("sound", !settings.sound);

apply();
