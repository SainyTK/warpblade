import { RAVEN, RAVEN_STORM } from "../../../constants/brannoc/skills";
import { SPARKS } from "../../../constants/palette";
import { place } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { TAU } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { drawRaven } from "../../effects/brannoc/raven";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { staggerFoe } from "../../enemies/stagger";
import { repay } from "../../hero/brannoc/debt";
import { game, hero, progress, rng } from "../../state";
import { skillValues, withCharms } from "../query";
import { nearestFoe, touches } from "../targets";
import { type FoeGate, passGate, tickGate } from "./foeGate";

const ID = "b_ravens";
/** his shoulders, where the ravens take off from, in px above his feet */
const SHOULDERS = 26;
/** wing beats a second */
const FLAP = 14;

interface Raven {
  x: number;
  y: number;
  vx: number;
  vy: number;
  target: Enemy | null;
  /** the foes its flock has blinded, so a flock blinds each foe once */
  flock: Set<Enemy>;
  struck: boolean;
  /** seconds since it took off, and since it struck and began to fly off */
  t: number;
  gone: number;
}

/** Carrion Storm: seconds the cloud still circles him, and how far round it has turned */
interface Storm {
  left: number;
  angle: number;
}

interface RavensMemory {
  cd: number;
  ravens: Raven[];
  storm: Storm | null;
  gate: FoeGate;
  t: number;
}

const memoryOf = (m: SkillMemory): RavensMemory => m as unknown as RavensMemory;

/** a raven's strike: its damage, the blind once per flock, and the repay its level gives */
function strike(r: Raven, e: Enemy): void {
  const v = skillValues(ID);
  const dir = Math.sign(r.vx) || 1;
  const result = dealDamage(e, progress.stats.ad * (v.power ?? 0), { fromX: r.x, kx: dir * RAVEN.knock, source: ID });
  if (result === "blocked") return;
  const [cx, cy] = enemyCenter(e);
  game.fx.push(createImpact(cx, cy, dir, false, SPARKS.rage));
  if (v.blind && e.hp > 0 && !r.flock.has(e)) {
    r.flock.add(e);
    staggerFoe(e, v.blind);
    e.blind = Math.max(e.blind, v.blind);
  }
  if (v.repay) repay(v.repay, e);
}

/** a raven steers at its foe and strikes it, then flies off up and away; false once it is gone */
function fly(r: Raven, dt: number): boolean {
  r.t += dt;
  if (!r.struck && (!r.target || r.target.hp <= 0)) r.target = nearestFoe(r.x, r.y);
  if (!r.struck && (!r.target || r.t > RAVEN.life)) r.struck = true;
  if (r.struck) {
    r.gone += dt;
    r.vy -= RAVEN.speed * dt;
  } else if (r.target) {
    const [cx, cy] = enemyCenter(r.target);
    const dx = cx - r.x;
    const dy = cy - r.y;
    const d = Math.max(1, Math.hypot(dx, dy));
    const k = Math.min(1, RAVEN.turn * dt);
    r.vx += ((dx / d) * RAVEN.speed - r.vx) * k;
    r.vy += ((dy / d) * RAVEN.speed - r.vy) * k;
    if (d <= RAVEN.touch) {
      strike(r, r.target);
      r.struck = true;
      r.vx = Math.sign(r.vx || 1) * RAVEN.speed * 0.5;
      r.vy = -RAVEN.speed * 0.6;
    }
  }
  r.x += r.vx * dt;
  r.y += r.vy * dt;
  return r.gone < RAVEN.leave;
}

/** a raven taking off from his shoulders toward its foe, flung out a little to the side first */
function raven(target: Enemy, flock: Set<Enemy>): Raven {
  const a = rng.range(-2.6, -0.5);
  return {
    x: hero.x + rng.range(-4, 4),
    y: hero.y - SHOULDERS,
    vx: Math.cos(a) * RAVEN.speed * 0.6,
    vy: Math.sin(a) * RAVEN.speed * 0.6,
    target,
    flock,
    struck: false,
    t: 0,
    gone: 0,
  };
}

