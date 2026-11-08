import { HOOK } from "../../../constants/orrin/hook";
import { SPARKS } from "../../../constants/palette";
import { ANCHORS, PLATFORMS, W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { LatchKind } from "../../../types/orrin";
import { PK } from "../../../types/particle";
import type { Point } from "../../../types/world";
import { isHeld } from "../../input";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { touches } from "../../skills/targets";
import { game, hero, particles, progress, rng } from "../../state";
import { isFree, setState, settle } from "../actions";
import { refuseDash } from "../stamina";
import { giveArcBack } from "./airArc";
import { startClimb } from "./climb";
import { orrin, orrinHost } from "./memory";
import { inRecovery } from "./string";
import { startSwing, swingRoom } from "./swing";
import { startZip } from "./zip";

const PUMP = "o_pump";
/** the fastest he falls while a hook flies from the air */
const AIR_THROW_FALL = 60;
/** the hook bites the air this close to the stage's edges */
const EDGE = 4;

/** stamina a hook costs: Pendulum Pump trims it */
export const hookCost = (): number => HOOK.cost - (skillValues(PUMP).cost ?? 0);

/** how far the hook flies: Pendulum Pump stretches it */
export const hookRange = (): number => HOOK.range + (skillValues(PUMP).range ?? 0);

/** air hooks per airtime: two, three with Pendulum Pump */
export const hooksPerAir = (): number => HOOK.perAir + (skillValues(PUMP).hooks ?? 0);

/** Skyline: with half a bar of Momentum or more, air hooks are not counted */
const endlessHooks = (): boolean => (skillValues(PUMP).skyline ?? 0) > 0 && orrin.momentum >= 50;

/** where the chain leaves his hand as he throws, world pixels */
export const throwHand = (): Point => ({ x: hero.x + hero.face * 5, y: hero.y - 22 });

/** the aim, in radians facing right with up negative: steeper with Up held, low with Down held in the air */
function aimAngle(): number {
  const deg = isHeld("up") ? HOOK.aimUp : isHeld("down") && !hero.ground ? HOOK.aimLow : HOOK.aim;
  return (-deg * Math.PI) / 180;
}

/** K: throw the hook along the aim; in the air this spends one of the airtime's hooks */
export function pressHook(): boolean {
  const h = hero;
  const flying = h.state === "fly";
  if (!isFree() && !flying && !inRecovery()) return false;
  if (!h.ground && orrin.hooks <= 0 && !endlessHooks()) return false;
  if (h.stamina < hookCost()) {
    refuseDash();
    return true;
  }
  h.stamina -= hookCost();
  h.staminaWait = 0.5;
  if (!h.ground && !endlessHooks()) orrin.hooks--;
  orrin.flight = null;
  orrin.arc = -1;
  setState("hookThrow");
  return true;
}

/** a burst of brass sparks where the hook bites */
function biteSparks(at: Point): void {
  for (let i = 0; i < 8; i++) {
    const a = rng.range(0, Math.PI * 2);
    const sp = rng.range(60, 160);
    particles.spawn(PK.SPARK, at.x, at.y, Math.cos(a) * sp, Math.sin(a) * sp, rng.range(0.1, 0.22), {
      sparks: SPARKS.brass,
    });
  }
}

/** the hook bit: zip to a foe, or swing from a crystal, a platform or the air */
function latch(kind: LatchKind, at: Point, foe: Enemy | null): void {
  orrin.flight = null;
  biteSparks(at);
  sfx.clink();
  emitSkillEvent({ type: "latch", kind, foe });
  giveArcBack(false);
  if (kind === "anchor" || kind === "platform") orrin.hooks = Math.min(hooksPerAir(), orrin.hooks + 1);
  if (foe) return startZip(foe, at);
  if (kind === "platform" && swingRoom(at) < HOOK.minLength) return startClimb(at);
  startSwing(kind, at);
}

/** what the hook meets at a point of its flight: a foe, a crystal, a platform, or nothing */
function meets(x: number, y: number): { kind: LatchKind; at: Point; foe: Enemy | null } | null {
  for (const e of game.enemies) if (e.hp > 0 && touches(e, x, y, 2)) return { kind: "foe", at: { x, y }, foe: e };
  for (const a of ANCHORS)
    if (Math.hypot(a.x - x, a.y - y) <= HOOK.anchorCatch) return { kind: "anchor", at: { x: a.x, y: a.y }, foe: null };
  for (const p of PLATFORMS)
    if (x >= p.x0 - 1 && x <= p.x1 + 1 && y >= p.y && y <= p.y + 5)
      return { kind: "platform", at: { x: Math.min(p.x1, Math.max(p.x0, x)), y: p.y + 4 }, foe: null };
  return null;
}

/** the hook hit the stage's edge too close to swing from: the chain comes back, and the throw costs nothing */
function fallShort(): void {
  const h = hero;
  orrin.flight = null;
  h.stamina = Math.min(progress.stats.stamina, h.stamina + hookCost());
  if (!h.ground) orrin.hooks = Math.min(hooksPerAir(), orrin.hooks + 1);
  sfx.clink();
  settle();
}

/** the throw: two frames of wind-up, then the hook flies out link by link until it meets something or its range */
export function runHookThrow(dt: number): void {
  const h = hero;
  // in the air the throw hangs him: a fall is slowed to a drift while the hook flies
  if (!h.ground && h.vy > AIR_THROW_FALL) h.vy = AIR_THROW_FALL;
  if (h.st < HOOK.windup) return;
  if (!orrin.flight) {
    const from = throwHand();
    const a = aimAngle();
    orrin.flight = { from, dx: Math.cos(a) * h.face, dy: Math.sin(a), flown: 0, range: hookRange() };
    sfx.rattle();
  }
  const f = orrin.flight;
  const end = Math.min(f.range, f.flown + HOOK.speed * dt);
  // the hook flies along a fixed line in the world from where it left the hand, so a throw on the rise or the fall
  // goes where it was aimed; the chain is drawn from the hand to the head
  let flown = f.flown;
  while (flown < end) {
    flown = Math.min(end, flown + 3);
    const x = f.from.x + f.dx * flown;
    const y = f.from.y + f.dy * flown;
    const hit = meets(x, y);
    if (hit) return latch(hit.kind, hit.at, hit.foe);
    // the stage's edge stops the hook: it bites the air there, or falls short when that leaves too short a chain
    if (x <= EDGE || x >= W - EDGE || y <= EDGE)
      return flown < HOOK.minLength ? fallShort() : latch("air", { x, y }, null);
  }
  // replaced whole, never changed in place, so each co-op seat keeps its own
  orrin.flight = { ...f, flown };
  if (flown >= f.range) latch("air", { x: f.from.x + f.dx * f.range, y: f.from.y + f.dy * f.range }, null);
}

/** the hook head right now while it flies, world pixels, for drawing */
export function hookHead(): Point | null {
  const f = orrin.flight;
  if (!f) return null;
  return { x: f.from.x + f.dx * f.flown, y: f.from.y + f.dy * f.flown };
}

/** a foe the zip holds on to, for drawing the chain taut */
export const zipTarget = (): Enemy | null => orrinHost.zipFoe;
