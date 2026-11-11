import { PAL } from "../../../constants/palette";
import { FLAME_LETTERS, LAMPFLY_ART } from "../../../constants/wenna/stamps";
import { glow, place } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { TAU } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { stampPixels } from "../../effects/fine";
import { enemyCenter } from "../../enemies/enemy";
import { hero, progress, rng } from "../../state";
import { skillValues, withCharms } from "../query";
import { nearestFoe } from "../targets";

const ID = "w_lampflies";
/** a lampfly's dart speed, how near a strike lands, its orbit round her while it stays, and seconds between strikes */
const FLY = { speed: 200, reach: 4, orbit: 20, strikeEvery: 0.5, seek: 60 } as const;

interface Lampfly {
  x: number;
  y: number;
  target: Enemy | null;
  /** seconds it stays circling her after its dart, and seconds until its next strike */
  stay: number;
  next: number;
  /** its place round the orbit */
  phase: number;
  /** it has struck its first foe */
  darted: boolean;
  t: number;
}

interface LampflyMemory {
  flies: Lampfly[];
  cd: number;
}

const memoryOf = (m: SkillMemory): LampflyMemory => m as unknown as LampflyMemory;

/** a lampfly strikes: a little ability power, and a chill with its level */
function sting(f: Lampfly, e: Enemy): void {
  const v = skillValues(ID);
  dealDamage(e, progress.stats.ap * v.power, { fromX: f.x, source: ID });
  if (v.chill) e.chill = Math.max(e.chill, 0.8);
  f.next = FLY.strikeEvery;
}

/** false once it has darted and has no time left to circle */
function flit(f: Lampfly, dt: number): boolean {
  f.t += dt;
  f.next -= dt;
  if (f.darted) f.stay -= dt;
  if (f.darted && f.stay <= 0) return false;
  if (!f.target || f.target.hp <= 0) {
    const near = nearestFoe(f.x, f.y);
    const close = near && Math.hypot(enemyCenter(near)[0] - hero.x, enemyCenter(near)[1] - hero.y) < FLY.seek;
    f.target = !f.darted || close ? near : null;
  }
  let tx: number;
  let ty: number;
  if (f.target) [tx, ty] = enemyCenter(f.target);
  else {
    const a = f.phase + f.t * 3;
    tx = hero.x + Math.cos(a) * FLY.orbit;
    ty = hero.y - 22 + Math.sin(a) * FLY.orbit * 0.4;
  }
  const dx = tx - f.x;
  const dy = ty - f.y;
  const d = Math.hypot(dx, dy) || 1;
  const step = Math.min(d, FLY.speed * dt);
  f.x += (dx / d) * step + Math.sin(f.t * 20 + f.phase) * 0.4;
  f.y += (dy / d) * step;
  if (f.target && d <= FLY.reach + 6 && f.next <= 0) {
    sting(f, f.target);
    f.darted = true;
    f.target = null;
  }
  return f.t < 6;
}

/** a swarm of lampflies leaves her lamp */
function release(m: LampflyMemory): void {
  const v = skillValues(ID);
  const n = Math.round(withCharms("amount", v.count));
  for (let i = 0; i < n; i++)
    m.flies.push({
      x: hero.x + hero.face * 8,
      y: hero.y - 22,
      target: null,
      stay: withCharms("duration", v.stay ?? 0),
      next: i * 0.05,
      phase: (i / n) * TAU,
      darted: false,
      t: 0,
    });
}

/**
 * Lampflies: a blow of her lamp may loose a swarm of small flame moths that dart at foes; with its levels more often,
 * more of them, chilling, and they stay circling her. Lantern Swarm looses one on every cast on I.
 */
export const lampfliesSkill: SkillBehavior = {
  create: () => ({ flies: [], cd: 0 }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
    m.flies = m.flies.filter((f) => flit(f, dt));
  },
  draw(memory) {
    place();
    for (const f of memoryOf(memory).flies) {
      const beat = Math.floor(f.t * 14 + f.phase) % LAMPFLY_ART.length;
      stampPixels(LAMPFLY_ART[beat], f.x, f.y, FLAME_LETTERS);
      glow(f.x, f.y, 4, PAL.wick[3], 0.3);
    }
  },
  on: {
    blow(memory, event) {
      if (event.source !== "attacks" || !event.melee) return;
      const m = memoryOf(memory);
      const v = skillValues(ID);
      if (m.cd > 0 || !rng.chance(v.chance)) return;
      m.cd = withCharms("cooldown", v.cooldown ?? 2);
      release(m);
    },
    cast(memory, event) {
      const ability = event.ability;
      const onI = ability === "kindle" || ability === "beckon" || ability.startsWith("w_");
      if (!skillValues(ID).swarm || !onI) return;
      release(memoryOf(memory));
    },
  },
};
