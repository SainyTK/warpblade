export type DefenseSide = "west" | "east" | "sky" | "below";

export interface CrystalWatch {
  share: number;
  low: boolean;
  struck: boolean;
  secondsLeft: number;
}
