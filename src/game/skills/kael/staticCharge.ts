import { SPARKS } from "../../../constants/palette";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { enemyCenter } from "../../enemies/enemy";
import { addStacks, stacksOf } from "../../enemies/skillStatus";
import { createLightning } from "../../spells/lightning";
import { game, hero, particles, progress, rng } from "../../state";
import { skillEvolved, skillValues, withCharms } from "../query";
import { foesOnScreen } from "../targets";
import { isLocked, lockFoe, pruneLock, type SpreadLock } from "./spreadLock";

const ID = "k_static";
/** seconds between crackles; a sword blow calls lightning on one foe at most this often; how close the charge jumps;
 *  how far a perfect dodge or a dying foe reaches; Overload's charge lasts this long, as good as for ever */
const STATIC = { every: 0.5, boltEvery: 2, touch: 20, contagionEvery: 1, near: 60, forever: 600 } as const;

interface StaticMemory {
  /** game time each foe may next call lightning from a blow */
  boltAt: Map<Enemy, number>;
  contagionT: number;
  overloadT: number;
  lock: SpreadLock;
}

const memoryOf = (m: SkillMemory): StaticMemory => m as unknown as StaticMemory;
const charged = (e: Enemy): boolean => stacksOf(e, ID) > 0;

/** charge a foe: it crackles for a while; as Overload it stays charged */
function charge(e: Enemy): void {
  const v = skillValues(ID);
  addStacks(e, ID, {
    stacks: 1,
    max: 1,
    damage: progress.stats.ap * v.tick * STATIC.every,
    every: STATIC.every,
    duration: skillEvolved(ID) ? STATIC.forever : withCharms("duration", v.life),
  });
}

/** lightning on a charged foe, arcing on; `source` is the press it rides or the skill itself */
function strike(e: Enemy, damage: number, arcDamage: number, arcs: number, source: string): void {
  const [x, y] = enemyCenter(e);
  game.fx.push(createLightning(e, [x, y], { damage, arcDamage, arcs, shock: 0.5, glow: 0.5, skyFlash: false, source }));
}

/** the charge jumps from a charged foe to any foe touching it */
function contagion(m: StaticMemory): void {
  const foes = foesOnScreen();
  for (const e of foes.filter((f) => charged(f) && !isLocked(m.lock, f))) {
    const [x, y] = enemyCenter(e);
    for (const f of foes) {
      if (charged(f) || Math.hypot(enemyCenter(f)[0] - x, enemyCenter(f)[1] - y) > STATIC.touch + 8) continue;
      charge(f);
      lockFoe(m.lock, f);
    }
  }
}

/** Overload: each dash strikes the charged foes on screen, at most a few, at most so often */
function overload(m: StaticMemory): void {
  const v = skillValues(ID);
  if (m.overloadT > 0) return;
  m.overloadT = withCharms("cooldown", v.every);
  const ap = progress.stats.ap;
  foesOnScreen()
    .filter(charged)
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x))
    .slice(0, v.most)
    .forEach((e) => {
      strike(e, ap * v.overload, ap * v.arc, v.overloadArcs, ID);
    });
}

/** Static Charge: foes the dash passes are charged and crackle; a sword blow calls lightning on a charged foe; the
 *  charge jumps between touching foes, arcs from the dying, and as Overload every dash strikes them all */
export const staticCharge: SkillBehavior = {
  create: () => ({ boltAt: new Map(), contagionT: 0, overloadT: 0, lock: new Map() }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    pruneLock(m.lock);
    m.overloadT = Math.max(0, m.overloadT - dt);
    for (const [e] of m.boltAt) if (e.hp <= 0) m.boltAt.delete(e);
    for (const e of foesOnScreen()) {
      if (!charged(e) || !rng.chance(0.2)) continue;
      const [x, y] = enemyCenter(e);
      particles.spawn(
        PK.SPARK,
        x + rng.range(-6, 6),
        y + rng.range(-8, 8),
        rng.range(-50, 50),
        rng.range(-60, 10),
        0.1,
        {
          sparks: SPARKS.volt,
        },
      );
    }
    if (!skillValues(ID).contagion) return;
    m.contagionT -= dt;
    if (m.contagionT > 0) return;
    m.contagionT = STATIC.contagionEvery;
    contagion(m);
  },
  on: {
    dash(memory, ev, state) {
      for (const e of ev.foes) if (e.hp > 0) charge(e);
      if (state.evolved) overload(memoryOf(memory));
    },
    blow(memory, ev) {
      const v = skillValues(ID);
      const m = memoryOf(memory);
      if (!v.bolt || !ev.melee || ev.source !== "attacks" || !charged(ev.foe) || ev.foe.hp <= 0) return;
      if ((m.boltAt.get(ev.foe) ?? 0) > game.t) return;
      m.boltAt.set(ev.foe, game.t + STATIC.boltEvery);
      const ap = progress.stats.ap;
      strike(ev.foe, ap * v.bolt, ap * v.arc, v.arcs, "attacks");
    },
    perfectDodge() {
      if (!skillValues(ID).perfect) return;
      for (const e of foesOnScreen()) if (Math.abs(e.x - hero.x) <= STATIC.near) charge(e);
    },
    kill(memory, ev) {
      const v = skillValues(ID);
      const m = memoryOf(memory);
      if (!v.death || !charged(ev.foe) || isLocked(m.lock, ev.foe)) return;
      const [x, y] = enemyCenter(ev.foe);
      for (const f of foesOnScreen()) {
        if (f === ev.foe || Math.hypot(enemyCenter(f)[0] - x, enemyCenter(f)[1] - y) > STATIC.near) continue;
        lockFoe(m.lock, f);
        strike(f, progress.stats.ap * v.arc, 0, 0, ID);
      }
    },
  },
};
