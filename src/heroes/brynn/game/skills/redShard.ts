import { fleck, glow, place, polygon } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { markFoe } from "../../../../game/enemies/skillStatus";
import { skillEvolved, skillValues, withCharms } from "../../../../game/skills/query";
import { nearestFoe } from "../../../../game/skills/targets";
import { game, hero, progress, rng } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { WHITE } from "../../../../utils/color";
import { TAU } from "../../../../utils/math";
import { CRIMSON, CRIMSON_SPARKS } from "../../constants/colors";

const ID = "br_shard";
/** seconds a shard's mark lasts */
const MARK_TIME = 2;
/** a shard's speed, how near it must come, how far it looks for foes, its rest round her and how fast it circles */
const SHARD = { speed: 230, reach: 4, sight: 110, orbit: 14, spin: 3, rest: 0.18, size: 1.6 } as const;

interface Shard {
  x: number;
  y: number;
  left: number;
  wait: number;
  target: Enemy | null;
  angle: number;
  /** a Shard Halo shard, which circles her for good */
  halo: boolean;
}

const shardsOf = (m: SkillMemory): Shard[] => m.shards as Shard[];

/** where a shard rests: circling her shoulders */
function restAt(s: Shard, t: number): [number, number] {
  const a = s.angle + t * SHARD.spin;
  return [hero.x + Math.cos(a) * SHARD.orbit, hero.y - 24 + Math.sin(a) * SHARD.orbit * 0.5];
}

/** a new shard chipped off the crystal at her blade */
function chip(m: SkillMemory, halo: boolean): void {
  const v = skillValues(ID);
  shardsOf(m).push({
    x: hero.x + hero.face * 10,
    y: hero.y - 20,
    left: v.strikes,
    wait: 0,
    target: null,
    angle: rng.range(0, TAU),
    halo,
  });
}

/** a shard strikes its foe, and with pierce one more foe near it */
function strike(s: Shard, foe: Enemy): void {
  const v = skillValues(ID);
  const dir = Math.sign(foe.x - s.x) || 1;
  dealDamage(foe, progress.stats.ad * v.power, { fromX: s.x, kx: dir * 30, source: ID });
  game.fx.push(createImpact(s.x, s.y, dir, false, CRIMSON_SPARKS));
  if (v.mark) markFoe(foe, ID, withCharms("duration", MARK_TIME), v.mark);
  if (!v.pierce) return;
  const next = nearestFoe(foe.x, foe.y - 10, [foe]);
  if (next && Math.abs(next.x - foe.x) < 30)
    dealDamage(next, progress.stats.ad * v.power, { fromX: s.x, kx: dir * 30, source: ID });
}

/** Red Shard: a string blow may chip a shard off the crystal that darts at foes on its own; Shard Halo keeps four
 *  circling her for good */
export const redShard: SkillBehavior = {
  create: () => ({ shards: [], cd: 0, t: 0 }),
  update(m, _state, dt) {
    m.cd = Math.max(0, (m.cd as number) - dt);
    m.t = (m.t as number) + dt;
    const v = skillValues(ID);
    const shards = shardsOf(m);
    if (skillEvolved(ID)) while (shards.filter((s) => s.halo).length < v.count) chip(m, true);
    for (const s of shards) {
      s.wait = Math.max(0, s.wait - dt);
      if (!s.target || s.target.hp <= 0) s.target = null;
      if (!s.target && s.wait <= 0) {
        const foe = nearestFoe(hero.x, hero.y - 16);
        if (foe && Math.abs(foe.x - hero.x) < SHARD.sight) s.target = foe;
      }
      const [tx, ty] = s.target ? enemyCenter(s.target) : restAt(s, m.t as number);
      const d = Math.hypot(tx - s.x, ty - s.y) || 1;
      const step = Math.min(d, SHARD.speed * dt);
      s.x += ((tx - s.x) / d) * step;
      s.y += ((ty - s.y) / d) * step;
      if (!s.target || d > SHARD.reach) continue;
      strike(s, s.target);
      s.target = null;
      s.wait = SHARD.rest;
      if (!s.halo) s.left--;
    }
    m.shards = shards.filter((s) => s.halo || s.left > 0);
  },
  draw(m) {
    place();
    for (const s of shardsOf(m)) {
      const r = SHARD.size;
      polygon(
        [
          [s.x, s.y - r * 1.4],
          [s.x + r, s.y],
          [s.x, s.y + r * 1.4],
          [s.x - r, s.y],
        ],
        CRIMSON[3],
      );
      fleck(s.x - 0.5, s.y - 0.5, WHITE);
      glow(s.x, s.y, 7, CRIMSON[4], 0.35);
    }
  },
  on: {
    blow(m, e) {
      const v = skillValues(ID);
      if (!e.move || (m.cd as number) > 0) return;
      if (shardsOf(m).filter((s) => !s.halo).length >= withCharms("amount", v.count)) return;
      if (!(e.keen && v.heavyShard) && !rng.chance(v.chance)) return;
      m.cd = v.cooldown;
      chip(m, false);
    },
  },
};
