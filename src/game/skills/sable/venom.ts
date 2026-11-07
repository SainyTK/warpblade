import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { hex } from "../../../utils/color";
import { createFloorRing } from "../../effects/floorRing";
import { enemyCenter } from "../../enemies/enemy";
import { addStacks, stacksOf } from "../../enemies/skillStatus";
import { game, particles, progress, rng } from "../../state";
import { skillValues } from "../query";

const ID = "s_venom";
/** seconds between poison ticks, between creeps, and how near a foe must stand to catch the creep */
const TICK = 0.5;
const CREEP = { every: 1, reach: 16 } as const;
/** a foe given poison by a spread cannot spread it again this soon (shared rule G5) */
const SPREAD_GUARD = 0.5;
const VENOM = hex("#9ad84a");
const CLOUD_RAMP = [hex("#1a2a10"), hex("#3a5a20"), hex("#5e8a2e"), VENOM, hex("#d4f490"), hex("#f4ffe0")] as const;

interface VenomMemory {
  creep: number;
  /** when each foe last caught a spread, by game time */
  spreadAt: WeakMap<Enemy, number>;
}

const memoryOf = (m: SkillMemory): VenomMemory => m as unknown as VenomMemory;

/** lay poison stacks on a foe with the skill's current numbers */
export function poison(e: Enemy, stacks: number): void {
  const v = skillValues(ID);
  addStacks(e, ID, { stacks, max: v.max, damage: progress.stats.ad * v.rate * TICK, every: TICK, duration: v.time });
}

const canSpread = (m: VenomMemory, e: Enemy): boolean => game.t - (m.spreadAt.get(e) ?? -9) >= SPREAD_GUARD;

/** give a foe stacks by a spread, and remember it so it does not spread them on at once */
function spreadTo(m: VenomMemory, e: Enemy, stacks: number): void {
  poison(e, stacks);
  m.spreadAt.set(e, game.t);
}

/** each second, poison creeps from a poisoned foe to one foe touching it */
function creep(m: VenomMemory): void {
  for (const e of game.enemies) {
    if (e.hp <= 0 || !stacksOf(e, ID) || !canSpread(m, e)) continue;
    const [x] = enemyCenter(e);
    const next = game.enemies.find(
      (o) => o !== e && o.hp > 0 && !stacksOf(o, ID) && Math.abs(enemyCenter(o)[0] - x) < CREEP.reach,
    );
    if (next) spreadTo(m, next, 1);
  }
}

/** Venom Tips: bolts poison, the closing bolt and crits lay more; poison creeps, slows, passes on when a foe falls,
 *  and with Blight a fallen foe bursts in a cloud that gives its stacks to every foe in it */
export const venomTips: SkillBehavior = {
  create: () => ({ creep: CREEP.every, spreadAt: new WeakMap() }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    const v = skillValues(ID);
    if (v.slow) for (const e of game.enemies) if (e.hp > 0 && stacksOf(e, ID)) e.chill = Math.max(e.chill, 0.2);
    for (const e of game.enemies)
      if (e.hp > 0 && stacksOf(e, ID) && rng.chance(0.05)) {
        const [cx, cy] = enemyCenter(e);
        particles.spawn(PK.MOTE, cx + rng.range(-4, 4), cy, 0, -14, 0.5, { col: VENOM });
      }
    if (!v.creep) return;
    m.creep -= dt;
    if (m.creep > 0) return;
    m.creep += CREEP.every;
    creep(m);
  },
  on: {
    blow(_memory, event) {
      if (event.source !== "attacks" || event.melee) return;
      const v = skillValues(ID);
      poison(event.foe, Math.max(event.finisher ? v.closing : 1, event.crit ? v.crit : 1));
    },
    kill(memory, event) {
      const m = memoryOf(memory);
      const v = skillValues(ID);
      const n = stacksOf(event.foe, ID);
      if (!n || !v.passOn || !canSpread(m, event.foe)) return;
      const [x, y] = enemyCenter(event.foe);
      const given = Math.max(1, Math.round(n * v.passOn));
      const near = game.enemies
        .filter((e) => e !== event.foe && e.hp > 0)
        .sort((a, b) => Math.abs(enemyCenter(a)[0] - x) - Math.abs(enemyCenter(b)[0] - x));
      if (!v.cloud) {
        if (near[0]) spreadTo(m, near[0], given);
        return;
      }
      for (const e of near)
        if (Math.hypot(enemyCenter(e)[0] - x, enemyCenter(e)[1] - y) < v.cloud) spreadTo(m, e, given);
      game.fx.push(createFloorRing(x, y, v.cloud, CLOUD_RAMP, 0.5, 0.6));
      for (let i = 0; i < 10; i++)
        particles.spawn(PK.SMOKE, x + rng.range(-10, 10), y - rng.range(0, 12), rng.range(-20, 20), -8, 0.8, {
          size: rng.range(1.2, 2),
        });
    },
  },
};
