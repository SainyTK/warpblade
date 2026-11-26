import { ACTION_CLIPS } from "../../constants/clips";
import { WARP } from "../../constants/combat";
import { enemyCenter } from "../../game/enemies/enemy";
import { clampHeroX, landingAt, safeHeroDestination } from "../../game/hero/terrain";
import { emitSkillEvent } from "../../game/skills/events";
import { withBuild } from "../../game/skills/query";
import { game } from "../../game/state";
import { sfx } from "../../services/audio";
import type { ActiveWarp, Fighter, Session, WarpTarget } from "../../types/drill";
import { TARGET_RADIUS, WARP_TRACE_LIFE } from "../constants";
import { hitWithSword, spendSwordBonuses } from "./swordInfusion";

export function warpLocksActions(h: Fighter): boolean {
  return h.warp !== null && (h.warp.phase !== "arrival" || h.warp.age < WARP.cut);
}

function findTarget(session: Session): WarpTarget {
  const h = session.fighter;
  let reach: number = WARP.reach;
  let target: WarpTarget = { enemy: null, x: clampHeroX(h.x + h.face * WARP.fallback), y: h.y - 18 };
  for (const enemy of game.enemies) {
    const dx = enemy.x - h.x;
    const y = enemyCenter(enemy)[1];
    const distance = Math.hypot(dx, y - (h.y - 20));
    if (enemy.hp > 0 && dx * h.face >= -4 && distance < reach) {
      target = { enemy, x: enemy.x, y };
      reach = distance;
    }
  }
  return target;
}

export function startWarpStrike(session: Session): void {
  const h = session.fighter;
  const target = findTarget(session);
  if (Math.abs(target.x - h.x) > 2) {
    h.face = target.x < h.x ? -1 : 1;
  }
  h.warpReadyIn = withBuild("cooldown", WARP.cooldown * session.modifiers.warpCooldown);
  h.warp = { phase: "throw", age: 0, target };
  h.dashTime = 0;
  h.airDashActive = false;
  h.jumpBoost = false;
  h.guardAge = null;
  h.parryAge = null;
}

function arrive(session: Session, { target, weapon }: Extract<ActiveWarp, { phase: "flight" }>): void {
  const h = session.fighter;
  const ox = h.x;
  const oy = h.y;
  const enemy = target.enemy && target.enemy.hp > 0 ? target.enemy : null;
  if (enemy && enemy.x !== ox) {
    h.face = enemy.x < ox ? -1 : 1;
  }
  const destination = safeHeroDestination(enemy ? enemy.x - h.face * 13 : weapon.x, enemy ? enemy.y : weapon.y + 18);
  h.x = destination.x;
  h.y = destination.y;
  h.vx = 0;
  h.vy = 0;
  h.droppedPlatform = null;
  h.grounded = landingAt(h.x, h.y, h.y, 0, null) === h.y;
  if (h.grounded) {
    h.airDashes = 1 + session.modifiers.airDashes;
    h.airSlashes = 0;
  }
  sfx.warp();
  h.warp = { phase: "arrival", age: 0 };
  session.warpTrace = { from: [ox, oy], to: [h.x, h.y], face: h.face, life: WARP_TRACE_LIFE };
  const distance = Math.hypot(h.x - ox, h.y - oy);
  const damage = Math.round(
    session.profile.attack *
      session.modifiers.warpDamage *
      (WARP.power + Math.min(WARP.maxDistanceBonus, distance * WARP.powerPerPixel)),
  );
  let landed = false;
  for (const foe of game.enemies) {
    const dx = (foe.x - h.x) * h.face;
    const dy = enemyCenter(foe)[1] - h.y;
    if (
      dx >= -6 &&
      dx <= 30 + TARGET_RADIUS &&
      dy >= -40 &&
      dy <= 2 &&
      hitWithSword(session, foe, h.face, damage, false, false, true)
    ) {
      landed = true;
    }
  }
  session.releasedStrike = {
    x: h.x,
    y: h.y,
    face: h.face,
    kind: "warp",
    element: h.swordInfusion?.spell ?? null,
    landed,
  };
  session.profile.hooks?.slashed?.("warp", landed);
  emitSkillEvent({ type: "warp", x: h.x, y: h.y, foe: enemy?.hp ? enemy : null });
  if (landed) {
    spendSwordBonuses(h);
  }
}

function fly(session: Session, warp: Extract<ActiveWarp, { phase: "flight" }>, dt: number): void {
  const { target, weapon } = warp;
  if (target.enemy && target.enemy.hp > 0) {
    target.x = target.enemy.x;
    target.y = enemyCenter(target.enemy)[1];
  }
  const dx = target.x - weapon.x;
  const dy = target.y - weapon.y;
  const distance = Math.hypot(dx, dy);
  weapon.angle = Math.atan2(dy, dx);
  weapon.trail.push([weapon.x, weapon.y]);
  if (weapon.trail.length > 9) {
    weapon.trail.shift();
  }
  const step = WARP.speed * dt;
  if (distance <= step || warp.age >= WARP.maxFlight) {
    weapon.x = target.x;
    weapon.y = target.y;
    arrive(session, warp);
  } else {
    weapon.x += (dx / distance) * step;
    weapon.y += (dy / distance) * step;
  }
}

export function tickWarpStrike(session: Session, dt: number): void {
  const { fighter: h, warpTrace } = session;
  if (warpTrace) {
    warpTrace.life -= dt;
    if (warpTrace.life <= 0) {
      session.warpTrace = null;
    }
  }
  const warp = h.warp;
  if (!warp) {
    return;
  }
  warp.age += dt;
  switch (warp.phase) {
    case "throw":
      if (warp.age >= ACTION_CLIPS.throw.hit) {
        const x = h.x + h.face * 13;
        const y = h.y - 22;
        const angle = Math.atan2(warp.target.y - y, warp.target.x - x);
        h.warp = { phase: "flight", age: 0, target: warp.target, weapon: { x, y, angle, trail: [] } };
      }
      break;
    case "flight":
      fly(session, warp, dt);
      break;
    case "arrival":
      if (warp.age >= ACTION_CLIPS.warpStrike.dur) {
        h.warp = null;
      }
      break;
  }
}
