import { HOOK } from "../../../constants/orrin/hook";
import { SPARKS } from "../../../constants/palette";
import { ANCHORS, PLATFORMS } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { LatchKind } from "../../../types/orrin";
import { PK } from "../../../types/particle";
import type { Point } from "../../../types/world";
import { isHeld } from "../../input";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { touches } from "../../skills/targets";
import { game, hero, particles, rng } from "../../state";
import { isFree, setState } from "../actions";
import { refuseDash } from "../stamina";
import { giveArcBack } from "./airArc";
import { orrin, orrinHost } from "./memory";
import { inRecovery } from "./string";
import { startSwing } from "./swing";
import { startZip } from "./zip";

const PUMP = "o_pump";

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

/** the throw: two frames of wind-up, then the hook flies out link by link until it meets something or its range */
export function runHookThrow(dt: number): void {
  const h = hero;
  if (h.st < HOOK.windup) return;
  if (!orrin.flight) {
    const from = throwHand();
    const a = aimAngle();
    orrin.flight = { from, dx: Math.cos(a) * h.face, dy: Math.sin(a), flown: 0, range: hookRange() };
    sfx.rattle();
  }
  const f = orrin.flight;
  const end = Math.min(f.range, f.flown + HOOK.speed * dt);
  // the hook flies from where it left the hand, which keeps up with him as he falls
  const from = throwHand();
  while (f.flown < end) {
    f.flown = Math.min(end, f.flown + 3);
    const x = from.x + f.dx * f.flown;
    const y = from.y + f.dy * f.flown;
    const hit = meets(x, y);
    if (hit) return latch(hit.kind, hit.at, hit.foe);
  }
  orrin.flight = { ...f, from };
  if (f.flown >= f.range) latch("air", { x: from.x + f.dx * f.range, y: from.y + f.dy * f.range }, null);
}

/** the hook head right now while it flies, world pixels, for drawing */
export function hookHead(): Point | null {
  const f = orrin.flight;
  if (!f) return null;
  return { x: f.from.x + f.dx * f.flown, y: f.from.y + f.dy * f.flown };
}

/** a foe the zip holds on to, for drawing the chain taut */
export const zipTarget = (): Enemy | null => orrinHost.zipFoe;
