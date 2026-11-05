import { sfx } from "../../../services/audio";

/** a rite let loose: a low roar of flame, pitched per rite so each one is told apart by ear */
export function riteSound(pitch: number): void {
  sfx.noise(0.45, 1500 * pitch, 160 * pitch, 0.22, "lowpass", 0.8);
  sfx.tone(110 * pitch, 260 * pitch, 0.3, "sawtooth", 0.05);
}
/** a small hot crack: an ember from the brazier, a burst of Overheat */
export function crackle(pitch: number): void {
  sfx.noise(0.07, 4200 * pitch, 1400 * pitch, 0.06, "bandpass", 2);
}
