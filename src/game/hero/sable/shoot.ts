import { BOLT, SHOOT_TIMES, STRING } from "../../../constants/sable/bolt";
import { sfx } from "../../../services/audio";
import { PK } from "../../../types/particle";
import { isHeld } from "../../input";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { character, hero, lights, particles, progress, rng } from "../../state";
import { isFree, setState, settle } from "../actions";
import { skin } from "../skin";
import { assisted, autoAim, muzzle } from "./aim";
import type { Shot } from "./bolt/shot";
import { looseBolt } from "./loose";
import { sable } from "./memory";
import { drawBolt, flashQuiver } from "./quiver";
import { startReload } from "./reload";
import { kegInSights } from "./spells/keg";

/** a perfect reload's quickened shots (Perfect Rhythm) */
const haste = (): number => (sable.haste > 0 ? (skillValues("s_rhythm").haste ?? 0) : 0);

/** the shoot clip runs this much faster with attack speed, so the interval between shots follows it */
export const shootRate = (): number => (SHOOT_TIMES.dur / BOLT.interval) * progress.stats.aspd * (1 + haste());

/** bolts she may loose in one airtime: two, three with Featherdraw */
export const airLimit = (): number => skillValues("s_featherdraw").airLimit ?? STRING.air;

/** Skyhunter: J held in the air keeps her aloft for a while, and those shots do not count toward the air limit */
export const hovering = (): boolean => !hero.ground && sable.hover > 0 && isHeld("attack");

/** the air string still has a shot in it */
const airShotLeft = (): boolean => hero.ground || hovering() || sable.airShots < airLimit();

/** a bolt can be loosed now: she is free, or the last shot's recovery is under way, and the crossbow is cocked */
const canShoot = (): boolean =>
  (isFree() || (hero.state === "shoot" && sable.fired && hero.st >= SHOOT_TIMES.fire)) &&
  sable.cock <= 0 &&
  airShotLeft();

/** J: loose a bolt at the foe ahead; an empty quiver starts the reload instead */
export function pressShoot(): boolean {
  if (!canShoot()) return hero.state === "shoot";
  if (sable.reload) return true;
  if (sable.ammo <= 0) {
    flashQuiver("empty");
    return startReload();
  }
  sable.aim = autoAim();
  sable.fired = false;
  setState("shoot");
  return true;
}

/** a puff and a flash at the muzzle, and the string's snap */
function muzzleFlash(x: number, y: number, angle: number, primed: boolean): void {
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  lights.add(x, y, primed ? 20 : 12, primed ? skin.ramp[5] : skin.ramp[4], 0.7, 0.08);
  for (let i = 0; i < 3; i++)
    particles.spawn(PK.SMOKE, x, y, ux * rng.range(10, 30), uy * 10 - rng.range(4, 12), rng.range(0.25, 0.4), {
      size: rng.range(0.8, 1.3),
    });
  sfx.swing(primed ? 1.5 : 1.8);
}

/** side bolts beside this shot: Scattershot's fan, Featherdraw's Skyhunter fan, Hailfall's rain in the air */
function sideCount(shot: Shot): number {
  const v = skillValues("s_scatter");
  const fan = shot.air ? (skillValues("s_featherdraw").fan ?? 0) : 0;
  const air = shot.air ? (v.airSides ?? 0) : 0;
  return Math.max(shot.closing ? (v.sides ?? 0) : 0, v.every ?? 0, fan, air);
}

/** the fan around a shot; in the air with Hailfall it slants down below the aim */
function fan(shot: Shot): void {
  const n = sideCount(shot);
  if (!n) return;
  const v = skillValues("s_scatter");
  const share = v.share ?? 0.5;
  const rain = shot.air && !!v.airSides;
  for (let i = 1; i <= n; i++) {
    const step = Math.ceil(i / 2) * BOLT.fanSpread * (i % 2 ? 1 : -1);
    const off = rain ? Math.abs(step) * 1.6 * (hero.face > 0 ? 1 : -1) : step;
    const angle = shot.angle + off;
    looseBolt({
      ...shot,
      angle: v.bend ? assisted(shot.y, angle, hero.x, 0.25) : angle,
      share,
      prime: null,
      closing: false,
      side: true,
    });
  }
}

/** the bolt, and its fan, leave the crossbow; the closing bolt of a string ends it and the crossbow cocks */
function fire(): void {
  const drawn = drawBolt();
  if (!drawn) return;
  const air = !hero.ground;
  const length = air ? airLimit() : character.comboHits;
  const index = air ? sable.airShots : sable.string;
  const closing = !hovering() && index >= length - 1;
  hero.chain = index + 1;
  if (air) {
    if (!hovering()) sable.airShots++;
    const hang = skillValues("s_featherdraw").hang ?? 0;
    if (hang) hero.vy = Math.min(hero.vy, -hang * 160);
    else hero.vx -= hero.face * 25;
    if (closing) emitSkillEvent({ type: "airString", x: hero.x, y: hero.y });
  } else sable.string = closing ? 0 : sable.string + 1;
  if (closing) sable.cock = STRING.cock;
  const m = muzzle(sable.aim);
  // Powder Keg: with a foe at a keg ahead, the shot goes for the keg
  const keg = kegInSights(BOLT.range);
  if (keg) m.angle = Math.atan2(keg[1] - m.y, keg[0] - m.x);
  muzzleFlash(m.x, m.y, m.angle, drawn.prime !== null);
  const shot: Shot = { ...m, share: 1, prime: drawn.prime, closing, air };
  looseBolt(shot);
  fan(shot);
}

/** the shot leaves on its frame; J still held looses the next one once the clip has run and the crossbow is cocked */
export function runShoot(dt: number): void {
  const h = hero;
  h.st += dt * (shootRate() - 1);
  if (!sable.fired && h.st >= SHOOT_TIMES.fire) {
    sable.fired = true;
    fire();
  }
  if (h.st < SHOOT_TIMES.dur) return;
  if (sable.cock > 0 && isHeld("attack") && sable.ammo > 0) {
    h.st = SHOOT_TIMES.dur;
    return;
  }
  if (isHeld("attack") && sable.ammo > 0 && !sable.reload && airShotLeft()) {
    sable.aim = autoAim();
    sable.fired = false;
    setState("shoot");
    return;
  }
  sable.string = 0;
  settle();
  if (sable.ammo <= 0) startReload();
}
