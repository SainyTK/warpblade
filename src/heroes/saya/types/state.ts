import type { SayaAbility } from "./ability";

declare module "../../../types/hero" {
  interface KitStates {
    /** the parry's counter draw; Brushline's dash cut; Moonrise's rising draw; Silent Moon's stillness; Still Water */
    saya: "counter" | "line" | "rise" | "moon" | "still";
  }
}

/** what Saya's kit remembers between presses; each co-op seat keeps its own, and a guest's HUD reads it */
export interface SayaState {
  /** breaths of Focus held, and seconds the blade has rested toward the next one */
  breaths: number;
  rest: number;
  /** seconds left of the bar's flash after a breath was spent */
  spent: number;
  /** the draw under way spends a breath: it reaches farther and stores more */
  breathDraw: boolean;
  /** seconds before each ability can be cast again, and the full length of each one's current wait */
  cd: Record<SayaAbility, number>;
  cdFull: Record<SayaAbility, number>;
  /** the ability under way, and whether it is the wide form (I held) */
  casting: SayaAbility;
  wide: boolean;
  /** the state under way has struck its blow, made its dash or clicked the blade home */
  struck: boolean;
  clicked: boolean;
  /** where Brushline's dash began, so the wide form comes back to it */
  lineFrom: number;
  /** the current dash already earned a breath for a perfect dodge */
  perfectSeen: boolean;
  /** seconds Calm Mind holds after Focus drops from full */
  calmLeft: number;
  /** the counter draw under way came out of Still Water */
  stillCounter: boolean;
}
