import { MATERIAL_SOUND, RESONANCE_PITCH, SPELL_SOUND } from "../../constants/audio";
import type { HitMaterial } from "../../types/audio";
import type { ElementId } from "../../types/campaign";
import { audioGraph, startAudioGraph } from "./graph";
import { playSample as play } from "./samples";
import { noise, tone } from "./synth";

const HEAVY_SWING_PITCH = 0.9;
const CHARGE_STEP_RISE = 1.12;

let tap: MediaStreamAudioDestinationNode | null = null;

export const sfx = {
  start: startAudioGraph,
  tone,
  noise,
  outputStream(): MediaStream | null {
    const graph = audioGraph();
    if (!graph) return null;
    if (!tap) {
      tap = graph.ctx.createMediaStreamDestination();
      graph.master.connect(tap);
    }
    return tap.stream;
  },

  swing(pitch = 1): void {
    if (pitch < HEAVY_SWING_PITCH) {
      sfx.swingHeavy(pitch / HEAVY_SWING_PITCH);
      return;
    }
    if (!play("swing", { pitch })) noise(0.12, 2600 * pitch, 700 * pitch, 0.12);
  },
  swingHeavy(pitch = 1): void {
    if (!play("swingHeavy", { pitch })) noise(0.16, 2000 * pitch, 400 * pitch, 0.14);
  },
  hit(big = false, pitch = 1): void {
    if (play(big ? "hitHeavy" : "hitFlesh", { pitch })) return;
    tone((big ? 140 : 180) * pitch, 50 * pitch, big ? 0.16 : 0.09, "square", 0.08);
    noise(0.08, 1800 * pitch, 300 * pitch, 0.12, "lowpass");
  },
  strike(material: HitMaterial, heavy: boolean, crit: boolean): void {
    const landed = play(heavy && material === "flesh" ? "hitHeavy" : MATERIAL_SOUND[material], {
      pitch: heavy ? 0.92 : 1,
    });
    if (!landed) sfx.hit(heavy);
    if (crit) play("crit");
  },
  warp(): void {
    if (play("warp")) return;
    tone(500, 1700, 0.12, "sine", 0.07);
    tone(1700, 260, 0.22, "triangle", 0.05);
  },
  boom(): void {
    if (play("boom")) return;
    noise(0.6, 1200, 60, 0.32, "lowpass", 0.7);
    tone(90, 35, 0.35, "sine", 0.18);
  },
  chime(i = 0): void {
    if (!play("keen", { pitch: 1 + i * 0.11 })) tone(1400 + i * 160, 1300 + i * 160, 0.3, "triangle", 0.045);
  },
  shatter(): void {
    if (!play("shatter")) noise(0.25, 6000, 2000, 0.08, "highpass");
  },
  thunder(): void {
    if (play("thunder")) return;
    noise(0.08, 5000, 2500, 0.25, "highpass");
    noise(0.8, 900, 50, 0.3, "lowpass", 0.6);
  },
  pickup(): void {
    if (!play("pickup")) tone(900, 1500, 0.08, "sine", 0.04);
  },
  coin(): void {
    if (!play("coin")) tone(1900, 2600, 0.06, "square", 0.016);
  },
  hurt(): void {
    if (!play("hurt")) tone(240, 90, 0.2, "sawtooth", 0.07);
  },
  defeat(): void {
    play("defeat");
  },
  cast(): void {
    if (!play("cast")) tone(300, 900, 0.25, "triangle", 0.04);
  },
  spell(element: ElementId): void {
    if (!play(SPELL_SOUND[element])) sfx.cast();
  },
  resonance(element: ElementId): void {
    play("resonance", { pitch: RESONANCE_PITCH[element] });
  },
  denied(): void {
    if (!play("denied")) tone(180, 150, 0.05, "square", 0.03);
  },
  dodge(): void {
    if (!play("dash")) noise(0.18, 3000, 900, 0.08);
  },
  tired(): void {
    if (!play("tired")) noise(0.1, 500, 250, 0.05, "lowpass");
  },
  jump(): void {
    play("jump");
  },
  doubleJump(): void {
    if (!play("doubleJump")) tone(600, 1100, 0.1, "sine", 0.04);
  },
  land(): void {
    play("land");
  },
  lunge(): void {
    if (!play("lunge")) noise(0.15, 900, 300, 0.06);
  },
  death(): void {
    if (!play("foeDeath")) noise(0.4, 600, 80, 0.18, "lowpass");
  },
  block(): void {
    if (play("block")) return;
    tone(1300, 900, 0.07, "square", 0.05);
    noise(0.06, 5000, 3000, 0.07, "highpass");
  },
  parry(): void {
    if (play("parry")) return;
    sfx.block();
    sfx.perfect();
  },
  perfect(): void {
    if (!play("perfect")) tone(880, 1760, 0.25, "sine", 0.06);
  },
  evade(): void {
    if (!play("dash", { volume: 0.6, pitch: 1.15 })) noise(0.12, 2500, 1200, 0.05);
  },
  levelUp(): void {
    if (play("levelUp")) return;
    tone(660, 990, 0.12, "triangle", 0.05);
    tone(990, 1320, 0.25, "triangle", 0.045);
  },
  learn(): void {
    if (!play("learn")) tone(520, 1040, 0.18, "triangle", 0.05);
  },
  chargeStep(level: number): void {
    if (!play("chargeStep", { pitch: CHARGE_STEP_RISE ** (level - 1) }))
      tone(220 * 1.26 ** level, 260 * 1.26 ** level, 0.18, "sawtooth", 0.035);
  },
  ultimate(level: number): void {
    if (play("chargeRelease", { pitch: 1.1 - level * 0.05, volume: 0.8 + level * 0.1 })) return;
    noise(0.3 + level * 0.15, 3000, 200, 0.12 + level * 0.04, "lowpass", 0.8);
    tone(500, 1500 + level * 300, 0.2, "triangle", 0.06);
  },
  chest(): void {
    if (!play("chest")) sfx.levelUp();
  },
  bossRoar(): void {
    play("bossRoar");
  },
  bossDefeat(): void {
    if (!play("bossDefeat")) sfx.boom();
  },
  surge(): void {
    play("surge");
  },
  gate(): void {
    if (!play("gate")) sfx.levelUp();
  },
  stageClear(): void {
    if (!play("stageClear")) sfx.levelUp();
  },
  mapSelect(): void {
    if (!play("mapSelect")) sfx.learn();
  },
  menuMove(): void {
    play("menuMove");
  },
  menuConfirm(): void {
    play("menuConfirm");
  },
};
