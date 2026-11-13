import { HERO_MOVE, PERFECT } from "../../../constants/combat";
import { HOP, SLIDE } from "../../../constants/sable/moves";
import { sfx } from "../../../services/audio";
import { riseSpeed } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { enemyBox } from "../../enemies/enemy";
import { objectMemory, rememberPerSeat } from "../../seatMemory";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { boxHit, dust, heroBox, markStruck, newSwing, struckThisSwing } from "../../world";
import { setState, settle } from "../actions";
import { rewardPerfectDodge } from "../perfectDodge";
import { cutForSharedAction, maySharedAct } from "../sharedCut";
import { skin } from "../skin";
import { travelEnded } from "../travelEnd";
import { assisted, muzzle } from "./aim";
import { scatterCaltrops } from "./effects/caltrops";
import { jadeLight } from "./effects/jadeLight";
import { tangle } from "./effects/tangle";
import { looseBolt } from "./loose";
import { sable } from "./memory";
import { chargeBolts, loadBolts } from "./quiver";
import { kickKegs } from "./spells/keg";

/** the hop under way has left the floor */
const hop = { launched: false };
rememberPerSeat(objectMemory(hop));

/** how far a seeking hop bolt bends toward a foe, in radians */
const HOP_SEEK = 0.7;

/** nothing touches her early in a hop or a slide */
export function evadeGuarded(): boolean {
  const h = hero;
  return (h.state === "hop" && h.st < HOP.guard) || (h.state === "slide" && h.st < SLIDE.guard);
}

/** a blow met her in the first moments of a hop or a slide: a perfect dodge, once per evade */
export function evadeAbsorbs(): boolean {
  if (!evadeGuarded()) return false;
  if (hero.st <= PERFECT.window && !sable.perfectUsed) {
    sable.perfectUsed = true;
    rewardPerfectDodge();
    game.fx.push(createFloorRing(hero.x, hero.y, 28, skin.ramp, 0.4));
    jadeLight(hero.x, hero.y - 18, "burst");
    sfx.perfect();
  }
  return true;
}

/** hops she can hold ready: one, two with Hop Volley */
const hopCharges = (): number => skillValues("s_hopVolley").charges ?? 1;

/** seconds a spent hop takes to come back, shorter with Hop Volley and spell haste */
const hopRecharge = (): number => (skillValues("s_hopVolley").recharge ?? HOP.recharge) / progress.stats.haste;

/** seconds before a hop is ready, 0 while one is */
export const hopWait = (): number => (sable.hops > 0 ? 0 : sable.hopCd);

/** a hop comes back each time the recharge runs out, until all are back */
export function tickHop(step: number): void {
  const max = hopCharges();
  if (sable.hops > max) sable.hops = max;
  if (sable.hops >= max) return;
  sable.hopCd = Math.max(0, sable.hopCd - step);
  if (sable.hopCd > 0) return;
  sable.hops++;
  if (sable.hops < max) startHopRecharge();
}

function startHopRecharge(): void {
  sable.hopCd = hopRecharge();
  sable.hopFull = Math.max(0.01, sable.hopCd);
}

/** a hop comes back at once (a slide through a crowd with Slide Kick) */
function refundHop(): void {
  sable.hops = Math.min(hopCharges(), sable.hops + 1);
}

/**
 * I on the hop: a hop back, still facing the foe, that looses a free bolt at the top; held on the floor, a slide forward
 * under blows instead. Both spend a hop, which comes back on its own recharge.
 */
export function castHop(wide: boolean): boolean {
  const h = hero;
  if (!maySharedAct()) return false;
  cutForSharedAction();
  sable.hops--;
  if (sable.hopCd <= 0) startHopRecharge();
  h.running = false;
  if (wide && h.ground) return startSlide();
  Object.assign(sable, { hopShot: false, landed: false, perfectUsed: false, string: 0 });
  setState("hop");
  hop.launched = false;
  // from the air there is no floor to load against: she pushes off at once
  if (!h.ground) {
    h.st = HOP.load;
    pushOff();
  }
  return true;
}

/** the hop leaves the floor, or the air, backward */
function pushOff(): void {
  const h = hero;
  hop.launched = true;
  h.vy = Math.min(h.vy, -riseSpeed(HOP.rise, HERO_MOVE.gravity));
  if (h.ground) dust(h.x, h.y, 3, h.face);
  h.ground = false;
  sfx.dodge();
}

