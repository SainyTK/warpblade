import { RUST_ARC } from "../../../constants/characters/hulda/look";
import { FISTS, HAMMER, STRING, STRING_LINK } from "../../../constants/hulda/fists";
import { sfx } from "../../../services/audio";
import type { FistBlow } from "../../../types/hulda";
import { createSlash } from "../../effects/slash";
import { isHeld } from "../../input";
import { meleeHit } from "../../meleeHit";
import { game, hero, progress } from "../../state";
import { boxAhead, dust, newSwing } from "../../world";
import { isFree, setState, settle } from "../actions";
import { fistHit } from "./effects/thud";
import { fistGrit, gainGrit } from "./grit";
import { afterHaymaker, haymakerBoost } from "./haymaker";
import { hulda } from "./memory";
import { sendWaves } from "./waves";

const HAYMAKER = STRING.indexOf("haymaker");

/** the blow under way */
export const currentBlow = (): FistBlow => STRING[hulda.blow];

/** a string starts facing the way she is pushed, and with nothing held the way she already faces */
function faceHeld(dir: number): void {
  if (dir) hero.face = dir;
}

function startBlow(index: number): void {
  hulda.blow = index;
  hulda.queued = false;
  hulda.struck = false;
  hulda.link = 0;
  hero.chain = Math.min(progress.comboLimit, index + 1);
  hero.vx = 0;
  newSwing();
  setState("fist");
  sfx.swing(index === HAYMAKER ? 0.75 : 1.1);
}

/** J on the floor: the next blow of the string, a new string facing the way she is pushed, or queue it during a blow;
 *  in the air one hammer fist. Where the foes stand never changes the blow or her facing. */
export function pressFist(dir: number): boolean {
  const h = hero;
  if (h.state === "fist") {
    hulda.queued = true;
    return true;
  }
  if (!isFree()) return false;
  if (!h.ground) {
    if (hulda.airFisted) return false;
    hulda.airFisted = true;
    hulda.struck = false;
    newSwing();
    setState("airFist");
    sfx.swing(0.9);
    return true;
  }
  const index = hulda.link > 0 ? hulda.blow : 0;
  if (index === 0) faceHeld(dir);
  startBlow(index);
  return true;
}

/**
 * A blow lands on every foe in the box ahead; each foe struck gives Grit. Knuckle Wave pushes its waves on, and on the
 * haymaker Wrecking Haymaker adds its power, stun, launch and spike, then its crack and knock-down.
 */
function land(blow: FistBlow): void {
  const f = FISTS[blow];
  const [x0, y0, x1, y1] = f.box;
  const boost = blow === "haymaker" ? haymakerBoost() : null;
  if (f.arc) game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...f.arc, ramp: RUST_ARC }));
  hero.lastHit = null;
  const hits = meleeHit([boxAhead(x0, y0, x1, y1)], {
    power: f.power + (boost?.power ?? 0),
    kx: f.kx,
    ky: f.ky,
    stun: Math.max(f.stun ?? 0, boost?.stun ?? 0),
    launch: boost?.launch,
    spike: boost?.spike,
    stagger: f.stagger,
    big: f.heavy,
    feel: f.feel,
  });
  if (hits) gainGrit(fistGrit() * hits);
  if (hits && hero.lastHit) fistHit(blow, hero.lastHit);
  // the front foot of a step stamps down as the blow lands
  if (f.step) dust(hero.x + hero.face * 5, hero.y, 3, hero.face);
  sendWaves(blow);
  if (blow === "haymaker") afterHaymaker(hits ? hero.lastHit : null);
}

/** the step into a blow drives her feet at an even speed over its frames, so the clip's planted foot holds the floor */
export function fistStepSpeed(): number {
  const step = hero.state === "fist" ? FISTS[currentBlow()].step : undefined;
  if (!step || hero.st < step.from || hero.st >= step.to) return 0;
  return (step.distance / (step.to - step.from)) * progress.stats.aspd;
}

/** the blow under way steps her in now */
export const fistSteps = (): boolean => fistStepSpeed() > 0;

/**
 * The blow lands on its frame. From its `next` time a queued press starts the following blow, and after the haymaker a
 * new string's jab, facing the way she is pushed; otherwise the blow settles to her guard and J carries the string on
 * for a moment.
 */
export function runFist(dt: number): void {
  const h = hero;
  h.st += dt * (progress.stats.aspd - 1);
  const blow = currentBlow();
  const f = FISTS[blow];
  const step = fistStepSpeed();
  // the step drives her feet; once it is over they stop where it put them, while a guard's push back still slides her
  if (step) h.vx = h.face * step;
  else if (f.step && h.vx * h.face > 0) h.vx = 0;
  if (!hulda.struck && h.st >= f.hit) {
    hulda.struck = true;
    land(blow);
  }
  const last = hulda.blow === HAYMAKER;
  if (hulda.queued && h.st >= f.next) {
    if (last) faceHeld((isHeld("right") ? 1 : 0) - (isHeld("left") ? 1 : 0));
    return startBlow(last ? 0 : hulda.blow + 1);
  }
  if (h.st < f.dur) return;
  settle();
  hulda.blow = last ? 0 : hulda.blow + 1;
  hulda.link = last ? 0 : STRING_LINK;
}

/** the hammer fist drives down on its frame and spikes a foe in the air into the floor */
export function runAirFist(): void {
  const h = hero;
  if (!hulda.struck && h.st >= HAMMER.hit) {
    hulda.struck = true;
    hero.lastHit = null;
    const [x0, y0, x1, y1] = HAMMER.box;
    const hits = meleeHit([boxAhead(x0, y0, x1, y1)], {
      power: HAMMER.power,
      kx: 30,
      ky: 0,
      spike: true,
      feel: HAMMER.feel,
    });
    if (hits) gainGrit(fistGrit() * hits);
    if (hits && hero.lastHit) fistHit("hammer", hero.lastHit);
  }
  if (h.st >= HAMMER.dur) settle();
}

/** a blow's recovery after it landed can be cut short by a grab or a rush */
export const inRecovery = (): boolean => hero.state === "fist" && hulda.struck;

/** the haymaker is under way */
export const inHaymaker = (): boolean => hero.state === "fist" && hulda.blow === HAYMAKER;
