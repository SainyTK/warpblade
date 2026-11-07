import { PAL } from "../../constants/palette";
import { WISP_FLIGHT as F } from "../../constants/relics/wisp";
import { circle, glow, hairline, line, place, px } from "../../engine/frame";
import { sfx } from "../../services/audio";
import type { RelicBehavior, RelicMemory } from "../../types/build";
import type { Enemy } from "../../types/enemy";
import { PK } from "../../types/particle";
import { buildStats, relicStats } from "../../utils/build";
import { WHITE } from "../../utils/color";
import { dealDamage } from "../damage";
import { enemyCenter } from "../enemies/enemy";
import { game, hero, particles, progress, rng } from "../state";
import { distance2, foesOnScreen, nearestFoe, touches } from "./relicTargets";

type Bolt = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** where the head was over the last steps, newest last, for the tail */
  tail: number[];
  life: number;
  /** foes it may still strike */
  left: number;
  target: Enemy | null;
  /** foes it has struck, which it never strikes or chases again */
  struck: Enemy[];
};

type WispMemory = {
  t: number;
  /** seconds until the next volley, bolts left in this volley and seconds until the next of them */
  cd: number;
  queue: number;
  wait: number;
  /** the foes this volley is aimed at, nearest first */
  aims: Enemy[];
  /** which wisp fires next */
  turn: number;
  next: number;
  /** where each wisp floats now, as x, y pairs */
  at: number[];
  /** how bright each wisp still is from its last shot */
  flare: number[];
  bolts: Bolt[];
};

const C = PAL.heal;
/** steps of the head kept for a bolt's tail */
const TAIL = 10;
const memoryOf = (m: RelicMemory): WispMemory => m as WispMemory;
const stats = (level: number, evolved: boolean) => relicStats("wisp", level, evolved, buildStats(progress.build));
const perches = (evolved: boolean) => (evolved ? F.choir : F.perch);

/** where wisp i would float now: behind the hero's shoulder, bobbing */
function perch(m: WispMemory, i: number, evolved: boolean): [number, number] {
  const [back, lift] = perches(evolved)[i];
  return [hero.x - hero.face * back, hero.y - lift + Math.sin(m.t * F.bobRate + i * 2.1) * F.bob];
}

/** each wisp drifts after its perch */
function follow(m: WispMemory, evolved: boolean, dt: number): void {
  const n = perches(evolved).length;
  const k = Math.min(1, F.follow * dt);
  for (let i = 0; i < n; i++) {
    const [px0, py0] = perch(m, i, evolved);
    if (m.at.length < (i + 1) * 2) m.at.push(px0, py0);
    m.at[i * 2] += (px0 - m.at[i * 2]) * k;
    m.at[i * 2 + 1] += (py0 - m.at[i * 2 + 1]) * k;
    m.flare[i] = Math.max(0, (m.flare[i] ?? 0) - dt * 4);
  }
}

/** the next bolt of the volley leaves the next wisp, puffing up and out before it turns on its foe */
function fire(m: WispMemory, level: number, evolved: boolean): void {
  const s = stats(level, evolved);
  const n = perches(evolved).length;
  const i = m.turn % n;
  m.turn++;
  const x = m.at[i * 2];
  const y = m.at[i * 2 + 1];
  const live = m.aims.filter((e) => e.hp > 0);
  const target = live.length ? live[(s.amount - m.queue) % live.length] : null;
  const a = -Math.PI / 2 + rng.range(-0.9, 0.9) - hero.face * 0.4;
  const speed = F.speed * s.speed;
  m.bolts.push({
    id: m.next++,
    x,
    y,
    vx: Math.cos(a) * speed,
    vy: Math.sin(a) * speed,
    tail: [x, y],
    life: F.life,
    left: s.pierce,
    target,
    struck: [],
  });
  m.flare[i] = 1;
  for (let k = 0; k < 3; k++)
    particles.spawn(PK.MOTE, x, y, rng.range(-30, 30), rng.range(-40, 10), 0.25, { col: C[3] });
}

