import { MP_REGEN } from "../constants/combat";
import { setState } from "../game/hero/actions";
import { animateRopes } from "../game/hero/animate";
import { tickDenied } from "../game/hero/deny";
import { tickGuard } from "../game/hero/heroGuard";
import { regenStamina } from "../game/hero/stamina";
import { endRun } from "../game/runEnd";
import { emitSkillEvent } from "../game/skills/events";
import { hero, ponytail, progress, scarf } from "../game/state";
import { dust } from "../game/world";
import type { HeroState } from "../types/hero";
import { createDashEvents } from "./dashEvents";
import { readDrillInput } from "./input";
import { ageDrillCues, createSession, defend, type Fighter, type Session, stepSession } from "./simulation";
import { createDrillView } from "./view";

let session: Session | undefined;
let view: ReturnType<typeof createDrillView> | undefined;
let dashEvents = createDashEvents();

export function resetDrill(): void {
  session = undefined;
  view = undefined;
  dashEvents = createDashEvents();
}

export const drillFighter = (): Fighter | undefined => session?.fighter;
export const drillView = (): ReturnType<typeof createDrillView> | undefined => view;

export function ageFrozenDrill(dt: number): void {
  if (session) {
    ageDrillCues(session, dt);
  }
}

export function cancelDrillCharge(): void {
  if (session) {
    session.fighter.chargeHeldFor = null;
  }
}

export function defendWithDrill(): void {
  if (!session) {
    return;
  }
  const h = session.fighter;
  defend(session, h.face === 1 ? -1 : 1);
}

export function hurtDrill(fromX: number): void {
  if (!session) {
    return;
  }
  const h = session.fighter;
  h.guardAge = null;
  defend(session, fromX < h.x ? 1 : -1);
  Object.assign(h, { vx: hero.vx, vy: hero.vy, grounded: false, guardAge: null, enhancedGuard: 0 });
}

function stateOf(h: Fighter): HeroState {
  if (h.stun > 0) {
    return "hurt";
  }
  if (h.skillCast) {
    return "ultimate";
  }
  if (h.warp) {
    return h.warp.phase === "arrival" ? "warpStrike" : h.warp.phase === "throw" ? "throw" : "throwWait";
  }
  if (h.swing) {
    return "move";
  }
  if (h.dashTime > 0) {
    return "dash";
  }
  if (h.guardAge !== null || h.parryAge !== null) {
    return "guard";
  }
  if (h.spellRelease) {
    return "cast";
  }
  if (!h.grounded) {
    return h.vy < 0 ? "jump" : "fall";
  }
  return Math.abs(h.vx) > 15 ? "run" : "idle";
}

export function updateDrill(dt: number, worldDt: number): void {
  session ??= createSession(hero.x, hero.y);
  view ??= createDrillView();
  const h = session.fighter;
  h.x = hero.x;
  h.y = hero.y;
  hero.st += dt;
  if (hero.state === "dead") {
    if (hero.st >= 2.4) {
      endRun("fallen");
    }
    return;
  }
  hero.inv = Math.max(0, hero.inv - worldDt);
  hero.riposte = Math.max(0, hero.riposte - worldDt);
  hero.mp = Math.min(progress.stats.mp, hero.mp + MP_REGEN * worldDt);
  regenStamina(worldDt);
  tickGuard(worldDt);
  tickDenied(worldDt);
  const oldWarp = h.warp?.phase;
  const grounded = h.grounded;
  stepSession(session, readDrillInput(), dt);
  if (h.warp?.phase === "arrival" && oldWarp !== "arrival") {
    scarf.shift(h.x - hero.x, h.y - hero.y);
    ponytail.shift(h.x - hero.x, h.y - hero.y);
  }
  if (grounded && !h.grounded && h.vy < 0) {
    emitSkillEvent({ type: "jump", air: false });
  }
  const state = stateOf(h);
  if (state !== hero.state) {
    setState(state);
  }
  Object.assign(hero, {
    x: h.x,
    y: h.y,
    vx: h.vx,
    vy: h.vy,
    face: h.face,
    ground: h.grounded,
    running: state === "run",
    chain: h.swing?.kind === "third" ? 3 : h.swing?.kind === "second" ? 2 : h.swing?.kind === "first" ? 1 : 0,
    hasSword: h.warp?.phase !== "flight",
    warpCd: h.warpReadyIn,
    charge: h.chargeHeldFor ?? 0,
    droppedPlatform: h.droppedPlatform,
  });
  dashEvents(h);
  const motion = view.step(session, hero.pose, dt);
  hero.pose = motion.pose;
  if (motion.landForce > 0.55 || motion.groundDashStart) {
    dust(h.x, h.y, 4, -h.face);
  }
  animateRopes(dt);
}
