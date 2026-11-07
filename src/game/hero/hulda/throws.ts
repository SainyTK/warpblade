import { HERO_MOVE } from "../../../constants/combat";
import { AFTERSHOCK_SUPLEX, HOLD, KNEE, THROW_PICK, THROWS } from "../../../constants/hulda/grab";
import { GRIT } from "../../../constants/hulda/grit";
import { HULDA_STRIDE } from "../../../constants/hulda/motion";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { ThrowKind } from "../../../types/hulda";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { createThrownBody } from "../../effects/thrownBody";
import { enemyCenter } from "../../enemies/enemy";
import { kindOf } from "../../enemies/kinds";
import { isHeld } from "../../input";
import { emitSkillEvent } from "../../skills/events";
import { skillLevel, skillValues } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { hitStop, newSwing, shake } from "../../world";
import { setState, settle } from "../actions";
import { skin } from "../skin";
import { unclaim } from "./claims";
import { executing, spendCounterThrow, spendSuplex } from "./counter";
import { fracture, snapFractures, throwPower } from "./fracture";
import { gainGrit } from "./grit";
import { holdTime, pin } from "./hold";
import { holdWalk } from "./iron";
import { hulda } from "./memory";
import { slamRing } from "./slam";
import { spin, swingLength, swingRelease } from "./swing";

const SWING = "h_giantSwing";

/** foes standing, other than the held one, whose middle is within `ahead` pixels in front of her or `behind` behind */
function foesAround(held: Enemy, ahead: number, behind: number): { front: number; back: number; near: number } {
  let front = 0;
  let back = 0;
  let near = 0;
  for (const e of game.enemies) {
    if (e === held || e.hp <= 0) continue;
    const dx = (enemyCenter(e)[0] - hero.x) * hero.face;
    if (dx >= 0 && dx <= ahead) front++;
    if (dx < 0 && -dx <= behind) back++;
    if (Math.abs(dx) <= THROW_PICK.swing) near++;
  }
  return { front, back, near };
}

/**
 * The throw picks itself from where the foes stand: a Giant Swing when they crowd her and she has it, a forward throw
 * when foes stand ahead and fewer behind, otherwise a suplex, which is also the hardest throw on a lone foe.
 */
function throwFor(held: Enemy): ThrowKind {
  if (executing()) return "suplex";
  const { front, back, near } = foesAround(held, THROW_PICK.ahead, THROW_PICK.behind);
  if (skillLevel(SWING) && near >= skillValues(SWING).foes) return "swing";
  if (front > 0 && front > back) return "forward";
  return "suplex";
}

function startThrow(kind: ThrowKind): void {
  hulda.throwKind = kind;
  hulda.struck = false;
  hero.vx = 0;
  newSwing();
  setState("toss");
  sfx.swing(kind === "suplex" ? 0.6 : 0.8);
}

/** K while holding: the throw the crowd asks for */
export function pressThrow(): boolean {
  if (!hulda.held || (hero.state !== "hold" && hero.state !== "knee")) return false;
  startThrow(throwFor(hulda.held));
  return true;
}

/** J while holding: a knee into the held foe, up to three in a hold */
export function pressKnee(): boolean {
  if (!hulda.held || hero.state !== "hold" || hulda.knees >= KNEE.max) return false;
  hulda.knees++;
  hulda.struck = false;
  setState("knee");
  sfx.swing(1.2);
  return true;
}

/** she walks at half pace with the foe in her hands, still facing it, and throws it ahead once the hold runs out */
export function runHold(dt: number): void {
  const h = hero;
  const e = hulda.held;
  if (!e) return settle();
  hulda.holdT += dt;
  const dir = (isHeld("right") ? 1 : 0) - (isHeld("left") ? 1 : 0);
  h.vx = h.ground ? dir * HERO_MOVE.walkSpeed * holdWalk() * progress.stats.move : h.vx;
  h.runPhase = (h.runPhase + (dt * Math.abs(h.vx)) / HULDA_STRIDE) % 1;
  pin(e);
  if (h.state === "hold" && hulda.holdT >= holdTime()) startThrow(throwFor(e));
}

/** the knee lands on its frame, then she is back to holding */
export function runKnee(dt: number): void {
  const h = hero;
  const e = hulda.held;
  if (!e) return settle();
  hulda.holdT += dt;
  h.vx = 0;
  pin(e, HOLD.ahead - 1, h.st < KNEE.hit ? 1 : 3);
  if (!hulda.struck && h.st >= KNEE.hit) {
    hulda.struck = true;
    const power = skillLevel("h_fracture") ? skillValues("h_fracture").knee : KNEE.power;
    const [cx, cy] = enemyCenter(e);
    dealDamage(e, progress.stats.ad * power, { fromX: h.x, kx: 0, melee: true, heavy: true });
    h.lastHit = e;
    game.fx.push(createImpact(cx - h.face * 3, cy + 2, h.face, false));
    hitStop(0.04);
    shake(0.08, 1);
    sfx.hit(false, 0.9);
    gainGrit(GRIT.knee);
    if (e.hp <= 0) return;
  }
  if (h.st >= KNEE.dur) setState("hold");
}

