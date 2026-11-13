import { BEATS, BOLT, COCK, STRING } from "../../../constants/sable/bolt";
import { RELOAD } from "../../../constants/sable/reload";
import { sfx } from "../../../services/audio";
import { PK } from "../../../types/particle";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { character, hero, particles, progress, rng } from "../../state";
import { isFree, setState, settle } from "../actions";
import { assisted, autoAim, muzzle } from "./aim";
import type { Shot } from "./bolt/shot";
import { jadeLight } from "./effects/jadeLight";
import { looseBolt } from "./loose";
import { bowString, sable } from "./memory";
import { drawBolt, flashQuiver } from "./quiver";
import { startReload, timeReload } from "./reload";
import { kegInSights } from "./spells/keg";

/** a perfect reload's quickened shots (Perfect Rhythm) */
const haste = (): number => (sable.haste > 0 ? (skillValues("s_rhythm").haste ?? 0) : 0);

/** the string's clips run this much faster with attack speed and a perfect reload's haste */
export const shootRate = (): number => progress.stats.aspd * (1 + haste());

/** the closing beat */
const LAST = BEATS.length - 1;

/** bolts she may loose in one airtime: two, three with Featherdraw */
export const airLimit = (): number => skillValues("s_featherdraw").airLimit ?? STRING.air;

/** Skyhunter: shooting in the air keeps her aloft for a while, and those shots do not count toward the air limit */
export const hovering = (): boolean => !hero.ground && sable.hover > 0 && hero.state === "shoot";

/** the air string still has a shot in it */
const airShotLeft = (): boolean => hero.ground || hovering() || sable.airShots < airLimit();

/** the beat the next bolt plays: the closing beat for the last bolt of a string, the first or second otherwise */
function nextBeat(): number {
  const air = !hero.ground;
  const length = air ? airLimit() : character.comboHits;
  const index = air ? sable.airShots : sable.string;
  if (!hovering() && index >= length - 1) return LAST;
  return Math.min(index, LAST - 1);
}

/** the next bolt of the string starts its draw, aimed at the foe ahead */
function startBolt(): void {
  sable.aim = autoAim();
  sable.fired = false;
  sable.cock = 0;
  Object.assign(bowString, { beat: nextBeat(), queued: false, link: 0 });
  setState("shoot");
}

/** Down held (or just let go) on the floor: J asks for a reload, from a free stance or during a shot */
const asksReload = (): boolean =>
  sable.sinceDown <= RELOAD.downGrace && hero.ground && (isFree() || hero.state === "shoot");

/** J tapped: the timing press while she reloads; with Down on the floor a reload; the next bolt of the string, asked
 *  for while one is under way or started when she is free; an empty quiver starts the reload instead */
export function pressShoot(): boolean {
  if (sable.reload) return timeReload();
  if (asksReload()) {
    startReload();
    return true;
  }
  if (hero.state === "shoot") {
    bowString.queued = true;
    return true;
  }
  if (!isFree() || !airShotLeft()) return false;
  if (sable.ammo <= 0) {
    flashQuiver("empty");
    return startReload();
  }
  startBolt();
  return true;
}

/** a puff and a flash at the muzzle, and the string's snap */
function muzzleFlash(x: number, y: number, angle: number, primed: boolean, twang: number): void {
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  jadeLight(x, y, primed ? "primedMuzzle" : "muzzle");
  for (let i = 0; i < 3; i++)
    particles.spawn(PK.SMOKE, x, y, ux * rng.range(10, 30), uy * 10 - rng.range(4, 12), rng.range(0.25, 0.4), {
      size: rng.range(0.8, 1.3),
    });
  sfx.swing(primed ? twang - 0.3 : twang);
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
      beat: undefined,
      side: true,
    });
  }
}

/** the bolt, and its fan, leave the crossbow; the closing bolt of a string ends it */
function fire(): void {
  const drawn = drawBolt();
  if (!drawn) return;
  const air = !hero.ground;
  const beat = bowString.beat;
  const closing = beat === LAST;
  hero.chain = (air ? sable.airShots : sable.string) + 1;
  if (air) {
    if (!hovering()) sable.airShots++;
    const hang = skillValues("s_featherdraw").hang ?? 0;
    if (hang && !hovering()) hero.vy = Math.min(hero.vy, -hang * 160);
    else hero.vx -= hero.face * 25;
    if (closing) emitSkillEvent({ type: "airString", x: hero.x, y: hero.y });
  } else sable.string = closing ? 0 : sable.string + 1;
  const m = muzzle(sable.aim, beat);
  // Powder Keg: with a foe at a keg ahead, the shot goes for the keg
  const keg = kegInSights(BOLT.range);
  if (keg) m.angle = Math.atan2(keg[1] - m.y, keg[0] - m.x);
  muzzleFlash(m.x, m.y, m.angle, drawn.prime !== null, BEATS[beat].twang);
  const shot: Shot = { ...m, share: 1, prime: drawn.prime, closing, beat, air };
  looseBolt(shot);
  fan(shot);
}

/**
 * The bolt leaves on its beat's release frame and the clip runs on through the recoil; after the closing bolt the
 * crossbow cocks. J tapped during a bolt starts the next bolt where this one ends; otherwise she settles and the next
 * tap goes on with the string.
 */
export function runShoot(dt: number): void {
  const h = hero;
  const beat = BEATS[bowString.beat];
  h.st += dt * (shootRate() - 1);
  if (!sable.fired && h.st >= beat.fire) {
    sable.fired = true;
    fire();
  }
  if (h.st < beat.dur) return;
  if (bowString.beat === LAST && sable.fired) {
    sable.cock = Math.max(0, beat.dur + COCK - h.st);
    if (sable.cock > 0) return;
  }
  if (bowString.queued && sable.ammo > 0 && !sable.reload && airShotLeft()) {
    startBolt();
    return;
  }
  bowString.link = STRING.link;
  settle();
  if (sable.ammo <= 0) startReload();
}

/** the string's link runs out: the next tap starts it again from the first bolt */
export function tickString(dt: number): void {
  if (bowString.link <= 0) return;
  bowString.link = Math.max(0, bowString.link - dt);
  if (bowString.link <= 0) sable.string = 0;
}