function startSlide(): boolean {
  Object.assign(sable, { landed: false, perfectUsed: false, string: 0, slid: 0 });
  hero.vx = 0;
  newSwing();
  setState("slide");
  sfx.dodge();
  return true;
}

/** the hop's bolt, or Hop Volley's primed fan (Wheeling Volley's ring), loosed at the top of the hop */
function hopShot(): void {
  sable.hopShot = true;
  const v = skillValues("s_hopVolley");
  const m = muzzle("level");
  const n = v.bolts ?? 1;
  const ring = !!v.ring;
  for (let i = 0; i < n; i++) {
    const off = ring ? (i / n) * Math.PI * 2 : (i - (n - 1) / 2) * 0.18;
    const aim = ring ? off : m.angle + off * hero.face;
    // Hop Volley level 3: each bolt bends toward the foe nearest its line, so the fan does not sail over short foes
    const angle = v.seek ? assisted(m.y, aim, hero.x, HOP_SEEK) : aim;
    looseBolt({ ...m, angle, share: 1, prime: v.bolts ? "charged" : null, hop: true });
  }
  emitSkillEvent({ type: "hop", x: hero.x, y: m.y, face: hero.face });
  sfx.swing(1.7);
}

/** the hop loads on the floor, then carries her back at one speed; the clip holds its air key until she lands, then
 *  the knees take it */
export function runHop(): void {
  const h = hero;
  if (sable.landed) {
    if (h.st >= HOP.land + HOP.recover) settle();
    return;
  }
  if (!hop.launched) {
    h.vx = 0;
    if (h.st < HOP.load) return;
    pushOff();
  }
  if (!sable.hopShot && h.st >= HOP.shot) hopShot();
  h.vx = -h.face * HOP.speed * progress.stats.move * (skillValues("s_hopVolley").carry ?? 1);
  if (!h.ground) {
    h.st = Math.min(h.st, HOP.air);
    return;
  }
  sable.landed = true;
  h.st = HOP.land;
  dust(h.x, h.y, 4, h.face);
  const caltrops = skillValues("s_hopVolley").caltrops;
  if (caltrops) scatterCaltrops(h.x, h.y, caltrops);
  travelEnded();
}

/** the slide sends kegs it meets flying, with Powder Keg's kick */
function slideKegs(): void {
  kickKegs(heroBox());
}

/** Slide Kick: foes she slides through are tripped and thrown up */
function trip(): void {
  const v = skillValues("s_slideKick");
  for (const e of game.enemies) {
    if (e.hp <= 0 || struckThisSwing(e) || !boxHit(heroBox(), enemyBox(e))) continue;
    markStruck(e);
    sable.slid++;
    dealDamage(e, progress.stats.ad * v.power, {
      fromX: hero.x,
      kx: 0,
      ky: -40,
      launch: v.launch ? -v.launch : undefined,
      stun: v.trip,
    });
    if (v.tangle) tangle(e, v.tangle);
  }
}

/** the slide ends: Slide Kick turns her to face the foes she passed, primes bolts and may give the hop back */
function rise(): void {
  const v = skillValues("s_slideKick");
  if (!sable.slid) return;
  if (v.turn) hero.face = -hero.face;
  if (v.charged) chargeBolts(v.charged);
  if (v.refund && sable.slid >= v.refund) {
    refundHop();
    loadBolts(3);
  }
}

/** seconds from the press to the end of the glide: the plant, then the glide, longer with Slide Kick */
export const slideEnd = (): number => SLIDE.load + (skillValues("s_slideKick").time ?? SLIDE.time);

/** she plants and drops, glides low along the floor at one speed, then rises out of it */
export function runSlide(): void {
  const h = hero;
  const time = slideEnd();
  if (h.st < SLIDE.load) {
    h.vx = 0;
    return;
  }
  if (h.st < time) {
    if (h.vx === 0) dust(h.x, h.y, 4, -h.face);
    h.vx = h.face * SLIDE.speed * progress.stats.move;
    if (Math.floor(h.st * 30) % 3 === 0) dust(h.x - h.face * 4, h.y, 1, -h.face);
    slideKegs();
    if (skillValues("s_slideKick").power) trip();
    return;
  }
  if (!sable.landed) {
    sable.landed = true;
    rise();
    travelEnded();
  }
  if (h.st >= time + SLIDE.recover) settle();
}

/** the hop flies and the slide glides under her own speed */
export const evadeDrives = (): boolean =>
  (hero.state === "hop" && !sable.landed) || (hero.state === "slide" && hero.st < slideEnd());
