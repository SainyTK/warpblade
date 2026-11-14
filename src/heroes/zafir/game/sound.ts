import { sfx } from "../../../services/audio";

/** Zafir's own sounds: the hiss of sand and the rush of wind */
export const sandSound = {
  /** a short hiss of sand: a spout rising, a mirage bursting */
  hiss: (vol = 0.12): void => sfx.noise(0.25, 2400, 900, vol, "bandpass", 1.4),
  /** a rushing gust: the ring turning up, the storm rising */
  gust: (vol = 0.1): void => sfx.noise(0.5, 500, 1400, vol, "bandpass", 0.8),
  /** the scimitar whirring through the air on a throw */
  whir: (): void => sfx.tone(520, 380, 0.18, "triangle", 0.04),
};
