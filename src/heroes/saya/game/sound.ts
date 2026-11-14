import { sfx } from "../../../services/audio";

/** Saya's own sounds, from the shared tone and noise */
export const sayaSound = {
  /** the blade leaving the scabbard: a short bright scrape */
  draw(): void {
    sfx.noise(0.07, 6200, 2400, 0.09, "highpass");
  },
  /** the click of the guard meeting the scabbard's mouth */
  click(): void {
    sfx.tone(2400, 2100, 0.035, "square", 0.04);
    sfx.noise(0.04, 7000, 4000, 0.08, "highpass");
  },
  /** stored cuts bursting: a low tear with a ring over it */
  release(big: boolean): void {
    sfx.noise(big ? 0.3 : 0.2, 2400, 300, big ? 0.22 : 0.15, "bandpass", 0.9);
    sfx.tone(big ? 330 : 440, big ? 165 : 220, 0.18, "triangle", 0.06);
  },
  /** a breath of Focus filled */
  breath(): void {
    sfx.tone(780, 1170, 0.12, "sine", 0.03);
  },
};
