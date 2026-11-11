import { PAL, SPARKS } from "../../../constants/palette";
import { fleck, place } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { WHITE } from "../../../utils/color";
import { TAU } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { addStacks, consumeStacks, stacksOf } from "../../enemies/skillStatus";
import { drawGem } from "../../hero/kael/art/crystal";
import { game, particles, progress, rng } from "../../state";
import { skillValues, withCharms } from "../query";
import { foesOnScreen } from "../targets";
import { isLocked, lockFoe, pruneLock, type SpreadLock } from "./spreadLock";

const ID = "k_splinters";
/** seconds between splinter ticks; how far a full foe passes splinters on, and how often; how far a dying foe fires
 *  them; the most drawn on one foe, and the length and half width of a drawn splinter */
const SPLINTER = {
  every: 0.5,
  spreadReach: 30,
  spreadEvery: 1,
  burstReach: 40,
  drawn: 8,
  length: 2.8,
  half: 0.9,
} as const;

interface SplinterMemory {
  spreadT: number;
  lock: SpreadLock;
}

const memoryOf = (m: SkillMemory): SplinterMemory => m as unknown as SplinterMemory;

/** lodge `n` splinters in a foe, at Crystal Splinters' level; Crystal Harvest's tide lodges them too */
export function lodge(e: Enemy, n: number): void {
  const v = skillValues(ID);
  addStacks(e, ID, {
    stacks: n,
    max: Math.round(v.max),
    damage: progress.stats.ad * v.per * SPLINTER.every,
    every: SPLINTER.every,
    duration: withCharms("duration", v.life),
  });
}

/** a burst of crystal flecks from a foe */
function flecks(x: number, y: number, n: number): void {
  for (let i = 0; i < n; i++) {
    const a = rng.range(0, TAU);
    const sp = rng.range(60, 180);
    particles.spawn(PK.SHARD, x, y, Math.cos(a) * sp, Math.sin(a) * sp, rng.range(0.2, 0.45), {
      col: rng.pick(PAL.crystal.slice(3)),
      size: rng.range(1, 2),
    });
  }
}

/** Shatterstorm: the splinters in a foe burst out, cutting it and every foe around it */
function shatter(e: Enemy): void {
  const n = consumeStacks(e, ID);
  if (!n) return;
  const v = skillValues(ID);
  const [x, y] = enemyCenter(e);
  const reach = withCharms("area", v.shatterReach);
  flecks(x, y, 6 + n * 2);
  game.fx.push(createImpact(x, y, 1, true, SPARKS.crystal));
  const damage = progress.stats.ad * v.shatter * n;
  for (const f of foesOnScreen()) {
    const [fx, fy] = enemyCenter(f);
    if (f === e || Math.hypot(fx - x, fy - y) <= reach)
      dealDamage(f, damage, { fromX: x, kx: Math.sign(fx - x) * 60, source: ID });
  }
}

/** a foe full of splinters passes one to each foe beside it */
function spread(m: SplinterMemory): void {
  const v = skillValues(ID);
  for (const e of foesOnScreen()) {
    if (stacksOf(e, ID) < v.max || isLocked(m.lock, e)) continue;
    const [x, y] = enemyCenter(e);
    for (const f of foesOnScreen()) {
      if (f === e || Math.hypot(enemyCenter(f)[0] - x, enemyCenter(f)[1] - y) > SPLINTER.spreadReach) continue;
      lodge(f, 1);
      lockFoe(m.lock, f);
    }
  }
}

/** a foe that died with splinters in it fires them at the foes nearest it */
function burst(m: SplinterMemory, e: Enemy): void {
  const v = skillValues(ID);
  const n = stacksOf(e, ID);
  if (!v.burst || !n || isLocked(m.lock, e)) return;
  const [x, y] = enemyCenter(e);
  const near = foesOnScreen()
    .filter((f) => f !== e && Math.hypot(enemyCenter(f)[0] - x, enemyCenter(f)[1] - y) <= SPLINTER.burstReach)
    .sort((a, b) => Math.abs(a.x - x) - Math.abs(b.x - x));
  flecks(x, y, n * 2);
  if (!near.length) return;
  for (let i = 0; i < n; i++) {
    const f = near[i % near.length];
    dealDamage(f, progress.stats.ad * v.burst, { fromX: x, kx: Math.sign(f.x - x) * 30, source: ID });
    lodge(f, 1);
    lockFoe(m.lock, f);
  }
}

/** the splinters stuck in a foe: small crystal shards jutting from its body, more as they build */
function drawSplinters(e: Enemy): void {
  const n = Math.min(SPLINTER.drawn, stacksOf(e, ID));
  if (!n) return;
  const [x, y] = enemyCenter(e);
  const C = PAL.crystal;
  for (let i = 0; i < n; i++) {
    const a = (i / SPLINTER.drawn) * TAU + e.seed;
    const r = 5 + (i % 3);
    const sx = x + Math.cos(a) * r;
    const sy = y + Math.sin(a) * r * 0.8;
    drawGem(sx + Math.cos(a) * 1.5, sy + Math.sin(a) * 1.5, SPLINTER.length, SPLINTER.half, a, C);
    fleck(sx + Math.cos(a) * (1.5 + SPLINTER.length), sy + Math.sin(a) * (1.5 + SPLINTER.length), WHITE);
  }
}

/** Crystal Splinters: sword blows lodge splinters that bleed; a full foe passes them on, a dying one fires them, and as
 *  Shatterstorm the finisher and Keen blows burst them */
export const crystalSplinters: SkillBehavior = {
  create: () => ({ spreadT: 0, lock: new Map() }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    pruneLock(m.lock);
    if (!skillValues(ID).spread) return;
    m.spreadT -= dt;
    if (m.spreadT > 0) return;
    m.spreadT = SPLINTER.spreadEvery;
    spread(m);
  },
  draw() {
    place();
    for (const e of foesOnScreen()) drawSplinters(e);
  },
  on: {
    blow(_memory, ev, state) {
      if (ev.source !== "attacks") return;
      const v = skillValues(ID);
      if (state.evolved && (ev.finisher || ev.keen)) shatter(ev.foe);
      if (ev.foe.hp <= 0) return;
      const n = Math.max(ev.crit ? v.crit : 1, ev.finisher ? v.finisher : 1);
      lodge(ev.foe, n);
    },
    kill(memory, ev) {
      burst(memoryOf(memory), ev.foe);
    },
  },
};
