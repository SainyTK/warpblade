import { HERO_MOVE } from "../../../constants/combat";
import { AFTERSHOCK_SUPLEX, HOLD, KNEE, THROWS } from "../../../constants/hulda/grab";
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
import { hasPerk } from "../../progress";
import { game, hero, progress } from "../../state";
import { hitStop, markStruck, newSwing, shake, struckThisSwing } from "../../world";
import { setState, settle } from "../actions";
import { skin } from "../skin";
import { unclaim } from "./claims";
import { gainGrit } from "./grit";
import { holdTime, pin } from "./hold";
import { hulda } from "./memory";
import { slamRing } from "./slam";

/** the throw the held keys ask for: Up tosses it up, Down swings it with Giant Swing, the side behind suplexes */
function throwFor(dir: number): ThrowKind {
  if (isHeld("up")) return "up";
  if (isHeld("down") && hasPerk("giantSwing")) return "swing";
  if (dir && dir === -hero.face) return "suplex";
  return "forward";
}

function startThrow(kind: ThrowKind): void {
  hulda.throwKind = kind;
  hulda.struck = false;
  hero.vx = 0;
  newSwing();
  setState("toss");
  sfx.swing(kind === "suplex" ? 0.6 : 0.8);
}

/** K while holding: throw the foe the way the keys ask */
export function pressThrow(dir: number): boolean {
  if (!hulda.held || (hero.state !== "hold" && hero.state !== "knee")) return false;
  startThrow(throwFor(dir));
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
  h.vx = h.ground ? dir * HERO_MOVE.walkSpeed * HOLD.walk * progress.stats.move : h.vx;
  h.runPhase = (h.runPhase + (dt * Math.abs(h.vx)) / HULDA_STRIDE) % 1;
  pin(e);
  if (h.state === "hold" && hulda.holdT >= holdTime()) startThrow("forward");
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
    const power = hasPerk("ironGrip") ? KNEE.gripPower : KNEE.power;
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

/** the foe leaves her hands; the hold is over */
function release(): Enemy | null {
  const e = hulda.held;
  hulda.held = null;
  if (e) unclaim(e);
  return e && e.hp > 0 ? e : null;
}

/** the foe flies ahead as a body that strikes whatever it meets */
function hurl(e: Enemy): void {
  const f = THROWS.forward;
  dealDamage(e, progress.stats.ad * f.power, { fromX: hero.x, kx: 0, heavy: true });
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
    pin(e, HOLD.ahead - (hero.st / f.release) * 12, (hero.st / f.release) * 4);
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
  const aftershock = hasPerk("aftershockSuplex");
  body.x = hero.x - hero.face * s.behind;
  body.y = kindOf(body.type).flies ? hero.y - 8 : hero.y;
  body.vx = 0;
  body.vy = 0;
  dealDamage(body, progress.stats.ad * s.power, { fromX: hero.x, kx: 0, stun: s.stun, heavy: true });
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
}

/** the sky toss: heaved straight up for the string and the hammer fist to catch */
function runUp(e: Enemy): void {
  const u = THROWS.up;
  if (hero.st < u.release) {
    pin(e, HOLD.ahead - 2, (hero.st / u.release) * 10);
    return;
  }
  if (hulda.struck) return;
  hulda.struck = true;
  const body = release();
  if (!body) return;
  dealDamage(body, progress.stats.ad * u.power, { fromX: hero.x, kx: 0, launch: u.launch, heavy: true });
  hero.lastHit = body;
  gainGrit(GRIT.throw);
  sfx.swing(1.4);
}

/** Giant Swing: the foe whirls round her twice, striking every foe near each turn, then flies ahead */
function runSwing(e: Enemy, dt: number): void {
  const g = THROWS.swing;
  const st = hero.st;
  if (st < g.release) {
    const u = st / g.release;
    const a = u * Math.PI * 2 * g.turns;
    // each turn is a new swing, so a foe near her is struck once per turn
    if (Math.floor(u * g.turns) !== Math.floor(((st - dt) / g.release) * g.turns)) newSwing();
    pin(e, Math.cos(a) * 16, 6);
    for (const o of game.enemies) {
      if (o === e || o.hp <= 0 || struckThisSwing(o)) continue;
      if (Math.abs(enemyCenter(o)[0] - e.x) > g.reach / 2 || Math.abs(o.x - hero.x) > g.reach) continue;
      markStruck(o);
      dealDamage(o, progress.stats.ad * g.power, {
        fromX: hero.x,
        kx: Math.sign(o.x - hero.x) * 160,
        stun: 0.4,
        heavy: true,
      });
      sfx.hit(false, 0.8);
    }
    return;
  }
  if (hulda.struck) return;
  hulda.struck = true;
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
    else if (kind === "up") runUp(e);
    else runSwing(e, dt);
  }
  if (hero.st >= THROWS[kind].dur) settle();
}