/** the foe leaves her hands; the hold is over. Crushing Grip snaps full fractures (evolved) and leaves a fresh one */
function release(): Enemy | null {
  const e = hulda.held;
  hulda.held = null;
  if (!e) return null;
  unclaim(e);
  snapFractures(e);
  fracture(e);
  return e.hp > 0 ? e : null;
}

/** the foe flies ahead as a body that strikes whatever it meets */
function hurl(e: Enemy): void {
  const f = THROWS.forward;
  dealDamage(e, progress.stats.ad * throwPower(e, f.power) * spendCounterThrow(), {
    fromX: hero.x,
    kx: 0,
    heavy: true,
  });
  hero.lastHit = e;
  gainGrit(GRIT.throw);
  if (e.hp <= 0) return;
  Object.assign(e, {
    air: true,
    airTime: 0,
    airHits: 0,
    stun: 0,
    vx: hero.face * f.vx,
    vy: f.vy,
    state: "recover",
    st: 0,
  });
  game.fx.push(createThrownBody(e, hero.face, skin.ramp));
  shake(0.12, 1.5);
  sfx.hit(true, 0.8);
}

/** forward: the shoulders turn back with the foe, then it is let go ahead */
function runForward(e: Enemy): void {
  const f = THROWS.forward;
  if (hero.st < f.release) {
    pin(e, HOLD.ahead - (hero.st / f.release) * 5, (hero.st / f.release) * 5);
    return;
  }
  if (hulda.struck) return;
  hulda.struck = true;
  const body = release();
  if (body) hurl(body);
}

/** the suplex: lifted overhead, swung over her head in an arc and slammed into the floor behind her */
function runSuplex(e: Enemy): void {
  const s = THROWS.suplex;
  const st = hero.st;
  if (st < s.lift) {
    const u = st / s.lift;
    pin(e, HOLD.ahead - u * 6, u * 14);
    return;
  }
  if (st < s.slam) {
    const a = ((st - s.lift) / (s.slam - s.lift)) * Math.PI;
    pin(e, Math.cos(a) * s.behind, 14 + Math.sin(a) * 8);
    return;
  }
  if (hulda.struck) return;
  hulda.struck = true;
  const body = release();
  if (!body) return;
  const aftershock = skillValues("h_wreckingThrow").aftershock === 1;
  body.x = hero.x - hero.face * s.behind;
  body.y = kindOf(body.type).flies ? hero.y - 8 : hero.y;
  body.vx = 0;
  body.vy = 0;
  dealDamage(body, progress.stats.ad * throwPower(body, spendSuplex(s.power)), {
    fromX: hero.x,
    kx: 0,
    stun: s.stun,
    heavy: true,
  });
  hero.lastHit = body;
  gainGrit(GRIT.throw);
  game.fx.push(createImpact(body.x, hero.y - 6, -hero.face, true));
  slamRing({
    x: body.x,
    floor: hero.y,
    body,
    radius: s.ring * (aftershock ? AFTERSHOCK_SUPLEX.ring : 1),
    power: s.ringPower,
    stun: s.ringStun,
    launch: aftershock ? AFTERSHOCK_SUPLEX.launch : undefined,
    stop: s.stop,
    shake: s.shake,
  });
  emitSkillEvent({ type: "throw", foe: body, x: body.x, y: hero.y, slam: false });
}

/** Giant Swing: the spin, then the foe flies ahead; from level 7 the release knocks down the foes round her */
function runSwing(e: Enemy, dt: number): void {
  if (hero.st < swingRelease()) {
    spin(e, dt);
    return;
  }
  if (hulda.struck) return;
  hulda.struck = true;
  const v = skillValues(SWING);
  if (v.release > 0) {
    slamRing({
      x: hero.x,
      floor: hero.y,
      body: e,
      radius: THROWS.swing.knock,
      power: v.release,
      stun: THROWS.swing.knockStun,
      stop: 0.05,
      shake: [0.15, 2],
    });
  }
  const body = release();
  if (body) hurl(body);
}

/** the throw under way: the foe moves with her hands until it leaves them, then she recovers to her guard */
export function runToss(dt: number): void {
  const e = hulda.held;
  const kind = hulda.throwKind;
  if (e) {
    if (kind === "forward") runForward(e);
    else if (kind === "suplex") runSuplex(e);
    else runSwing(e, dt);
  }
  if (hero.st >= (kind === "swing" ? swingLength() : THROWS[kind].dur)) settle();
}