/** where each raven of the cloud is, and whether it is on the near side of him */
function stormSpots(s: Storm): { x: number; y: number; near: boolean; face: number }[] {
  const r = withCharms("area", RAVEN_STORM.radius);
  return Array.from({ length: RAVEN_STORM.ravens }, (_, i) => {
    const g = s.angle + (i / RAVEN_STORM.ravens) * TAU;
    const wobble = Math.sin(s.angle * 3 + i * 1.7) * 4;
    return {
      x: hero.x + Math.cos(g) * (r + wobble),
      y: hero.y - SHOULDERS + 6 + Math.sin(g) * r * RAVEN_STORM.squash + wobble * 0.5,
      near: Math.sin(g) >= 0,
      face: Math.sin(g) >= 0 ? 1 : -1,
    };
  });
}

/** Carrion Storm: the cloud turns round him and strikes each foe it passes, each foe at most so often */
function circle(m: RavensMemory, s: Storm, dt: number): void {
  s.left -= dt;
  s.angle += TAU * RAVEN_STORM.turns * dt;
  if (s.left <= 0) {
    m.storm = null;
    return;
  }
  const power = progress.stats.ad * (skillValues(ID).power ?? 0);
  for (const spot of stormSpots(s))
    for (const e of game.enemies) {
      if (e.hp <= 0 || !touches(e, spot.x, spot.y, RAVEN.touch)) continue;
      if (!passGate(m.gate, e, RAVEN_STORM.every)) continue;
      const dir = Math.sign(enemyCenter(e)[0] - hero.x) || hero.face;
      if (dealDamage(e, power, { fromX: spot.x, kx: dir * RAVEN.knock, source: ID }) === "blocked") continue;
      const [cx, cy] = enemyCenter(e);
      game.fx.push(createImpact(cx, cy, dir, false, SPARKS.rage));
    }
}

function drawStorm(m: RavensMemory, near: boolean): void {
  if (!m.storm) return;
  place();
  const fade = Math.min(1, m.storm.left / 0.4);
  stormSpots(m.storm).forEach((s, i) => {
    if (s.near === near) drawRaven(s.x, s.y, s.face, m.t * FLAP + i, fade * (near ? 1 : 0.7));
  });
}

/**
 * Carrion Ravens: a blow taken may send ravens from his shoulders at the foe nearest where it came from; with its
 * levels they blind it, strike harder, come four at a time, more often, and each strike repays the debt. Carrion Storm
 * also raises a cloud of ravens that circles him, striking every foe it passes.
 */
export const carrionRavensSkill: SkillBehavior = {
  create: () => ({ cd: 0, ravens: [], storm: null, gate: new Map(), t: 0 }),
  update(memory, _s, dt) {
    const m = memoryOf(memory);
    m.t += dt;
    m.cd = Math.max(0, m.cd - dt);
    tickGate(m.gate, dt);
    m.ravens = m.ravens.filter((r) => fly(r, dt));
    if (m.storm) circle(m, m.storm, dt);
  },
  drawBack(memory) {
    drawStorm(memoryOf(memory), false);
  },
  draw(memory) {
    const m = memoryOf(memory);
    place();
    for (const r of m.ravens) drawRaven(r.x, r.y, Math.sign(r.vx) || 1, m.t * FLAP + r.x, 1 - r.gone / RAVEN.leave);
    drawStorm(m, true);
  },
  on: {
    hurt(memory, event) {
      const m = memoryOf(memory);
      if (m.cd > 0) return;
      const v = skillValues(ID);
      if (!rng.chance(v.chance ?? 0)) return;
      m.cd = RAVEN.cooldown;
      if (v.storm) m.storm = { left: withCharms("duration", v.storm), angle: m.storm?.angle ?? 0 };
      const target = nearestFoe(event.fromX, hero.y - 16);
      if (!target) return;
      const flock = new Set<Enemy>();
      const count = Math.round(withCharms("amount", v.count ?? 2));
      for (let i = 0; i < count; i++) m.ravens.push(raven(target, flock));
    },
  },
};
