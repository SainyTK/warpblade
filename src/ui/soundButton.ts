import { sfx } from "../services/audio";
import { byId } from "./dom";

const button = byId<HTMLButtonElement>("sound");

export function toggleSound(): void {
  sfx.enabled = !sfx.enabled;
  button.textContent = sfx.enabled ? "SOUND ON" : "SOUND OFF";
}
export function bindSoundButton(): void {
  button.addEventListener("click", () => {
    sfx.start();
    toggleSound();
  });
}
