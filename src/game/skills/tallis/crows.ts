import { PAL } from "../../../constants/palette";
import { glow, place, px } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { TAU } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { enemyCenter } from "../../enemies/enemy";
import { hero, progress, rng } from "../../state";
import { skillValues, withCharms } from "../query";
import { nearestFoe } from "../targets";

const ID = "t_crows";
/** a crow's dive speed, how near a dive strikes, its circle round him and seconds between its dives */
const CROW = { speed: 190, reach: 5, orbit: 18, every: 0.7, life: 4 } as const;

interface Crow {
  x: number;
  y: number;
  target: Enemy | null;
  /** seconds it circles him after its first dive, and until its next dive */
  stay: number;
  next: number;
  phase: number;
  dived: boolean;
  t: number;
}

interface CrowMemory {
  crows: Crow[];
  cd: number;
}

const memoryOf = (m: SkillMemory): CrowMemory => m as unknown as CrowMemory;

/** a crow strikes: attack damage, and a blind with its level */
function peck(c: Crow, e: Enemy): void {
  const v = skillValues(ID);
  dealDamage(e, progress.stats.ad * v.power, { fromX: c.x, source: ID });
  if (v.blind && e.rank === "minion") e.blind = Math.max(e.blind, v.blind);
  c.next = CROW.every;
}

/** false once it has dived and has no time left to circle */
function fly(c: Crow, dt: number): boolean {
  c.t += dt;
  c.next -= dt;
  if (c.dived) c.stay -= dt;
  if (c.dived && c.stay <= 0) return false;
  if (!c.target || c.target.hp <= 0) c.target = c.next <= 0 ? nearestFoe(c.x, c.y) : null;
  let tx: number;
  let ty: number;
  if (c.target) [tx, ty] = enemyCenter(c.target);
  else {
    const a = c.phase + c.t * 2.5;
    tx = hero.x + Math.cos(a) * CROW.orbit;
    ty = hero.y - 30 + Math.sin(a) * 5;
  }
  const dx = tx - c.x;
  const dy = ty - c.y;
  const d = Math.hypot(dx, dy) || 1;
  const step = Math.min(d, CROW.speed * dt);
  c.x += (dx / d) * step;
  c.y += (dy / d) * step;
  if (c.target && d <= CROW.reach && c.next <= 0) {
    peck(c, c.target);
    c.dived = true;
    c.target = null;
  }
  return c.t < CROW.life + c.stay;
}

/** a flock leaves his shoulders */
function release(m: CrowMemory): void {
  const v = skillValues(ID);
  const n = Math.round(withCharms("amount", v.count));
  for (let i = 0; i < n; i++)
    m.crows.push({
      x: hero.x + rng.range(-6, 6),
      y: hero.y - 24 - rng.range(0, 6),
      target: null,
      stay: withCharms("duration", v.circle ?? 0),
      next: i * 0.06,
      phase: (i / n) * TAU,
      dived: false,
      t: 0,
    });
}

/**
 * Gloam Crows: a blow from behind may send crows diving at foes; with its levels more often, more of them, blinding,
 * and they circle him to dive again. Murder of Crows sends a flock with every cast on I.
 */
export const crowsSkill: SkillBehavior = {
  create: () => ({ crows: [], cd: 0 }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
    m.crows = m.crows.filter((c) => fly(c, dt));
  },
  draw(memory) {
    place();
    for (const c of memoryOf(memory).crows) {
      const flap = Math.floor(c.t * 16 + c.phase) % 2;
      const x = Math.round(c.x);
      const y = Math.round(c.y);
      px(x, y, PAL.gloam[1]);
      px(x - 1, y - flap, PAL.gloam[1]);
      px(x + 1, y - flap, PAL.gloam[1]);
      px(x, y - 1, PAL.gloam[5]);
      glow(c.x, c.y, 4, PAL.gloam[3], 0.2);
    }
  },
  on: {
    backstab(memory) {
      const m = memoryOf(memory);
      const v = skillValues(ID);
      if (m.cd > 0 || !rng.chance(v.chance)) return;
      m.cd = withCharms("cooldown", v.cooldown ?? 2);
      release(m);
    },
    cast(memory, event) {
      const onI = event.ability === "smokeKnot" || event.ability === "hamstring" || event.ability.startsWith("t_");
      if (skillValues(ID).murder && onI) release(memoryOf(memory));
    },
  },
};
