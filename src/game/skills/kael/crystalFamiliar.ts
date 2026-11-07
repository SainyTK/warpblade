import { PAL } from "../../../constants/palette";
import { circle, glow, hairline, place, px } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { WHITE } from "../../../utils/color";
import { dealDamage } from "../../damage";
import { enemyCenter } from "../../enemies/enemy";
import { markFoe } from "../../enemies/skillStatus";
import { hero, progress, rng } from "../../state";
import { skillValues, withCharms } from "../query";
import { nearestFoe, touches } from "../targets";

const ID = "k_familiar";
/** flight speed and turn rate of a shard, how long it lives, how close it must come, and how hard it knocks */
const SHARD = { speed: 190, turn: 9, life: 1.6, reach: 3, kick: 50 } as const;

interface Shard {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  target: Enemy | null;
  struck: Enemy[];
}

interface FamiliarMemory {
  /** seconds until shards may be called again */
  cd: number;
  shards: Shard[];
}

const memoryOf = (m: SkillMemory): FamiliarMemory => m as unknown as FamiliarMemory;

/** shards burst from over the hero's shoulder, each aimed at the nearest foe */
function call(m: FamiliarMemory): void {
  const v = skillValues(ID);
  const count = Math.round(withCharms("amount", v.shards));
  for (let i = 0; i < count; i++) {
    const a = -Math.PI / 2 + rng.range(-0.9, 0.9);
    const x = hero.x - hero.face * 6;
    const y = hero.y - 30;
    m.shards.push({ x, y, vx: Math.cos(a) * 80, vy: Math.sin(a) * 80, life: SHARD.life, target: null, struck: [] });
  }
  m.cd = withCharms("cooldown", v.cooldown);
}

/** turn toward a foe, fly, strike what it touches; false once spent */
function fly(s: Shard, dt: number): boolean {
  const v = skillValues(ID);
  s.life -= dt;
  if (!s.target || s.target.hp <= 0) s.target = nearestFoe(s.x, s.y, s.struck);
  const speed = withCharms("speed", SHARD.speed);
  if (s.target) {
    const [tx, ty] = enemyCenter(s.target);
    const now = Math.atan2(s.vy, s.vx);
    const want = Math.atan2(ty - s.y, tx - s.x) - now;
    const turn = Math.atan2(Math.sin(want), Math.cos(want));
    const a = now + Math.max(-SHARD.turn * dt, Math.min(SHARD.turn * dt, turn));
    s.vx = Math.cos(a) * speed;
    s.vy = Math.sin(a) * speed;
  }
  s.x += s.vx * dt;
  s.y += s.vy * dt;
  if (!s.target || !touches(s.target, s.x, s.y, SHARD.reach)) return s.life > 0;
  const foe = s.target;
  dealDamage(foe, progress.stats.ad * v.power, { source: ID, fromX: s.x, kx: Math.sign(s.vx) * SHARD.kick });
  if (v.mark) markFoe(foe, withCharms("duration", v.markTime), v.mark);
  s.struck.push(foe);
  s.target = null;
  return s.struck.length < v.pierce && s.life > 0;
}

function drawShard(s: Shard, evolved: boolean): void {
  const c = PAL.crystal;
  hairline(s.x, s.y, s.x - s.vx * 0.03, s.y - s.vy * 0.03, c[2], 0.6);
  circle(s.x, s.y, 1.3, c[3]);
  px(s.x - 0.5, s.y - 0.5, evolved ? WHITE : c[5]);
  glow(s.x, s.y, evolved ? 7 : 5, c[3], 0.4);
}

/** Crystal Familiar: a landed blow may call homing crystal shards; evolved, they pierce more and mark foes */
export const crystalFamiliar: SkillBehavior = {
  create: () => ({ cd: 0, shards: [] }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
    m.shards = m.shards.filter((s) => fly(s, dt));
  },
  draw(memory, state) {
    place();
    for (const s of memoryOf(memory).shards) drawShard(s, state.evolved);
  },
  on: {
    blow(memory) {
      const m = memoryOf(memory);
      if (m.cd <= 0 && rng.chance(skillValues(ID).chance)) call(m);
    },
  },
};
