import { HERO_COLORS as HC, PAL } from "../../../constants/palette";
import { LAMP_BLOWS } from "../../../constants/wenna/lamp";
import { LAMP_POLE, LANTERN } from "../../../constants/wenna/lantern";
import { glow, place, px } from "../../../engine/frame";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import type { Point } from "../../../types/world";
import { clamp, lerp } from "../../../utils/math";
import { bladeAngle, isMirrored } from "../../../utils/poseFrame";
import { objectMemory, rememberPerSeat } from "../../seatMemory";
import { game, hero, lights } from "../../state";
import { skin } from "../skin";
import { paintLantern } from "./lanternLook";
import { wenna } from "./memory";

/** from the hook's end to the lantern's middle: the chain, the ring and half the lantern */
const ARM = LANTERN.chain + 1 + LANTERN.size / 2;
/** the swing is stepped no coarser than this, seconds */
const STEP = 1 / 120;
/** a gap in game time longer than this (a new run, the menus) starts the swing over */
const STALE = 0.25;

/**
 * The lantern's swing, one per player: the angle out from hanging straight down (positive toward +x) and its speed,
 * and the hook's last place and speed, measured from frame to frame.
 */
const swing = {
  a: 0,
  w: 0,
  x: Number.NaN,
  y: Number.NaN,
  vx: 0,
  vy: 0,
  t: Number.NaN,
  /** the Flare under way has thrown its flash of light */
  flashed: false,
};
rememberPerSeat(objectMemory(swing, true));

/** where the pole's hook ends, in the pose's local pixels from the feet, given the hand as drawn */
export function hookPoint(p: Pose, hand: readonly [number, number]): Point {
  const a = bladeAngle(p);
  const d = skin.reach + LAMP_POLE.end;
  const w = LAMP_POLE.across * (isMirrored(p) ? -1 : 1);
  return { x: hand[0] + Math.cos(a) * d - Math.sin(a) * w, y: hand[1] + Math.sin(a) * d + Math.cos(a) * w };
}

/** the hook's end in the world, from her pose and hand as last drawn */
function hookInWorld(h: Hero): Point {
  const at = hookPoint(h.pose, h.hand);
  return { x: h.x + at.x * h.face, y: h.y + at.y };
}

const limit = (v: number, most: number): number => clamp(v, -most, most);

/** start the swing over, hanging still from the hook where it is now */
function settle(at: Point): void {
  swing.a = 0;
  swing.w = 0;
  swing.vx = 0;
  swing.vy = 0;
  swing.x = at.x;
  swing.y = at.y;
  swing.t = game.t;
}

/**
 * Step the pendulum by the game time since the last frame, driven by how the hook moved: the lantern lags each snap
 * of the pole, swings on past it when the pole stops, and dies away to hanging still. Frozen while the game time
 * stands (hit-stop, pause).
 */
function step(at: Point): void {
  const dt = game.t - swing.t;
  const jumped = Math.hypot(at.x - swing.x, at.y - swing.y) > LANTERN.jump;
  if (!(dt >= 0 && dt <= STALE) || jumped) return settle(at);
  if (dt === 0) return;
  const vx = limit((at.x - swing.x) / dt, LANTERN.speed);
  const vy = limit((at.y - swing.y) / dt, LANTERN.speed);
  const ax = limit((vx - swing.vx) / dt, LANTERN.accel);
  const ay = limit((vy - swing.vy) / dt, LANTERN.accel);
  const n = Math.max(1, Math.ceil(dt / STEP));
  const h = dt / n;
  for (let i = 0; i < n; i++) {
    const pull = (-ax * Math.cos(swing.a) - (LANTERN.gravity - ay) * Math.sin(swing.a)) / ARM;
    swing.w += (pull - LANTERN.damping * swing.w) * h;
    swing.a = limit(swing.a + swing.w * h, LANTERN.reach);
  }
  swing.vx = vx;
  swing.vy = vy;
  swing.x = at.x;
  swing.y = at.y;
  swing.t = game.t;
}

/** seconds the Flare's shutter has been open, or -1 while it is shut */
function flareOpen(h: Hero): number {
  if (h.state !== "lamp" || wenna.current !== "flare") return -1;
  return h.st >= LAMP_BLOWS.flare.hit ? h.st - LAMP_BLOWS.flare.hit : -1;
}

/** how bright the lantern burns, 0 at rest to 1 with the shutter open: a Flare, gathering U, the ultimates going up */
function brightness(h: Hero): number {
  const open = flareOpen(h);
  if (open >= 0) {
    const shut = LAMP_BLOWS.flare.dur - LAMP_BLOWS.flare.hit - LANTERN.open / 30;
    return open < LANTERN.open / 30 ? 1 : clamp(1 - (open - LANTERN.open / 30) / Math.max(shut, 1e-3));
  }
  if (h.state === "charge") return clamp(LANTERN.charge + LANTERN.chargeLevel * h.chargeLevel);
  if (h.state === "greatWick" || h.state === "thousand") return LANTERN.roar;
  return 0;
}

/** the chain from the hook down to the lantern's ring: dark iron links with no gap, however far a swing stretches it */
function drawChain(from: Point, to: Point): void {
  const steps = Math.max(LANTERN.chain, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y)));
  for (let k = 0; k < steps; k++) {
    const u = (k + 0.5) / steps;
    px(
      Math.round(lerp(from.x, to.x, u) - 0.5),
      Math.round(lerp(from.y, to.y, u) - 0.5),
      k % 2 ? HC.bladeDeep : HC.bladeBack,
    );
  }
}

/**
 * Her lantern, in the world over her: a small square lantern swinging on its chain from the pole's hook, a violet flame
 * flickering inside, and the light it throws, brighter while a Flare's shutter is open and while she gathers U. The
 * Flare's opening throws a flash of light that falls away. The lantern never hangs below the floor she stands on.
 */
export function drawLantern(): void {
  const h = hero;
  place();
  const at = hookInWorld(h);
  step(at);
  const cx = at.x + Math.sin(swing.a) * ARM;
  const floor = h.ground ? h.y - LANTERN.size / 2 - 1 : Number.POSITIVE_INFINITY;
  const cy = Math.min(at.y + Math.cos(swing.a) * ARM, floor);
  const left = Math.round(cx - LANTERN.size / 2);
  const top = Math.round(cy - LANTERN.size / 2);
  drawChain(at, { x: left + 2.5, y: top - 1 });
  const bright = brightness(h);
  const flicker = Math.floor(game.t * 12);
  paintLantern((x, y, c) => px(x, y, c), left, top, bright, flicker);
  const r = lerp(LANTERN.light.r, LANTERN.flare.r, bright);
  const k = lerp(LANTERN.light.k, LANTERN.flare.k, bright) * (0.92 + 0.08 * Math.sin(game.t * 23));
  glow(left + 2.5, top + 2.5, r, PAL.wick[3], k);
  const open = flareOpen(h);
  if (open < 0) swing.flashed = false;
  else if (!swing.flashed) {
    swing.flashed = true;
    const { r: fr, k: fk, life } = LANTERN.flash;
    lights.add(left + 2.5, top + 2.5, fr, PAL.wick[4], fk, life);
  }
}
