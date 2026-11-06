import { FIST_BOX, FISTS, HAMMER, KNUCKLES, STRING, STRING_LINK } from "../../../constants/hulda/fists";
import { GRIT } from "../../../constants/hulda/grit";
import { sfx } from "../../../services/audio";
import type { FistBlow } from "../../../types/hulda";
import { isHeld } from "../../input";
import { meleeHit } from "../../meleeHit";
import { hasPerk } from "../../progress";
import { hero, progress } from "../../state";
import { boxAhead, newSwing } from "../../world";
import { isFree, setState, settle } from "../actions";
import { gainGrit } from "./grit";
import { hulda } from "./memory";

/** every blow of the string by its place: the four from the start, then the uppercut and the knuckle rush */
const ORDER: readonly FistBlow[] = [...STRING, "uppercut", "knuckles"];
const UPPERCUT = ORDER.indexOf("uppercut");
const KNUCKLES_AT = ORDER.indexOf("knuckles");
const HAYMAKER = STRING.indexOf("haymaker");

/** the blow under way */
export const currentBlow = (): FistBlow => ORDER[hulda.blow];

/** how long the current blow's clip runs: the knuckle rush lasts as long as its punches */
export const blowLength = (): number =>
  currentBlow() === "knuckles" ? KNUCKLES.count * KNUCKLES.every + FISTS.knuckles.dur : FISTS[currentBlow()].dur;

/** the blow after the current one, or -1 when the string ends here */
function nextBlow(): number {
  const b = hulda.blow;
  if (b < HAYMAKER) return b + 1;
  if (b === HAYMAKER && hasPerk("uppercut")) return UPPERCUT;
  return -1;
}

function startBlow(index: number): void {
  hulda.blow = index;
  hulda.queued = false;
  hulda.struck = false;
  hulda.punches = index === KNUCKLES_AT ? KNUCKLES.count : 0;
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

/** a blow lands on every foe in the box ahead; each foe struck gives Grit */
function land(blow: FistBlow): void {
  const f = FISTS[blow];
  const [x0, y0, x1, y1] = FIST_BOX;
  const hits = meleeHit([boxAhead(x0, y0, x1, y1)], {
    power: f.power,
    kx: f.kx,
    ky: f.ky,
    stun: f.stun,
    launch: f.launch,
    big: f.heavy,
    feel: f.stop ? { stop: f.stop, shake: f.shake ?? [0.12, 1.5], pitch: 0.75 } : undefined,
  });
  if (hits) gainGrit(GRIT.fist * hits);
  if (blow === "haymaker") hero.vx = hero.face * 40;
}

/** the knuckle rush: a punch every few hundredths of a second, each its own swing */
function runKnuckles(): void {
  const done = KNUCKLES.count - hulda.punches;
  if (hulda.punches > 0 && hero.st >= done * KNUCKLES.every + FISTS.knuckles.hit) {
    hulda.punches--;
    newSwing();
    land("knuckles");
    sfx.swing(1.3);
  }
}

/** the blow lands on its frame; when it ends, a queued press or a held J carries the string on */
export function runFist(dt: number): void {
  const h = hero;
  h.st += dt * (progress.stats.aspd - 1);
  const blow = currentBlow();
  if (blow === "knuckles") runKnuckles();
  else if (!hulda.struck && h.st >= FISTS[blow].hit) {
    hulda.struck = true;
    land(blow);
  }
  if (h.st < blowLength()) return;
  if (hulda.blow === HAYMAKER && hasPerk("knuckleRush") && isHeld("attack")) return startBlow(KNUCKLES_AT);
  const next = nextBlow();
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
    if (hits) gainGrit(GRIT.fist * hits);
  }
  if (h.st >= HAMMER.dur) settle();
}

/** a blow's recovery after it landed can be cut short by a grab or a rush */
export const inRecovery = (): boolean => hero.state === "fist" && hulda.struck && currentBlow() !== "knuckles";
