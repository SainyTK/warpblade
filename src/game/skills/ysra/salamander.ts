import { EMBER } from "../../../constants/characters/ysra/look";
import { W } from "../../../constants/stage";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { enemyBox } from "../../enemies/enemy";
import { kindOf } from "../../enemies/kinds";
import { layCinder } from "../../spells/rites/cinder";
import { burstEmbers } from "../../spells/rites/emberBurst";
import { game, hero, lights, particles, progress, rng } from "../../state";
import { boxHit, surfaceBelow } from "../../world";
import { skillEvolved, skillValues, withCharms } from "../query";
import { memoryAs } from "./memory";
import { drawSalamander } from "./salamanderBody";

const ID = "y_salamander";
/** pixels a second it runs, how close a foe must be to be bitten, its trail's spacing, and its leap at flyers */
const RUN = 90;
const BITE_REACH = 8;
const TRAIL_STEP = 12;
const LEAP = { reach: 50, rise: 260, gravity: 700 } as const;
/** the burst when it ends, and the Magma Drake's walk behind her and its breath */
const BURST_RADIUS = 30;
const DRAKE = { behind: 30, every: 1, flame: 0.35 } as const;

interface Salamander {
  x: number;
  y: number;
  vy: number;
  face: number;
  life: number;
  bite: number;
  lastTrail: number;
  stride: number;
  open: number;
}

interface SalamanderMemory {
  cd: number;
  runners: Salamander[];
  /** Magma Drake: seconds it still walks with her, to its next breath, and the breath still burning */
  drake: number;
  breath: number;
  flame: number;
}

const foeAt = (s: Salamander, reach: number): Enemy | null =>
  game.enemies.find((e) => e.hp > 0 && boxHit(enemyBox(e), [s.x - reach, s.y - 14, s.x + reach, s.y + 1])) ?? null;

/** a flyer within leaping reach over it */
const flyerOver = (s: Salamander): Enemy | null =>
  game.enemies.find((e) => e.hp > 0 && kindOf(e.type).flies && Math.abs(e.x - s.x) < 10 && s.y - e.y < LEAP.reach) ??
  null;

/** salamanders scurry out from here, the first ahead of her and the second behind */
function release(m: SalamanderMemory, x: number, y: number): void {
  const v = skillValues(ID);
  const faces = [hero.face, -hero.face].slice(0, v.count);
  const life = withCharms("duration", v.life);
  for (const face of faces)
    m.runners.push({ x, y: surfaceBelow(x, y - 2), vy: 0, face, life, bite: 0, lastTrail: x, stride: 0, open: 0 });
}

function bite(s: Salamander, e: Enemy): void {
  dealDamage(e, progress.stats.ap * skillValues(ID).bite, { fromX: s.x, kx: s.face * 40, source: ID });
  s.bite = skillValues(ID).every;
  s.open = 1;
  for (let i = 0; i < 5; i++)
    particles.spawn(PK.SPARK, s.x + s.face * 6, s.y - 4, rng.range(-60, 60), -rng.range(20, 90), 0.25, {
      sparks: [EMBER[6], EMBER[5], EMBER[4]],
    });
}

/** run, bite what is in front, leap at a flyer overhead, and lay a burning trail; false once it is spent */
function run(s: Salamander, dt: number): boolean {
  const v = skillValues(ID);
  s.life -= dt;
  s.bite -= dt;
  s.open = Math.max(0, s.open - dt * 6);
  const floor = surfaceBelow(s.x, s.y - 2);
  const foe = foeAt(s, BITE_REACH);
  if (s.y < floor || s.vy < 0) {
    s.vy += LEAP.gravity * dt;
    s.y = Math.min(floor, s.y + s.vy * dt);
    if (s.y >= floor) s.vy = 0;
  } else if (v.flyers && flyerOver(s)) s.vy = -LEAP.rise;
  if (foe) {
    if (s.bite <= 0) bite(s, foe);
  } else {
    s.x += s.face * RUN * dt;
    s.stride += dt * 6;
  }
  if (v.trail && Math.abs(s.x - s.lastTrail) >= TRAIL_STEP && s.y >= floor) {
    s.lastTrail = s.x;
    layCinder(s.x, floor, { life: 2, power: v.trail, halfWidth: 4, overlap: 1, stagger: 0, source: ID });
  }
  const out = s.life <= 0 || s.x < 4 || s.x > W - 4;
  if (out && v.burst) burstEmbers(s.x, s.y - 4, progress.stats.ap * v.burst, BURST_RADIUS, 1.5, ID);
  return !out;
}

/** Magma Drake: it walks behind her and breathes fire along the floor ahead every second */
function drakeBreath(m: SalamanderMemory, dt: number): void {
  const v = skillValues(ID);
  m.drake = Math.max(0, m.drake - dt);
  m.flame = Math.max(0, m.flame - dt);
  if (m.drake <= 0) return;
  m.breath -= dt;
  if (m.breath > 0) return;
  m.breath = DRAKE.every;
  m.flame = DRAKE.flame;
  const x0 = hero.x - hero.face * DRAKE.behind;
  const x1 = x0 + hero.face * (v.range + DRAKE.behind);
  const box: [number, number, number, number] = [Math.min(x0, x1), hero.y - 16, Math.max(x0, x1), hero.y];
  for (const e of game.enemies)
    if (e.hp > 0 && boxHit(box, enemyBox(e)))
      dealDamage(e, progress.stats.ap * v.breath, { fromX: x0, kx: hero.face * 60, source: ID });
  lights.add((x0 + x1) / 2, hero.y - 8, 60, EMBER[4], 0.7, DRAKE.flame);
  for (let i = 0; i < 30; i++)
    particles.spawn(
      PK.FIRE,
      x0 + hero.face * rng.range(4, v.range),
      hero.y - rng.range(1, 12),
      hero.face * rng.range(40, 140),
      -rng.range(5, 40),
      rng.range(0.2, 0.4),
      {
        col: 0,
        size: rng.range(1.2, 2.4),
      },
    );
}

/** Salamander: a rite (or Forge Altar) may call fire salamanders that run along the floor biting; evolved, a rite calls
 *  the Magma Drake to walk with her */
export const salamander: SkillBehavior = {
  create: () => ({ cd: 0, runners: [], drake: 0, breath: 0, flame: 0 }),
  update(memory, _state, dt) {
    const m = memoryAs<SalamanderMemory>(memory);
    m.cd = Math.max(0, m.cd - dt);
    m.runners = m.runners.filter((s) => run(s, dt));
    drakeBreath(m, dt);
  },
  draw(memory) {
    const m = memoryAs<SalamanderMemory>(memory);
    for (const s of m.runners) drawSalamander(s.x, s.y, s.face, s.stride, 1, s.open > 0 ? 1 : 0);
    if (m.drake > 0)
      drawSalamander(hero.x - hero.face * DRAKE.behind, hero.y, hero.face, game.t * 2, 2, m.flame > 0 ? 1 : 0);
  },
  on: {
    cast(memory) {
      const m = memoryAs<SalamanderMemory>(memory);
      const v = skillValues(ID);
      if (m.cd > 0 || !rng.chance(v.chance)) return;
      m.cd = withCharms("cooldown", v.cooldown);
      if (skillEvolved(ID)) {
        m.drake = withCharms("duration", v.drake);
        m.breath = 0;
      } else release(m, hero.x, hero.y);
    },
    altar(memory, { x, y }) {
      release(memoryAs(memory), x, y);
    },
  },
};
