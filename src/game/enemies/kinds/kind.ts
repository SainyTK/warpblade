import type { Color } from "../../../types/color";
import type { Enemy, EnemyState } from "../../../types/enemy";
import type { SpriteImage } from "../../../types/sprite";
import type { Box } from "../../../types/world";

/**
 * Everything the game needs to know about one kind of foe besides its numbers in ENEMIES: how it moves, how it looks,
 * where it can be hit and how it comes through a rift. Each kind lives in its own file under kinds/.
 */
export interface EnemyKind {
  /** a flyer floats with (x, y) at its body center; a walker stands with (x, y) at its feet on the floor */
  flies: boolean;
  /** the box Kael's blows and spells hit, and that hurts Kael on contact where the kind does that */
  box(e: Enemy): Box;
  /** where hits, glows and lightning arcs aim */
  center(e: Enemy): [number, number];
  /** the state it starts in and goes back to after a stun */
  rest: EnemyState;
  /** seconds before its first attack */
  firstCooldown(): number;
  /** the rift it comes through: its height, the spawn height, and the rift's center height for that spawn */
  rift: { height: number; y(): number; riftY(y: number): number };
  /** one step of its own behavior, already slowed by status effects (ts is that slow, 0 to 1) */
  update(e: Enemy, dt: number, ts: number): void;
  /** its sprite this frame, with its feet (or center, for flyers) at the sprite's origin */
  draw(e: Enemy, t: number): SpriteImage;
  /** the soft glow around it and the eye flare while it winds up */
  glow: { radius: number; color: Color; eyeY: number };
  /** blocks frontal sword blows while in its rest state, from this wave on */
  guardFrom?: number;
  /** slips away from swings while in its rest state, like a wisp */
  evades?: boolean;
  /** MP orbs it drops, when not the rank's usual count */
  orbs?: number;
  /** chance of a heal orb, when not the usual 6% */
  heartChance?: number;
}
