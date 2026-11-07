import { BRUISE } from "../../../constants/hulda/bruise";
import { disc, place, px } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { addStacks, consumeStacks, markFoe, stacksOf } from "../../enemies/skillStatus";
import { game, hero, progress } from "../../state";
import { skillValues, withCharms } from "../query";

const ID = "h_bruise";

interface BruiseMemory {
  /** seconds since the skill was taken, the clock for the no-chain rule */
  t: number;
  /** when each foe last took bruises from a spread or a shatter: it cannot pass them on again for a while (G5) */
  received: Map<Enemy, number>;
}

const memoryOf = (m: SkillMemory): BruiseMemory => m as unknown as BruiseMemory;

/** lay bruises on a foe at the skill's current numbers; bruised foes take more while the mark lasts */
function bruise(e: Enemy, stacks: number): void {
  if (stacks <= 0 || e.hp <= 0) return;
  const v = skillValues(ID);
  const duration = withCharms("duration", v.duration);
  addStacks(e, ID, {
    stacks,
    max: v.max,
    damage: progress.stats.ad * v.damage * BRUISE.every,
    every: BRUISE.every,
    duration,
  });
  if (v.mark) markFoe(e, ID, duration, v.mark);
}

/** a foe passing bruises on may not if it took them from a spread or a shatter a moment ago */
const mayPass = (m: BruiseMemory, e: Enemy): boolean =>
  m.t - (m.received.get(e) ?? Number.NEGATIVE_INFINITY) > BRUISE.noChain;

/** half of `stacks` to every other foe near a point; those foes cannot pass them on for a while */
function pass(m: BruiseMemory, from: Enemy, stacks: number): void {
  const half = Math.floor(stacks / 2);
  if (half <= 0) return;
  const [x, y] = enemyCenter(from);
  const reach = withCharms("area", BRUISE.reach);
  for (const e of game.enemies) {
    if (e === from || e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.hypot(cx - x, cy - y) > reach) continue;
    bruise(e, half);
    m.received.set(e, m.t);
  }
}

/** Shatter: every bruise on the foe bursts at once, and half of them pass to foes near */
function shatter(m: BruiseMemory, e: Enemy): boolean {
  const v = skillValues(ID);
  if (!v.shatter || stacksOf(e, ID) <= 0) return false;
  const n = consumeStacks(e, ID);
  const [cx, cy] = enemyCenter(e);
  game.fx.push(createImpact(cx, cy, hero.face, true));
  dealDamage(e, progress.stats.ad * v.shatter * n, { source: ID, fromX: hero.x, kx: 0 });
  if (mayPass(m, e)) pass(m, e, n);
  return true;
}

/** a heavy blow on a bruised foe: the haymaker, a throw or a slam */
function heavy(m: BruiseMemory, e: Enemy, stacks: number): void {
  if (!shatter(m, e)) bruise(e, stacks);
}

/** a small bruise blot on a foe's flank, darker and wider as stacks build */
function drawMark(e: Enemy): void {
  const n = stacksOf(e, ID);
  if (n <= 0) return;
  const [x0, y0, x1] = enemyBox(e);
  const share = n / Math.max(1, skillValues(ID).max);
  const x = (x0 + x1) / 2;
  const y = y0 - 3;
  disc(x, y, 1 + share * 1.5, BRUISE.dark, 0.85);
  px(x - 0.5, y - 0.5, BRUISE.bright, 0.6 + share * 0.4);
}

/**
 * Bruising Knuckles: her fist blows leave stacking bruises that tick on their own; the haymaker, knees and throws bruise
 * deeper; a bruised foe that dies passes half on; evolved, heavy blows shatter every bruise at once.
 */
export const bruisingKnuckles: SkillBehavior = {
  create: () => ({ t: 0, received: new Map<Enemy, number>() }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    m.t += dt;
    for (const [e, at] of m.received) if (e.hp <= 0 || m.t - at > BRUISE.noChain) m.received.delete(e);
  },
  draw() {
    place();
    for (const e of game.enemies) if (e.hp > 0) drawMark(e);
  },
  on: {
    blow(memory, event) {
      if (event.source !== "attacks" || !event.melee) return;
      const v = skillValues(ID);
      const m = memoryOf(memory);
      if (hero.state === "knee") bruise(event.foe, v.grapple);
      else if (event.finisher) heavy(m, event.foe, v.haymaker);
      else bruise(event.foe, 1);
    },
    throw(memory, event) {
      heavy(memoryOf(memory), event.foe, skillValues(ID).grapple);
    },
    kill(memory, event) {
      const m = memoryOf(memory);
      const n = stacksOf(event.foe, ID);
      if (!skillValues(ID).spread || n <= 0 || !mayPass(m, event.foe)) return;
      pass(m, event.foe, n);
    },
  },
};
