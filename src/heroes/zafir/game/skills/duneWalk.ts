import { fleck, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { walks } from "../../../../game/enemies/enemy";
import { skillValues, withBuild } from "../../../../game/skills/query";
import { foesOnScreen } from "../../../../game/skills/targets";
import { hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { GRAIN } from "../../constants/palette";
import { openWounds } from "../wounds";

const ID = "za_dune";
/** a patch of the trail: dropped this often while he walks through a spin, this wide, lasting this long, and cutting
 *  each foe on it this often */
const TRAIL = { every: 0.08, half: 5, life: 1.2, cut: 0.3 } as const;

interface Patch {
  x: number;
  y: number;
  left: number;
}
interface TrailMemory {
  drop: number;
  patches: Patch[];
  next: Map<Enemy, number>;
  t: number;
}
const memoryOf = (m: SkillMemory): TrailMemory => m as unknown as TrailMemory;

/** a foe on a patch: a walker on the floor over it */
const onPatch = (e: Enemy, p: Patch, half: number): boolean =>
  walks(e) && !e.air && Math.abs(e.x - p.x) <= half && Math.abs(e.y - p.y) < 4;

/** Dune Walk: walking through a spin leaves a trail of sand on the floor that cuts each foe on it, opens wounds and
 *  holds walkers' feet as it levels */
export const duneWalk: SkillBehavior = {
  create: () => ({ drop: 0, patches: [], next: new Map(), t: 0 }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    const v = skillValues(ID);
    m.t += dt;
    for (const p of m.patches) p.left -= dt;
    m.patches = m.patches.filter((p) => p.left > 0);
    if (!v.trail) return;
    m.drop -= dt;
    const walking = hero.state === "move" && hero.ground && Math.abs(hero.vx) > 8;
    if (walking && m.drop <= 0) {
      m.drop = TRAIL.every;
      m.patches.push({ x: hero.x, y: hero.y, left: withBuild("duration", TRAIL.life * (v.trailLife ?? 1)) });
    }
    const half = withBuild("area", TRAIL.half * (v.trailWide ?? 1));
    for (const e of foesOnScreen()) {
      if ((m.next.get(e) ?? 0) > m.t || !m.patches.some((p) => onPatch(e, p, half))) continue;
      m.next.set(e, m.t + TRAIL.cut);
      dealDamage(e, progress.stats.ad * v.trail, { fromX: e.x, source: ID });
      openWounds(e, v.trailWounds ?? 0);
      if (v.trailHalt) e.halt = Math.max(e.halt, v.trailHalt);
    }
  },
  drawBack(memory) {
    const m = memoryOf(memory);
    const half = TRAIL.half * (skillValues(ID).trailWide ?? 1);
    place();
    for (const [i, p] of m.patches.entries()) {
      const k = Math.min(1, p.left / 0.4);
      for (let j = -2; j <= 2; j++)
        fleck(p.x + (j * half) / 2.5, p.y - 0.5 - ((i + j) & 1), GRAIN[(i + j + 8) % GRAIN.length], k);
    }
  },
};
