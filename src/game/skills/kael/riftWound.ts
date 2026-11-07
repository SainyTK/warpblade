import { PAL } from "../../../constants/palette";
import { glow, line, place, px } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { TAU } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { addStacks, consumeStacks, stacksOf } from "../../enemies/skillStatus";
import { game, lights, particles, progress, rng } from "../../state";
import { shake } from "../../world";
import { skillValues, withCharms } from "../query";
import { foesOnScreen } from "../targets";
import { isLocked, lockFoe, pruneLock, type SpreadLock } from "./spreadLock";

const ID = "k_rift";
/** seconds between the wound's ticks; how far a new layer reaches the nearest foe; how long a collapse's layers keep a
 *  foe from collapsing in turn */
const RIFT = { every: 0.5, spreadReach: 40, collapseLock: 1, pull: 220 } as const;

interface RiftMemory {
  lock: SpreadLock;
}

const memoryOf = (m: SkillMemory): RiftMemory => m as unknown as RiftMemory;

/** the wound's whole state on a foe: its layers' tick and how long they still run */
const entryOf = (e: Enemy) => e.stacks.find((s) => s.source === ID);

/** add `n` layers to a foe's wound; a new layer can spread to its nearest neighbour, and a full one can collapse */
function wound(m: RiftMemory, e: Enemy, n: number, spreads: boolean): void {
  const v = skillValues(ID);
  const life = withCharms("duration", v.life);
  addStacks(e, ID, {
    stacks: n,
    max: Math.round(v.max),
    damage: progress.stats.ad * v.per * RIFT.every,
    every: RIFT.every,
    duration: life,
  });
  if (v.slow) e.chill = Math.max(e.chill, life);
  const [x, y] = enemyCenter(e);
  for (let i = 0; i < 6; i++)
    particles.spawn(
      PK.STREAK,
      x + rng.range(-8, 8),
      y + rng.range(-10, 10),
      0,
      -rng.range(10, 30),
      rng.range(0.2, 0.4),
      {
        col: rng.pick([PAL.shadow[4], PAL.shadow[5]]),
      },
    );
  if (v.spread && spreads && !isLocked(m.lock, e)) {
    const near = foesOnScreen()
      .filter((f) => f !== e && Math.hypot(enemyCenter(f)[0] - x, enemyCenter(f)[1] - y) <= RIFT.spreadReach)
      .sort((a, b) => Math.abs(a.x - x) - Math.abs(b.x - x))[0];
    if (near) {
      lockFoe(m.lock, near);
      wound(m, near, 1, false);
    }
  }
  if (v.collapse && stacksOf(e, ID) >= v.max && !isLocked(m.lock, e)) collapse(m, e);
}

/** Rift Collapse: a full wound deals what it had left at once, doubled, then pulls foes in and wounds them */
function collapse(m: RiftMemory, e: Enemy): void {
  const v = skillValues(ID);
  const left = entryOf(e)?.left ?? 0;
  const layers = consumeStacks(e, ID);
  const [x, y] = enemyCenter(e);
  dealDamage(e, progress.stats.ad * v.per * layers * left * v.collapse, { fromX: x, heavy: true, source: ID });
  game.fx.push(createFloorRing(x, y, v.pull, PAL.shadow, 0.5, 0.6));
  game.fx.push(createImpact(x, y, 1, true, PAL.shadow));
  lights.add(x, y, 70, PAL.shadow[4], 0.9, 0.5);
  shake(0.22, 3);
  for (const f of foesOnScreen()) {
    if (f === e || Math.hypot(enemyCenter(f)[0] - x, enemyCenter(f)[1] - y) > v.pull) continue;
    f.vx += Math.sign(x - f.x) * RIFT.pull;
    lockFoe(m.lock, f, RIFT.collapseLock);
    wound(m, f, v.give, false);
  }
}

/** a wound: a dark rift slit down the foe's middle, longer with each layer, with a violet glow */
function drawWound(e: Enemy): void {
  const n = stacksOf(e, ID);
  if (!n) return;
  const [x, y] = enemyCenter(e);
  const S = PAL.shadow;
  const h = 3 + n * 2;
  const wob = Math.sin(game.t * 9 + e.seed * TAU) * 0.6;
  line(x + wob, y - h, x - wob, y + h, S[1]);
  line(x + wob + 1, y - h + 1, x - wob + 1, y + h - 1, S[4], 0.8);
  px(x, y, S[5]);
  glow(x, y, 6 + n * 2, S[4], 0.25);
}

/** Rift Wound: warp strikes (and from level 3 the finisher) open layers of a rift wound that drains the foe; as Rift
 *  Collapse a full wound bursts and pulls foes in */
export const riftWound: SkillBehavior = {
  create: () => ({ lock: new Map() }),
  update(memory) {
    pruneLock(memoryOf(memory).lock);
  },
  draw() {
    place();
    for (const e of foesOnScreen()) drawWound(e);
  },
  on: {
    warp(memory, ev) {
      if (ev.foe && ev.foe.hp > 0) wound(memoryOf(memory), ev.foe, 1, true);
    },
    blow(memory, ev) {
      if (ev.finisher && ev.source === "attacks" && skillValues(ID).finisher && ev.foe.hp > 0)
        wound(memoryOf(memory), ev.foe, 1, true);
    },
  },
};
