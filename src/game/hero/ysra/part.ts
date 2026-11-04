/** one owner's share of Ysra's kit; the kit asks every part in turn */
export interface YsraPart {
  tick?(dt: number): void;
  /** true when this part ran the hero's current state */
  runState?(dt: number): boolean;
  drivesMotion?(): boolean;
  /** gravity multiplier this part wants now, or null to leave it */
  gravity?(): number | null;
  /** damage multiplier this part applies */
  hurtScale?(): number;
  /** true when this part took the blow */
  absorbHurt?(dmg: number, fromX: number): boolean;
  reset?(): void;
}
