import { PAL } from "../../../constants/palette";
import { SWAP } from "../../../constants/wenna/swap";
import { line, place } from "../../../engine/frame";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import type { Wick } from "../../../types/wenna";
import { dealDamage } from "../../damage";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { emitSkillEvent } from "../../skills/events";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, lights, particles, progress, rng } from "../../state";
import { shake } from "../../world";
import { isFree, setState, settle } from "../actions";
import { rewardPerfectDodge } from "../perfectDodge";
import { refuseDash } from "../stamina";
import { travelEnded } from "../travelEnd";
import { wenna, wennaHost } from "./memory";
import { inRecovery } from "./string";
import { leaveSwapLook } from "./swapLook";
import { cappedWicks, isUp, liveWicks, spawnWick, wickCap } from "./wicks";

const STEP = "w_swap";

/** how far a Swap reaches, and how many charges she holds: Changeling Step */
const swapRange = (): number => skillValues(STEP).range ?? SWAP.range;
export const swapCharges = (): number => skillValues(STEP).charges ?? 1;

/** the Wick a Swap trades with: the farthest ahead in her facing within reach, else the nearest in any direction */
export function swapTarget(): Wick | null {
  const reach = swapRange();
  const near = liveWicks().filter((w) => isUp(w) && Math.hypot(w.x - hero.x, w.y - hero.y) <= reach);
  const ahead = near.filter((w) => (w.x - hero.x) * hero.face > 2);
  if (ahead.length) return ahead.reduce((a, b) => ((b.x - hero.x) * hero.face > (a.x - hero.x) * hero.face ? b : a));
  if (!near.length) return null;
  return near.reduce((a, b) =>
    Math.hypot(b.x - hero.x, b.y - hero.y) < Math.hypot(a.x - hero.x, a.y - hero.y) ? b : a,
  );
}

/** a puff of violet smoke where one of the two vanishes */
function puff(x: number, y: number): void {
  for (let i = 0; i < 10; i++)
    particles.spawn(PK.SMOKE, x + rng.range(-4, 4), y - rng.range(4, 20), rng.range(-20, 20), -rng.range(5, 25), 0.5, {
      col: rng.chance(0.5) ? PAL.wick[2] : PAL.wick[3],
      size: rng.range(2, 4),
    });
  for (let i = 0; i < 6; i++)
    particles.spawn(PK.SPARK, x, y - 12, rng.range(-70, 70), -rng.range(20, 80), 0.3, { col: PAL.wick[4] });
  lights.add(x, y - 12, 30, PAL.wick[4], 0.7, 0.25);
}

/** a thread of flame joins the two spots for three frames */
function thread(x0: number, y0: number, x1: number, y1: number): void {
  let t = 0;
  game.fx.push({
    update(dt) {
      t += dt;
      return t < 0.1;
    },
    draw() {
      place();
      const k = 1 - t / 0.1;
      line(x0, y0 - 12, x1, y1 - 12, PAL.wick[4], k);
      line(x0, y0 - 11, x1, y1 - 11, PAL.wick[2], k * 0.6);
    },
  });
}

/** L: trade places with a Wick, paid with stamina; refused with no Wick in reach */
export function pressSwap(): boolean {
  const h = hero;
  if (!isFree() && !inRecovery()) return false;
  if (wenna.swapCharges <= 0) return false;
  const w = swapTarget();
  if (!w) {
    sfx.denied();
    return true;
  }
  if (h.stamina < SWAP.stamina) {
    refuseDash();
    return true;
  }
  h.stamina -= SWAP.stamina;
  h.staminaWait = 0.5;
  h.perfectUsed = false;
  wenna.swapCharges--;
  if (wenna.swapCd <= 0) wenna.swapCd = withCharms("cooldown", SWAP.cooldown);
  wenna.swapFrom = { x: h.x, y: h.y };
  wenna.swapTo = { x: w.x, y: w.y };
  wenna.swapDodged = false;
  wenna.untouchable = SWAP.gone + (skillValues(STEP).untouch ?? SWAP.untouchable);
  wennaHost.swapWick = w;
  Object.assign(h, { vx: 0, vy: 0, move: null, queued: null, running: false });
  setState("swap");
  leaveSwapLook(w);
  puff(h.x, h.y);
  puff(w.x, w.y);
  sfx.warp();
  return true;
}

