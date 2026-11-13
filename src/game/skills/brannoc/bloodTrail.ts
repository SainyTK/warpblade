import { BLOOD_TRAIL } from "../../../constants/brannoc/skills";
import { place } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createBloodPillar } from "../../effects/brannoc/bloodPillar";
import { drawBloodTrail } from "../../effects/brannoc/bloodTrail";
import { enemyBox, enemyCenter, walks } from "../../enemies/enemy";
import { repay } from "../../hero/brannoc/debt";
import { game, hero, progress } from "../../state";
import { boxHit, shake } from "../../world";
import { skillValues, withCharms } from "../query";
import { layBleed } from "./bleed";

const ID = "b_bloodTrail";
/** how close to the floor a foe's feet must be to stand in it, and the trail fades over its last this many seconds */
const FEET = 4;
const FADE = 0.4;
/** River of Red's burst: a pillar every this many px along it, each this wide */
const RIVER_STEP = 12;
const RIVER_WIDTH = 10;

interface Trail {
  from: number;
  to: number;
  /** the floor he landed on */
  floor: number;
  left: number;
  tick: number;
  t: number;
  river: boolean;
}

interface TrailMemory {
  trails: Trail[];
}

const memoryOf = (m: SkillMemory): TrailMemory => m as unknown as TrailMemory;

/** a foe's feet are on the trail: its middle over it and its feet near the floor */
function standsOn(e: Enemy, tr: Trail): boolean {
  const [cx] = enemyCenter(e);
  if (cx < tr.from - 2 || cx > tr.to + 2) return false;
  const feet = enemyBox(e)[3];
  return feet >= tr.floor - FEET && feet <= tr.floor + FEET;
}

/** one tick of the trail on each ground foe standing in it */
function tick(tr: Trail): void {
  const v = skillValues(ID);
  for (const e of game.enemies) {
    if (e.hp <= 0 || e.air || !walks(e) || !standsOn(e, tr)) continue;
    dealDamage(e, progress.stats.ad * (v.power ?? 0), { source: ID });
    if (e.hp <= 0) continue;
    if (v.slow) e.chill = Math.max(e.chill, BLOOD_TRAIL.slow);
    if (v.bleed) layBleed(e, ID);
  }
}

/** River of Red: the trail bursts along its length, striking every foe over it */
function riverBurst(tr: Trail): void {
  const box: [number, number, number, number] = [tr.from, tr.floor - BLOOD_TRAIL.river.height, tr.to, tr.floor];
  for (const e of game.enemies)
    if (e.hp > 0 && boxHit(box, enemyBox(e)))
      dealDamage(e, progress.stats.ad * BLOOD_TRAIL.river.power, { source: ID });
  const n = Math.max(1, Math.round((tr.to - tr.from) / RIVER_STEP));
  for (let i = 0; i <= n; i++) {
    const x = tr.from + ((tr.to - tr.from) * i) / n;
    game.fx.push(createBloodPillar(x, tr.floor, RIVER_WIDTH, BLOOD_TRAIL.river.height, i * 0.02));
  }
  shake(0.1, 1);
}

/** the trail ticks while it lasts; River of Red bursts at its end. False once it is gone */
function last(tr: Trail, dt: number): boolean {
  tr.t += dt;
  tr.left -= dt;
  tr.tick -= dt;
  if (tr.tick <= 0 && tr.left > 0) {
    tr.tick += BLOOD_TRAIL.tick;
    tick(tr);
  }
  if (tr.left > 0) return true;
  if (tr.river) riverBurst(tr);
  return false;
}

/**
 * Blood Trail: each Hunt leaves a trail of blood on the floor from where it set off to where he landed, hurting ground
 * foes standing in it every half second; with its levels it slows them, deals more, lasts longer, bleeds them, and a
 * kill on it repays the debt. River of Red lasts longer and bursts along its length at its end.
 */
export const bloodTrailSkill: SkillBehavior = {
  create: () => ({ trails: [] }),
  update(memory, _s, dt) {
    const m = memoryOf(memory);
    m.trails = m.trails.filter((tr) => last(tr, dt));
  },
  drawBack(memory) {
    place();
    for (const tr of memoryOf(memory).trails)
      drawBloodTrail(tr.from, tr.to, tr.floor, Math.min(1, tr.left / FADE, tr.t / 0.1), tr.t);
  },
  on: {
    hunt(memory, event) {
      if (Math.abs(hero.x - event.from) < BLOOD_TRAIL.least) return;
      const v = skillValues(ID);
      const river = !!v.river;
      memoryOf(memory).trails.push({
        from: Math.min(event.from, hero.x),
        to: Math.max(event.from, hero.x),
        floor: hero.y,
        left: withCharms("duration", v.time ?? 2) + (river ? BLOOD_TRAIL.river.more : 0),
        tick: BLOOD_TRAIL.tick,
        t: 0,
        river,
      });
    },
    kill(memory, event) {
      const share = skillValues(ID).killRepay ?? 0;
      if (!share) return;
      if (memoryOf(memory).trails.some((tr) => standsOn(event.foe, tr))) repay(share, event.foe);
    },
  },
};
