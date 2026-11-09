import { PAL, WAX } from "../../../constants/palette";
import { WAX_DRIP } from "../../../constants/wenna/wax";
import { glow, place, px } from "../../../engine/frame";
import { sfx } from "../../../services/audio";
import { ownsSkill } from "../../../store/meta";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import type { Drip } from "../../../types/wenna";
import { heroSlot } from "../../coopHooks";
import { enemyCenter } from "../../enemies/enemy";
import { stacksOf } from "../../enemies/skillStatus";
import { skillValues } from "../../skills/query";
import { hero, particles, rng } from "../../state";
import { surfaceBelow } from "../../world";
import { gainWax } from "./wax";

/** every Wenna's drips; each tends her own */
let drips: Drip[] = [];

/** the Wax a foe drips: more for an elite and a mini boss; Candlemaker doubles it for a foe she splashed */
function dripValue(e: Enemy): number {
  const base = e.elite ? WAX_DRIP.elite : WAX_DRIP[e.rank];
  const doubled = skillValues("w_hotWax").candle && stacksOf(e, "w_hotWax") > 0;
  return doubled ? base * 2 : base;
}

/** a foe she or her Wicks felled leaves a drip that pops out of it */
export function dropDrip(e: Enemy): void {
  const [x, y] = enemyCenter(e);
  drips.push({
    owner: heroSlot(),
    x,
    y,
    vx: rng.range(-40, 40),
    vy: -rng.range(80, 130),
    wax: dripValue(e),
    t: 0,
    flying: false,
  });
}

/** one drip: it falls and lies on the floor, flies to her once she is near, and fades away if she never comes */
function stepDrip(d: Drip, dt: number): boolean {
  d.t += dt;
  const pull = ownsSkill("lodestone") ? WAX_DRIP.lodestonePull : WAX_DRIP.pull;
  const dx = hero.x - d.x;
  const dy = hero.y - 16 - d.y;
  const dist = Math.hypot(dx, dy) || 1;
  if (!d.flying && dist <= pull && hero.state !== "dead") d.flying = true;
  if (d.flying) {
    const step = Math.min(dist, WAX_DRIP.speed * (1 + d.t) * dt);
    d.x += (dx / dist) * step;
    d.y += (dy / dist) * step;
    if (dist > WAX_DRIP.reach) return true;
    gainWax(d.wax);
    particles.spawn(PK.STAR, d.x, d.y, 0, -12, 0.3, { col: WAX[3], size: 1.5 });
    sfx.pickup();
    return false;
  }
  const floor = surfaceBelow(d.x, d.y - 1);
  if (d.y < floor) {
    d.vy += WAX_DRIP.gravity * dt;
    d.x += d.vx * dt;
    d.y = Math.min(floor, d.y + d.vy * dt);
  } else d.vx = 0;
  return d.t < WAX_DRIP.life;
}

/** her drips move; those whose time is up are gone */
export function stepDrips(dt: number): void {
  const mine = heroSlot();
  drips = drips.filter((d) => d.owner !== mine || stepDrip(d, dt));
}

/** a new run: no drip lies anywhere */
export function clearDrips(): void {
  drips = [];
}

/** her drips: a small pale drop with a violet glint, blinking over its last moments on the floor */
export function drawDrips(): void {
  const mine = heroSlot();
  place();
  for (const d of drips) {
    if (d.owner !== mine) continue;
    const left = WAX_DRIP.life - d.t;
    if (!d.flying && left < WAX_DRIP.blink && Math.floor(d.t * 10) % 2 === 0) continue;
    const x = Math.round(d.x);
    const y = Math.round(d.y);
    px(x, y - 2, WAX[3]);
    px(x, y - 1, WAX[2]);
    px(x - 1, y - 1, WAX[1]);
    px(x + 1, y - 1, WAX[2]);
    px(x, y, WAX[1]);
    px(x + 1, y - 2, PAL.wick[4], 0.8);
    glow(x, y - 1, 4, PAL.wick[3], 0.18);
  }
}
