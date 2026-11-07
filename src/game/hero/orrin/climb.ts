import { ZIP } from "../../../constants/orrin/hook";
import { PLATFORMS } from "../../../constants/stage";
import type { Point } from "../../../types/world";
import { clamp } from "../../../utils/math";
import { hero } from "../../state";
import { setState } from "../actions";
import { travelEnded } from "../travelEnd";
import { orrin } from "./memory";

/** how far in from a platform's ends he lands after a ledge pull */
const INSET = 6;
/** he comes over the lip this far above the top and drops onto it */
const OVER = 3;

/** a platform the hook bit too close to the floor to swing under: the chain hauls him up and over its lip */
export function startClimb(at: Point): void {
  const p = PLATFORMS.find((q) => at.x >= q.x0 - 1 && at.x <= q.x1 + 1 && Math.abs(at.y - q.y) <= 6);
  if (!p) return;
  orrin.latch = "platform";
  orrin.latchAt = at;
  orrin.climbTo = { x: clamp(at.x, p.x0 + INSET, p.x1 - INSET), y: p.y - OVER };
  hero.ground = false;
  setState("zip");
}

/** the haul: straight to the lip at the zip's speed, then a short drop onto the platform */
export function runClimb(): void {
  const h = hero;
  const to = orrin.climbTo;
  if (!to) return;
  const dx = to.x - h.x;
  const dy = to.y - h.y;
  const d = Math.hypot(dx, dy);
  if (d < 4 || h.st > ZIP.most) return endClimb();
  if (Math.abs(dx) > 2) h.face = Math.sign(dx);
  h.vx = (dx / d) * ZIP.speed;
  h.vy = (dy / d) * ZIP.speed;
}

function endClimb(): void {
  const h = hero;
  orrin.climbTo = null;
  orrin.latch = null;
  orrin.latchAt = null;
  h.vx *= 0.15;
  h.vy = 30;
  orrin.flung = false;
  orrin.sinceRelease = 9;
  setState("fly");
  travelEnded();
}
