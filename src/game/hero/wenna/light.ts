import { PAL } from "../../../constants/palette";
import { LIGHT } from "../../../constants/wenna/wax";
import { sfx } from "../../../services/audio";
import { PK } from "../../../types/particle";
import { isHeld } from "../../input";
import { skillValues } from "../../skills/query";
import { hero, particles, rng } from "../../state";
import { surfaceBelow } from "../../world";
import { isFree, setState, settle } from "../actions";
import { wenna } from "./memory";
import { hasWax, refuseWax, spendWax } from "./wax";
import { cappedWicks, relight, spawnWick, weakestWick, wickCap } from "./wicks";

/** what a Wick costs: Deep Tallow takes some off; the next Wick after Chain Kindle costs nothing */
export const wickCost = (): number =>
  wenna.freeWick ? 0 : Math.max(0, LIGHT.cost - (skillValues("w_tallow").cost ?? 0));

/** at the cap a press relights the weakest Wick for less */
const atCap = (): boolean => cappedWicks().length >= wickCap();

/** what this press of K costs now */
export const lightCost = (): number => (atCap() ? LIGHT.relight : wickCost());

/** K: light a Wick ahead (at her feet with Down held), or relight the weakest at the cap; refused under the cost */
export function pressLight(): boolean {
  if (!isFree()) return false;
  if (atCap() && !weakestWick()) return false;
  if (!hasWax(lightCost())) {
    refuseWax();
    return true;
  }
  wenna.atFeet = isHeld("down") || !hero.ground;
  hero.vx = 0;
  setState("lightCast");
  sfx.swing(0.9);
  return true;
}

/** the drop of violet flame arcs from the lamp to where the Wick will stand */
function flameDrop(x0: number, y0: number, x1: number, y1: number): void {
  const steps = 8;
  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const x = x0 + (x1 - x0) * u;
    const y = y0 + (y1 - y0) * u - Math.sin(u * Math.PI) * 8;
    particles.spawn(PK.EMBER, x, y, 0, rng.range(-6, 6), 0.18 + u * 0.15, {
      sparks: [PAL.wick[5], PAL.wick[4], PAL.wick[3], PAL.wick[2]],
      delay: u * 0.08,
    });
  }
}

/** the lamp swings forward and lets the drop go: a new Wick rises where it lands, or the weakest flares back */
function release(): void {
  const h = hero;
  if (atCap()) {
    const w = weakestWick();
    if (!w || !hasWax(LIGHT.relight)) return;
    spendWax(LIGHT.relight);
    relight(w);
    return;
  }
  const cost = wickCost();
  if (!hasWax(cost)) return;
  spendWax(cost);
  wenna.freeWick = false;
  const x = wenna.atFeet ? h.x : h.x + h.face * LIGHT.ahead;
  const y = surfaceBelow(x, h.y - 1);
  flameDrop(h.x + h.face * 10, h.y - 22, x, y - 4);
  spawnWick(x, y, "light");
}

/** the K cast: the lamp swings, the drop leaves at the release frame, she is free when the swing ends */
export function runLightCast(): void {
  const h = hero;
  if (h.ground) h.vx = 0;
  if (!h.hitDone && h.st >= LIGHT.release) {
    h.hitDone = true;
    release();
  }
  if (h.st >= LIGHT.dur) settle();
}