/** turn toward the foe, fly, strike what it touches */
function fly(b: Bolt, level: number, evolved: boolean, dt: number): boolean {
  const s = stats(level, evolved);
  b.life -= dt;
  if (b.target && b.target.hp <= 0) b.target = nearestFoe(b.x, b.y, b.struck);
  const speed = F.speed * s.speed;
  if (b.target) {
    const [tx, ty] = enemyCenter(b.target);
    const want = Math.atan2(ty - b.y, tx - b.x);
    const now = Math.atan2(b.vy, b.vx);
    let turn = want - now;
    turn = Math.atan2(Math.sin(turn), Math.cos(turn));
    const a = now + Math.max(-F.turn * dt, Math.min(F.turn * dt, turn));
    b.vx = Math.cos(a) * speed;
    b.vy = Math.sin(a) * speed;
  }
  b.x += b.vx * dt;
  b.y += b.vy * dt;
  b.tail.push(b.x, b.y);
  if (b.tail.length > TAIL * 2) b.tail.splice(0, 2);
  for (const e of game.enemies) {
    if (e.hp <= 0 || b.struck.includes(e) || !touches(e, b.x, b.y, F.reach)) continue;
    dealDamage(e, s.damage, { source: "wisp", fromX: b.x, kx: Math.sign(b.vx) * F.kick });
    for (let k = 0; k < 4; k++)
      particles.spawn(PK.SPARK, b.x, b.y, rng.range(-70, 70), rng.range(-90, 10), rng.range(0.12, 0.24), {
        sparks: [WHITE, C[4], C[3], C[2]],
      });
    b.struck.push(e);
    if (b.struck.length >= s.pierce) return false;
    b.target = nearestFoe(b.x, b.y, b.struck);
  }
  return b.life > 0;
}

function drawWisp(x: number, y: number, flare: number, t: number, evolved: boolean): void {
  const sway = Math.sin(t * 7 + x) * 0.8;
  // a flame-like tail curling down and back, a round head, two dark eyes
  hairline(x + hero.face * 1.5, y + 2, x + hero.face * 3 + sway, y + 5, C[2], 0.8);
  px(x + hero.face * 1 + sway * 0.5, y + 2.5, C[2]);
  circle(x, y, 2.6, C[2]);
  circle(x - 0.3, y - 0.3, 2, C[3]);
  circle(x - 0.6, y - 0.6, 1.1, flare > 0.3 ? WHITE : C[4]);
  px(x - 1, y - 0.5, C[0]);
  px(x + 1, y - 0.5, C[0]);
  glow(x, y, evolved ? 11 : 8, C[3], 0.3 + flare * 0.3);
}

/** a bright seed of light with a tail that thins from a full art pixel to a single image pixel */
function drawBolt(b: Bolt, evolved: boolean): void {
  const n = b.tail.length / 2;
  for (let i = 1; i < n; i++) {
    const u = i / n;
    const stroke = u > 0.5 ? line : hairline;
    stroke(b.tail[i * 2 - 2], b.tail[i * 2 - 1], b.tail[i * 2], b.tail[i * 2 + 1], C[u > 0.7 ? 3 : 2], 0.3 + u * 0.7);
  }
  circle(b.x, b.y, evolved ? 1.6 : 1.3, C[3]);
  px(b.x - 0.5, b.y - 0.5, evolved ? WHITE : C[4]);
  glow(b.x, b.y, evolved ? 7 : 5, C[3], 0.45);
}

/** Seeker Wisp: a familiar at the hero's shoulder fires homing bolts at the nearest foes. Design: docs/growth-design.md */
export const wisp: RelicBehavior = {
  create: (): WispMemory => ({
    t: 0,
    cd: 0.5,
    queue: 0,
    wait: 0,
    aims: [],
    turn: 0,
    next: 0,
    at: [],
    flare: [],
    bolts: [],
  }),
  update(memory, level, evolved, dt) {
    const m = memoryOf(memory);
    const s = stats(level, evolved);
    m.t += dt;
    follow(m, evolved, dt);
    m.cd -= dt;
    if (m.cd <= 0 && m.queue <= 0) {
      const foes = foesOnScreen();
      if (foes.length) {
        m.aims = foes.sort((p, q) => distance2(p, hero.x, hero.y) - distance2(q, hero.x, hero.y)).slice(0, s.amount);
        m.queue = s.amount;
        m.wait = 0;
        m.cd = s.cooldown;
        sfx.cast();
      }
    }
    if (m.queue > 0) {
      m.wait -= dt;
      if (m.wait <= 0) {
        fire(m, level, evolved);
        m.queue--;
        m.wait = F.spacing;
      }
    }
    m.bolts = m.bolts.filter((b) => fly(b, level, evolved, dt));
  },
  draw(memory, _level, evolved) {
    const m = memoryOf(memory);
    if (hero.state === "dead") return;
    place();
    for (const b of m.bolts) drawBolt(b, evolved);
    for (let i = 0; i * 2 < m.at.length && i < perches(evolved).length; i++)
      drawWisp(m.at[i * 2], m.at[i * 2 + 1], m.flare[i] ?? 0, m.t + i, evolved);
  },
};
