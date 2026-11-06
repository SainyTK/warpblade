import { BOLT, SHOOT_TIMES } from "../../../constants/sable/bolt";
import { sfx } from "../../../services/audio";
import { PK } from "../../../types/particle";
import { isHeld } from "../../input";
import { hasPerk } from "../../progress";
import { hero, lights, particles, progress, rng } from "../../state";
import { isFree, setState, settle } from "../actions";
import { skin } from "../skin";
import { heldAim, muzzle } from "./aim";
import { looseBolt } from "./loose";
import { sable } from "./memory";
import { drawBolt, flashQuiver } from "./quiver";
import { startReload } from "./reload";

/** the shoot clip runs this much faster with attack speed, so the interval between shots follows it */
export const shootRate = (): number => (SHOOT_TIMES.dur / BOLT.interval) * progress.stats.aspd;

/** a bolt can be loosed now: she is free, or the last shot's recovery is under way */
const canShoot = (): boolean => isFree() || (hero.state === "shoot" && sable.fired && hero.st >= SHOOT_TIMES.fire);

/** J: loose a bolt at the held aim; an empty quiver starts the reload instead */
export function pressShoot(): boolean {
  if (!canShoot()) return hero.state === "shoot";
  if (sable.reload) return true;
  if (sable.ammo <= 0) {
    flashQuiver("empty");
    return startReload();
  }
  sable.aim = heldAim();
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

/** the bolt, or Scattershot's fan, leaves the crossbow */
function fire(): void {
  if (!drawBolt()) return;
  const primed = sable.primed > 0;
  if (primed) sable.primed--;
  const m = muzzle(sable.aim);
  muzzleFlash(m.x, m.y, m.angle, primed);
  looseBolt({ ...m, share: 1, primed });
  if (hasPerk("scattershot")) {
    for (const s of [-1, 1])
      looseBolt({ ...m, angle: m.angle + s * BOLT.scatterSpread, share: BOLT.scatterShare, primed: false });
  }
  if (!hero.ground) hero.vx -= hero.face * 25;
}

/** the shot leaves on its frame; J still held looses the next one once the clip has run, an empty quiver reloads */
export function runShoot(dt: number): void {
  const h = hero;
  h.st += dt * (shootRate() - 1);
  if (!sable.fired && h.st >= SHOOT_TIMES.fire) {
    sable.fired = true;
    fire();
  }
  if (h.st < SHOOT_TIMES.dur) return;
  if (isHeld("attack") && sable.ammo > 0 && !sable.reload) {
    sable.aim = heldAim();
    sable.fired = false;
    setState("shoot");
    return;
  }
  if (sable.ammo <= 0) {
    settle();
    startReload();
    return;
  }
  settle();
}
