import { RELOAD } from "../../../constants/sable/reload";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { enemyCenter } from "../../enemies/enemy";
import { skillValues } from "../../skills/query";
import { nearestFoe } from "../../skills/targets";
import { hero, lights, particles, progress, rng } from "../../state";
import { skin } from "../skin";
import { muzzle } from "./aim";
import { looseBolt } from "./loose";
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
  sable.primed = Math.min(primedBolts(), quiverSize());
  flashQuiver("perfect");
  sfx.perfect();
  lights.add(hero.x, hero.y - 18, 28, skin.ramp[5], 0.9, 0.25);
  for (let i = 0; i < 8; i++)
    particles.spawn(PK.STAR, hero.x + hero.face * 6, hero.y - 17, rng.range(-50, 50), -rng.range(30, 90), 0.4, {
      col: skin.ramp[5],
    });
  sable.sincePerfect = 0;
  const v = skillValues("s_rhythm");
  hero.stamina = Math.min(progress.stats.stamina, hero.stamina + (v.stamina ?? 0));
  hero.mp = Math.min(progress.stats.mp, hero.mp + (v.mp ?? 0));
  if (v.hasteTime) sable.haste = v.hasteTime;
  if (v.volley) volley(v.volley);
}

/** Perfect Rhythm: a perfect reload looses primed bolts at once, one at each of the nearest foes */
function volley(count: number): void {
  const m = muzzle("level");
  const taken: Enemy[] = [];
  for (let i = 0; i < count; i++) {
    const e = nearestFoe(hero.x, m.y, taken) ?? taken[i % Math.max(1, taken.length)];
    if (!e) return;
    taken.push(e);
    const [cx, cy] = enemyCenter(e);
    looseBolt({ ...m, angle: Math.atan2(cy - m.y, cx - m.x), share: 1, prime: "reload" });
  }
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
