import { FISTS, HAMMER, STRING, STRING_LINK } from "../../../constants/hulda/fists";
import { sfx } from "../../../services/audio";
import type { FistBlow } from "../../../types/hulda";
import { createSlash } from "../../effects/slash";
import { meleeHit } from "../../meleeHit";
import { game, hero, progress } from "../../state";
import { boxAhead, newSwing } from "../../world";
import { isFree, setState, settle } from "../actions";
import { skin } from "../skin";
import { fistGrit, gainGrit } from "./grit";
import { afterHaymaker, haymakerBoost } from "./haymaker";
import { hulda } from "./memory";
import { sendWaves } from "./waves";

const HAYMAKER = STRING.indexOf("haymaker");

/** the blow under way */
export const currentBlow = (): FistBlow => STRING[hulda.blow];

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

/** J on the floor: the next blow of the string, or queue it during a blow; in the air one hammer fist */
export function pressFist(): boolean {
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
  startBlow(hulda.link > 0 ? hulda.blow : 0);
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
  if (f.arc) game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...f.arc, ramp: skin.ramp }));
  hero.lastHit = null;
  const hits = meleeHit([boxAhead(x0, y0, x1, y1)], {
    power: f.power + (boost?.power ?? 0),
    kx: f.kx,
    ky: f.ky,
    stun: boost?.stun ?? f.stun,
    launch: boost?.launch ?? f.launch,
    spike: boost?.spike,
    big: f.heavy,
    feel: f.stop ? { stop: f.stop, shake: f.shake ?? [0.12, 1.5], pitch: 0.75 } : undefined,
  });
  if (hits) gainGrit(fistGrit() * hits);
  sendWaves(blow);
  if (blow === "haymaker") afterHaymaker(hits ? hero.lastHit : null);
}

/** the blow lands on its frame; when it ends, a queued press carries the string on */
export function runFist(dt: number): void {
  const h = hero;
  h.st += dt * (progress.stats.aspd - 1);
  const blow = currentBlow();
  const f = FISTS[blow];
  if (h.st >= f.stepAt && h.st - dt * progress.stats.aspd < f.stepAt + 1e-6) h.vx = h.face * f.step;
  if (!hulda.struck && h.st >= f.hit) {
    hulda.struck = true;
    land(blow);
  }
  if (h.st < f.dur) return;
  const next = hulda.blow < HAYMAKER ? hulda.blow + 1 : -1;
  if (hulda.queued && next >= 0) return startBlow(next);
  settle();
  hulda.blow = next >= 0 ? next : 0;
  hulda.link = next >= 0 ? STRING_LINK : 0;
}

/** the hammer fist drives down on its frame and spikes a foe in the air into the floor */
export function runAirFist(): void {
  const h = hero;
  if (!hulda.struck && h.st >= HAMMER.hit) {
    hulda.struck = true;
    const [x0, y0, x1, y1] = HAMMER.box;
    const hits = meleeHit([boxAhead(x0, y0, x1, y1)], { power: HAMMER.power, kx: 30, ky: 0, spike: true });
    if (hits) gainGrit(fistGrit() * hits);
  }
  if (h.st >= HAMMER.dur) settle();
}

/** a blow's recovery after it landed can be cut short by a grab or a rush */
export const inRecovery = (): boolean => hero.state === "fist" && hulda.struck;

/** the haymaker is under way */
export const inHaymaker = (): boolean => hero.state === "fist" && hulda.blow === HAYMAKER;
