import { sfx } from "../../../services/audio";

/** Calder's own sounds, built from the shared tone and noise */
export const calderSound = {
  /** a round goes off: a sharp crack over a low thump, deeper for a heavy round */
  shot(heavy = false): void {
    sfx.noise(heavy ? 0.28 : 0.16, 4200, heavy ? 180 : 400, heavy ? 0.26 : 0.2, "lowpass", 0.8);
    sfx.tone(heavy ? 120 : 170, 45, heavy ? 0.2 : 0.12, "square", 0.07);
  },
  /** the hammer falls on an empty chamber */
  click(): void {
    sfx.tone(2600, 2200, 0.03, "square", 0.04);
  },
  /** the cylinder swings out */
  open(): void {
    sfx.tone(900, 1300, 0.05, "triangle", 0.05);
  },
  /** rounds slide in */
  load(): void {
    sfx.tone(1600, 1500, 0.025, "square", 0.025);
  },
  /** the cylinder snaps shut; a quick reload rings brighter */
  shut(quick: boolean): void {
    sfx.tone(quick ? 2000 : 1300, quick ? 2600 : 900, 0.06, "square", 0.05);
    if (quick) sfx.chime(3);
  },
};
