import { RELOAD } from "../../../constants/sable/reload";
import { sfx } from "../../../services/audio";
import { PK } from "../../../types/particle";
import { hasPerk } from "../../progress";
import { hero, lights, particles, progress, rng } from "../../state";
import { skin } from "../skin";
import { sable } from "./memory";
import { flashQuiver, primedBolts, quiverSize, reloadWindow } from "./quiver";

/** the share of the reload done, 0 to 1 */
export const reloadShare = (): number => (sable.reload ? Math.min(1, sable.reload.t / sable.reload.dur) : 0);

/** start cranking a fresh quiver in; she keeps walking, jumping and kicking while she cranks */
export function startReload(): boolean {
  if (sable.reload || sable.ammo >= quiverSize()) return false;
  sable.reload = { t: 0, dur: RELOAD.dur / progress.stats.aspd, tried: false, jammed: false };
  sfx.tone(240, 320, 0.06, "square", 0.04);
  return true;
}

function finish(): void {
  sable.reload = null;
  sable.ammo = quiverSize();
  sfx.tone(520, 700, 0.05, "square", 0.05);
}

/** a perfect reload: the quiver is full at once and its first bolts are primed */
function perfect(): void {
  finish();
  sable.primed = primedBolts();
  flashQuiver("perfect");
  sfx.perfect();
  lights.add(hero.x, hero.y - 18, 28, skin.ramp[5], 0.9, 0.25);
  for (let i = 0; i < 8; i++)
    particles.spawn(PK.STAR, hero.x + hero.face * 6, hero.y - 17, rng.range(-50, 50), -rng.range(30, 90), 0.4, {
      col: skin.ramp[5],
    });
  if (!hasPerk("huntersFocus")) return;
  hero.stamina = Math.min(progress.stats.stamina, hero.stamina + RELOAD.focusStamina);
  hero.mp = Math.min(progress.stats.mp, hero.mp + RELOAD.focusMp);
}

/** O: start the reload, or the timing press inside one: in the bright window a perfect reload, outside it a jam */
export function pressReload(): boolean {
  const r = sable.reload;
  if (!r) return startReload() || true;
  if (r.tried) return true;
  r.tried = true;
  const [a, b] = reloadWindow();
  const u = r.t / r.dur;
  if (u >= a && u <= b && !r.jammed) {
    perfect();
    return true;
  }
  r.jammed = true;
  r.dur += RELOAD.jam;
  flashQuiver("jam");
  sfx.denied();
  return true;
}

/** the crank turns on; a reload left alone finishes on its own */
export function tickReload(dt: number): void {
  sable.flash = Math.max(0, sable.flash - dt);
  const r = sable.reload;
  if (!r) return;
  r.t += dt;
  if (r.t >= r.dur) finish();
}
