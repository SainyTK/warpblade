/** A live effect: update returns false once it has finished. drawBack draws what sits behind the characters. */
export interface Effect {
  update(dt: number): boolean;
  draw(): void;
  drawBack?(): void;
  /** an enemy spawn portal; waves wait for these */
  rift?: boolean;
}
/** The thrown sword. */
export interface Projectile {
  x: number;
  y: number;
  done: boolean;
  update(dt: number): void;
  draw(): void;
}
