import { sfx } from "../../../services/audio";

/** Vesper's own sounds, made of the shared tone and noise */
export const vesperSound = {
  /** a thin ring of steel: the short blade's echo cut */
  echo: (): void => {
    sfx.tone(1900, 2400, 0.07, "triangle", 0.035);
  },
  /** a rising chime of two notes: Tempo reached the top */
  top: (): void => {
    sfx.tone(880, 1320, 0.12, "triangle", 0.05);
    sfx.tone(1320, 1760, 0.14, "triangle", 0.04, 0.07);
  },
  /** a soft hiss of air: a dart of the stitch or the waltz */
  dart: (): void => {
    sfx.noise(0.08, 2600, 5200, 0.06, "highpass");
  },
  /** the two blades scraping apart: the parry turning a blow aside */
  turn: (): void => {
    sfx.noise(0.12, 3200, 1800, 0.1);
    sfx.tone(1500, 900, 0.1, "square", 0.025);
  },
};
