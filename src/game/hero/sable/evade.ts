import { HERO_MOVE, PERFECT, STAMINA } from "../../../constants/combat";
import { HOP, SLIDE } from "../../../constants/sable/moves";
import { sfx } from "../../../services/audio";
import { riseSpeed } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { enemyBox } from "../../enemies/enemy";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { game, hero, lights, progress } from "../../state";
import { boxHit, dust, heroBox, markStruck, newSwing, struckThisSwing } from "../../world";
import { isFree, setState, settle } from "../actions";
import { rewardPerfectDodge } from "../perfectDodge";
import { skin } from "../skin";
import { refuseDash } from "../stamina";
import { travelEnded } from "../travelEnd";
import { assisted, muzzle } from "./aim";
import { scatterCaltrops } from "./effects/caltrops";
import { tangle } from "./effects/tangle";
import { looseBolt } from "./loose";
import { sable } from "./memory";
import { chargeBolts, loadBolts } from "./quiver";

/** how far a seeking hop bolt bends toward a foe, in radians */
const HOP_SEEK = 0.7;

/** nothing touches her early in a hop or a slide */
export function evadeGuarded(): boolean {
  const h = hero;
  return (h.state === "hop" && h.st < HOP.guard) || (h.state === "slide" && h.st < SLIDE.guard);
}

/** a blow met her in the first moments of a hop or a slide: a perfect dodge, once per evade; Shade Archer widens the
 *  moment */
export function evadeAbsorbs(): boolean {
  if (!evadeGuarded()) return false;
  const window = skillValues("s_shade").window ?? PERFECT.window;
  if (hero.st <= window && !sable.perfectUsed) {
    sable.perfectUsed = true;
    rewardPerfectDodge();
    game.fx.push(createFloorRing(hero.x, hero.y, 28, skin.ramp, 0.4));
    lights.add(hero.x, hero.y - 18, 50, skin.ramp[4], 0.7, 0.4);
    sfx.perfect();
  }
  return true;
}

/** pay stamina for a hop or a slide; false, with the bar flashing, when she cannot */
function pay(cost: number): boolean {
  const h = hero;
  if (h.stamina < cost) {
    refuseDash();
    return false;
  }
  h.stamina -= cost;
  h.staminaWait = STAMINA.delay;
  return true;
}

/** L: a hop back, still facing the foe, that looses a free bolt at the top; once on the floor and once in each airtime
 *  (twice with Hop Volley). From a walk or run toward the side she faces, a slide forward under blows instead. */
export function pressEvade(dir: number): boolean {
  const h = hero;
  if (!isFree() && !(h.state === "shoot" && sable.fired) && h.state !== "kick") return false;
  if (h.ground && isFree() && dir && dir === h.face) return startSlide();
  const v = skillValues("s_hopVolley");
  if (!h.ground && sable.airHops >= (v.airHops ?? 1)) return false;
  if (!pay(v.cost ?? HOP.cost)) return true;
  if (!h.ground) sable.airHops++;
  Object.assign(sable, { hopShot: false, landed: false, perfectUsed: false, string: 0 });
  h.running = false;
  h.vy = Math.min(h.vy, -riseSpeed(HOP.rise, HERO_MOVE.gravity));
  h.ground = false;
  h.cutShort = true;
  setState("hop");
  dust(h.x, h.y, 3, h.face);
  sfx.dodge();
  return true;
}

function startSlide(): boolean {
  const v = skillValues("s_slideKick");
  if (!pay(v.cost ?? SLIDE.cost)) return true;
  Object.assign(sable, { landed: false, perfectUsed: false, string: 0, slid: 0 });
  hero.running = false;
  newSwing();
  setState("slide");
  dust(hero.x, hero.y, 4, -hero.face);
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

/** the hop carries her back at one speed; the clip holds its air key until she lands, then the knees take it */
export function runHop(): void {
  const h = hero;
  if (sable.landed) {
    if (h.st >= HOP.land + HOP.recover) settle();
    return;
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

/** the slide ends: Slide Kick turns her to face the foes she passed, primes bolts and may refund itself */
function rise(): void {
  const v = skillValues("s_slideKick");
  if (!sable.slid) return;
  if (v.turn) hero.face = -hero.face;
  if (v.charged) chargeBolts(v.charged);
  if (v.refund && sable.slid >= v.refund) {
    hero.stamina = Math.min(progress.stats.stamina, hero.stamina + (v.cost ?? SLIDE.cost));
    loadBolts(3);
  }
}

/** low along the floor at one speed, then she rises out of it */
export function runSlide(): void {
  const h = hero;
  const time = skillValues("s_slideKick").time ?? SLIDE.time;
  if (h.st < time) {
    h.vx = h.face * SLIDE.speed * progress.stats.move;
    if (Math.floor(h.st * 30) % 3 === 0) dust(h.x - h.face * 4, h.y, 1, -h.face);
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
  (hero.state === "hop" && !sable.landed) ||
  (hero.state === "slide" && hero.st < (skillValues("s_slideKick").time ?? SLIDE.time));
