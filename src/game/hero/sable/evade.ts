import { HERO_MOVE, STAMINA } from "../../../constants/combat";
import { BOLT } from "../../../constants/sable/bolt";
import { HOP, SLIDE } from "../../../constants/sable/moves";
import { sfx } from "../../../services/audio";
import { riseSpeed } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { enemyBox } from "../../enemies/enemy";
import { hasPerk } from "../../progress";
import { game, hero, progress } from "../../state";
import { boxHit, dust, heroBox, markStruck, newSwing, struckThisSwing } from "../../world";
import { isFree, setState, settle } from "../actions";
import { refuseDash } from "../stamina";
import { muzzle } from "./aim";
import { looseBolt } from "./loose";
import { sable } from "./memory";

/** nothing touches her early in a hop or a slide */
export function evadeGuarded(): boolean {
  const h = hero;
  return (h.state === "hop" && h.st < HOP.guard) || (h.state === "slide" && h.st < SLIDE.guard);
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

/** L: a hop back, still facing the foe, that looses a free bolt at the top; once on the floor and once in the air.
 *  With the side ahead held on the floor, a slide forward under blows instead. */
export function pressEvade(dir: number): boolean {
  const h = hero;
  if (!isFree() && !(h.state === "shoot" && sable.fired) && h.state !== "kick") return false;
  if (h.ground && dir && dir === h.face) return startSlide();
  if (!h.ground && sable.airHopped) return false;
  if (!pay(HOP.cost)) return true;
  sable.airHopped = !h.ground;
  sable.hopShot = false;
  sable.landed = false;
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
  const h = hero;
  if (!pay(SLIDE.cost)) return true;
  sable.landed = false;
  h.running = false;
  newSwing();
  setState("slide");
  dust(h.x, h.y, 4, -h.face);
  sfx.dodge();
  return true;
}

/** the hop's bolt, or Hop Volley's three, loosed level at the top of the hop */
function hopShot(): void {
  sable.hopShot = true;
  const m = muzzle("level");
  const angles = hasPerk("hopVolley") ? [-0.18, 0, 0.18] : [0];
  for (const a of angles) looseBolt({ ...m, angle: m.angle + a * hero.face, share: BOLT.hopShare, primed: false });
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
  h.vx = -h.face * HOP.speed;
  if (!h.ground) {
    h.st = Math.min(h.st, HOP.air);
    return;
  }
  sable.landed = true;
  h.st = HOP.land;
  dust(h.x, h.y, 4, h.face);
}

/** Slide Kick: foes she slides through are tripped */
function trip(): void {
  for (const e of game.enemies) {
    if (e.hp <= 0 || struckThisSwing(e) || !boxHit(heroBox(), enemyBox(e))) continue;
    markStruck(e);
    dealDamage(e, progress.stats.ad * SLIDE.tripPower, { fromX: hero.x, kx: 0, ky: -40, stun: SLIDE.trip });
  }
}

/** low along the floor at one speed, then she rises out of it */
export function runSlide(): void {
  const h = hero;
  if (h.st < SLIDE.time) {
    h.vx = h.face * SLIDE.speed;
    if (Math.floor(h.st * 30) % 3 === 0) dust(h.x - h.face * 4, h.y, 1, -h.face);
    if (hasPerk("slideKick")) trip();
    return;
  }
  if (h.st >= SLIDE.time + SLIDE.recover) settle();
}

/** the hop flies and the slide glides under her own speed */
export const evadeDrives = (): boolean =>
  (hero.state === "hop" && !sable.landed) || (hero.state === "slide" && hero.st < SLIDE.time);