/** Changeling Step: foes on the line between the two ends take a cut */
function cutLine(x0: number, x1: number, y: number): void {
  const power = skillValues(STEP).line ?? 0;
  if (!power) return;
  const lo = Math.min(x0, x1);
  const hi = Math.max(x0, x1);
  for (const e of game.enemies) {
    const b = enemyBox(e);
    if (e.hp <= 0 || b[2] < lo || b[0] > hi || b[3] < y - 30 || b[1] > y) continue;
    dealDamage(e, progress.stats.ad * power, { fromX: x0, kx: Math.sign(x1 - x0) * 40 });
  }
}

/** the Wick arrives where she stood with a flare that throws the foes near it away */
function arrivalFlare(w: Wick): Enemy[] {
  const power = SWAP.flare * (1 + (skillValues(STEP).flare ?? 0));
  const hit: Enemy[] = [];
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.hypot(cx - w.x, cy - (w.y - 8)) > SWAP.flareReach + 6) continue;
    dealDamage(e, progress.stats.ap * power, { fromX: w.x, kx: Math.sign(cx - w.x) * SWAP.flareKnock, ky: -40 });
    hit.push(e);
  }
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    particles.spawn(PK.SPARK, w.x, w.y - 8, Math.cos(a) * 90, Math.sin(a) * 60 - 20, 0.3, { col: PAL.wick[4] });
  }
  lights.add(w.x, w.y - 8, 36, PAL.wick[4], 0.9, 0.25);
  shake(0.1, 1.5);
  return hit;
}

/** both arrive at the other's spot: the Wick flares, she calls her shop's and skills' travel answers */
function arrive(): void {
  const h = hero;
  const from = wenna.swapFrom;
  const to = wenna.swapTo;
  const w = wennaHost.swapWick;
  if (!from || !to) return;
  const wickAlive = !!w && w.melt < 0;
  h.x = to.x;
  h.y = to.y;
  h.ground = true;
  if (w && wickAlive) {
    w.x = from.x;
    w.y = from.y;
    w.vx = 0;
    w.vy = 0;
    w.ground = true;
    w.target = null;
    if (skillValues(STEP).heal) w.hp = w.max;
  }
  thread(from.x, from.y, to.x, to.y);
  puff(to.x, to.y);
  if (w && wickAlive) arrivalFlare(w);
  cutLine(from.x, to.x, to.y);
  if (skillValues(STEP).mirror && cappedWicks().length < wickCap()) spawnWick(to.x + h.face * 8, to.y, "skill");
  const dir = Math.sign(to.x - from.x) || h.face;
  emitSkillEvent({ type: "dash", dir, foes: [] });
  if (w) emitSkillEvent({ type: "swap", from, to, wick: w });
  travelEnded();
}

/** the Swap: both are gone for a moment, then each stands at the other's spot */
export function runSwap(): void {
  const h = hero;
  h.vx = 0;
  h.vy = 0;
  if (!h.hitDone && h.st >= SWAP.gone) {
    h.hitDone = true;
    arrive();
  }
  if (h.st >= SWAP.dur) settle();
}

/** she is gone or just arrived: a blow meets nothing, and one in the first moments is a perfect dodge */
export function swapDodge(): boolean {
  if (wenna.untouchable <= 0) return false;
  const window = skillValues(STEP).dodge ?? SWAP.dodge;
  if (hero.state === "swap" && hero.st <= window && !wenna.swapDodged) {
    wenna.swapDodged = true;
    rewardPerfectDodge();
    sfx.perfect();
  }
  return true;
}

/** charges come back one at a time */
export function tickSwap(dt: number): void {
  wenna.untouchable = Math.max(0, wenna.untouchable - dt);
  const most = swapCharges();
  if (wenna.swapCharges >= most) {
    wenna.swapCharges = most;
    wenna.swapCd = 0;
    return;
  }
  wenna.swapCd -= dt;
  if (wenna.swapCd > 0) return;
  wenna.swapCharges++;
  wenna.swapCd = wenna.swapCharges < most ? withCharms("cooldown", SWAP.cooldown) : 0;
}

/** where she is going and where she left, while a Swap is under way, for her look */
export const swapEnds = (): { from: { x: number; y: number }; to: { x: number; y: number } } | null =>
  hero.state === "swap" && wenna.swapFrom && wenna.swapTo ? { from: wenna.swapFrom, to: wenna.swapTo } : null;
