import type { Enemy } from "../../../types/enemy";
import { clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game } from "../../state";
import { BLINK } from "./sprite";

/** how a Prism Sprite holds itself this frame */
export interface SpritePose {
  /** how much of it is there: it shrinks to a glint as it blinks out and grows back where it lands */
  presence: number;
  bob: number;
  /** how far the wing tips are lifted by the beat, in art pixels */
  flap: number;
  /** how far the wings are swept back and flattened, 0 to 1 */
  sweep: number;
  /** how far the wings hang, 0 to 1 */
  droop: number;
  /** the light it has gathered for a shot, 0 to 1 */
  gather: number;
  /** the white flash as the shot leaves, 1 to 0 */
  flash: number;
  awake: boolean;
}

const FLASH = 0.07;

export function spritePose(e: Enemy, time: number): SpritePose {
  const beat = Math.round(Math.sin(time * 22) * 3);
  const pose: SpritePose = {
    presence: 1,
    bob: Math.round(Math.sin(time * 3)),
    flap: beat,
    sweep: 0,
    droop: 0,
    gather: 0,
    flash: 0,
    awake: true,
  };
  if (e.stun > 0 || e.air) return { ...pose, bob: 0, flap: 0, droop: 1, awake: false };
  if (e.state === "blink")
    pose.presence = e.n === 0 ? 1 - clamp(e.st / BLINK.out) : clamp((e.st - BLINK.out) / (BLINK.back - BLINK.out));
  else if (e.state === "wind") {
    pose.gather = clamp(e.st / (0.55 * waveScale(game.wave).windup));
    // the wings stop beating and strain open, trembling harder as the light builds
    pose.flap = 3 + Math.round(Math.sin(time * 70) * pose.gather);
    pose.bob = 0;
  } else if (e.state === "shoot") {
    pose.flash = clamp(1 - e.st / FLASH);
    pose.sweep = clamp(1 - e.st / 0.25);
    pose.flap = 0;
    pose.bob = 0;
  }
  return pose;
}
