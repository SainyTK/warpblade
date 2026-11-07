import { EMBER } from "../../../constants/characters/ysra/look";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { drawPhoenix } from "../../effects/phoenix";
import { ignite } from "../../enemies/burn";
import { enemyCenter } from "../../enemies/enemy";
import { buffs } from "../../hero/ysra/buffs";
import { burstEmbers } from "../../spells/rites/emberBurst";
import { game, hero, particles, progress, rng } from "../../state";
import { skillEvolved, skillValues, withCharms } from "../query";
import { nearestFoe } from "../targets";
import { attackerAt, memoryAs } from "./memory";

const ID = "y_hawk";
/** the hawk's size against the phoenix, its height while it circles, its speed diving and climbing, and how close a
 *  dive must come */
const SIZE = 0.35;
const CIRCLE = 46;
const SPEED = 260;
const STRIKE = 6;
/** Sunflock's hawks spread around the attacker this far before they dive */
const FLOCK_SPREAD = 30;

interface Hawk {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** the foe it dives at now, or null while it climbs back up to circle */
  prey: Enemy | null;
  /** dives left (0 when it hunts by time), seconds left to hunt, seconds to its next dive */
  dives: number;
  life: number;
  wait: number;
}

interface HawkMemory {
  cd: number;
  hawks: Hawk[];
}

/** a hawk swoops down out of the sky over her toward its first prey */
function call(m: HawkMemory, prey: Enemy | null, from = hero.x): void {
  const v = skillValues(ID);
  const most = v.most ?? 1;
  if (m.hawks.length >= most) m.hawks.shift();
  const life = v.life ? withCharms("duration", v.life) : 0;
  m.hawks.push({ x: from, y: hero.y - CIRCLE - 20, vx: 0, vy: 0, prey, dives: v.dives, life, wait: 0 });
}

/** the dive lands: the blow, a burn, a burst, sparks */
function strike(h: Hawk, e: Enemy): void {
  const v = skillValues(ID);
  const [cx, cy] = enemyCenter(e);
  dealDamage(e, progress.stats.ad * v.power, { fromX: h.x, kx: Math.sign(h.vx) * 60, source: ID });
  if (v.burn) ignite(e, v.burn);
  if (v.burst) burstEmbers(cx, cy, progress.stats.ad * v.power * 0.5, v.burst, 1, ID);
  game.fx.push(createImpact(cx, cy, Math.sign(h.vx) || 1, true));
  for (let i = 0; i < 8; i++)
    particles.spawn(PK.SPARK, cx, cy, rng.range(-120, 120), -rng.range(40, 160), 0.3, {
      sparks: [EMBER[6], EMBER[5], EMBER[4]],
    });
}

/** fly toward a point at the hawk's speed */
function toward(h: Hawk, x: number, y: number, dt: number): number {
  const dx = x - h.x;
  const dy = y - h.y;
  const d = Math.hypot(dx, dy) || 1;
  h.vx = (dx / d) * SPEED;
  h.vy = (dy / d) * SPEED;
  h.x += h.vx * dt;
  h.y += h.vy * dt;
  return d;
}

/** dive at the prey, climb back to circle over her, pick the next prey; false once its dives or time are spent */
function fly(h: Hawk, dt: number): boolean {
  const v = skillValues(ID);
  if (h.life) h.life -= dt;
  h.wait -= dt;
  if (h.prey && h.prey.hp > 0) {
    const [cx, cy] = enemyCenter(h.prey);
    if (toward(h, cx, cy, dt) < STRIKE) {
      strike(h, h.prey);
      h.prey = null;
      if (!h.life) h.dives--;
      h.wait = v.every;
    }
    return true;
  }
  h.prey = null;
  toward(h, hero.x + Math.sin(game.t * 2) * 20, hero.y - CIRCLE, dt);
  const done = h.life ? h.life <= 0 : h.dives <= 0;
  if (done) return false;
  if (h.wait <= 0) h.prey = nearestFoe(h.x, h.y);
  return true;
}

/** Sunflock: a parry calls five hawks that dive the attacker together, then hunt */
function flock(m: HawkMemory, prey: Enemy | null): void {
  const v = skillValues(ID);
  for (let i = 0; i < v.flock; i++) call(m, prey, hero.x + (i - (v.flock - 1) / 2) * FLOCK_SPREAD * 0.4);
}

/** Sun Hawk: a parry (and from its level 5 a block) may call a hawk of fire that dives the attacker, then the foes
 *  nearest it; evolved, a flock that also shields her while two or more fly */
export const sunHawk: SkillBehavior = {
  create: () => ({ cd: 0, hawks: [] }),
  update(memory, _state, dt) {
    const m = memoryAs<HawkMemory>(memory);
    m.cd = Math.max(0, m.cd - dt);
    m.hawks = m.hawks.filter((h) => fly(h, dt));
    buffs.guard = skillEvolved(ID) && m.hawks.length >= 2 ? (skillValues(ID).guard ?? 0) : 0;
  },
  draw(memory) {
    for (const h of memoryAs<HawkMemory>(memory).hawks) {
      const d = Math.hypot(h.vx, h.vy) || 1;
      const diving = !!h.prey;
      drawPhoenix(h.x, h.y, h.vx / d || 1, h.vy / d, diving ? 0.3 : 1, game.t * (diving ? 10 : 22), SIZE);
    }
  },
  on: {
    parry(memory, { fromX }) {
      const m = memoryAs<HawkMemory>(memory);
      const v = skillValues(ID);
      if (m.cd > 0 || !rng.chance(v.chance)) return;
      m.cd = withCharms("cooldown", v.cooldown);
      const prey = attackerAt(fromX);
      if (skillEvolved(ID)) flock(m, prey);
      else call(m, prey);
    },
    block(memory, { fromX }) {
      const m = memoryAs<HawkMemory>(memory);
      const v = skillValues(ID);
      if (m.cd > 0 || !v.block || !rng.chance(v.block)) return;
      m.cd = withCharms("cooldown", v.cooldown);
      call(m, attackerAt(fromX));
    },
  },
};
