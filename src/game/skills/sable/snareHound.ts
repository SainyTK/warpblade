import { W } from "../../../constants/stage";
import { line, place, px } from "../../../engine/frame";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { hex } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { stacksOf } from "../../enemies/skillStatus";
import { bleed } from "../../hero/sable/spells/snare";
import { skin } from "../../hero/skin";
import { game, hero, progress, rng } from "../../state";
import { surfaceBelow } from "../../world";
import { skillValues, withCharms } from "../query";

const ID = "s_hound";
/** run speed, bite reach, how long a lone bite lingers, the drag's pace and the howl's reach */
const HOUND = { speed: 170, reach: 8, lone: 2.5, drag: 70, howl: 60 } as const;
const FUR = hex("#6a5a4a");
const FUR_DARK = hex("#3a3028");
const FUR_LIGHT = hex("#9a8a72");

interface Hound {
  x: number;
  y: number;
  face: number;
  life: number;
  target: Enemy | null;
  /** seconds until it may bite again */
  bite: number;
  /** the foe in its jaws and the seconds left */
  held: Enemy | null;
  hold: number;
  run: number;
}

interface HoundMemory {
  cd: number;
  hounds: Hound[];
}

const memoryOf = (m: SkillMemory): HoundMemory => m as unknown as HoundMemory;

/** the foe a hound goes for: Bloodhound picks bleeding foes first, otherwise the nearest */
function quarry(h: Hound, first: Enemy | null): Enemy | null {
  if (first && first.hp > 0) return first;
  const v = skillValues(ID);
  const foes = game.enemies.filter((e) => e.hp > 0 && !e.air);
  const pool = v.bleed ? foes.filter((e) => stacksOf(e, "s_barbed")) : [];
  const from = pool.length ? pool : foes;
  return from.sort((a, b) => Math.abs(a.x - h.x) - Math.abs(b.x - h.x))[0] ?? null;
}

/** hounds bound in from behind her; with a howl they stun the foes near where they arrive */
function call(m: HoundMemory, foe: Enemy): void {
  const v = skillValues(ID);
  const count = Math.round(withCharms("amount", v.hounds));
  const life = v.stay ? withCharms("duration", v.stay) : HOUND.lone;
  while (m.hounds.length < count) {
    const x = clamp(hero.x - hero.face * (24 + m.hounds.length * 10), 6, W - 6);
    m.hounds.push({ x, y: hero.y, face: hero.face, life, target: null, bite: 0, held: null, hold: 0, run: 0 });
  }
  for (const h of m.hounds) {
    h.life = Math.max(h.life, life);
    h.target = foe;
  }
  if (v.howl) {
    const [fx] = enemyCenter(foe);
    for (const e of game.enemies)
      if (e.hp > 0 && Math.abs(enemyCenter(e)[0] - fx) < HOUND.howl) e.stun = Math.max(e.stun, v.howl);
    game.fx.push(createFloorRing(fx, foe.y, HOUND.howl, skin.ramp, 0.4));
    sfx.tone(320, 160, 0.2, "sawtooth", 0.05);
  }
  m.cd = withCharms("cooldown", v.cooldown);
}

/** the bite: damage, a hold, Bloodhound doubles the bleed */
function bite(h: Hound, e: Enemy): void {
  const v = skillValues(ID);
  const [cx, cy] = enemyCenter(e);
  dealDamage(e, progress.stats.ad * v.power, { fromX: h.x, kx: 0, ky: -20, stun: v.hold, source: ID });
  game.fx.push(createImpact(cx, cy, h.face, false));
  if (v.bleed) for (let i = stacksOf(e, "s_barbed"); i > 0; i--) bleed(e);
  h.held = e;
  h.hold = v.hold;
  h.bite = v.every;
  if (!v.stay) h.life = Math.min(h.life, v.hold + 0.4);
}

/** a hound runs at its foe, bites it, drags it away from her, then hunts the next */
function run(h: Hound, dt: number): boolean {
  const v = skillValues(ID);
  h.life -= dt;
  h.bite -= dt;
  h.run += dt * 12;
  if (h.held) {
    h.hold -= dt;
    const e = h.held;
    if (e.hp <= 0 || h.hold <= 0) h.held = null;
    else if (v.drag) {
      const away = Math.sign(e.x - hero.x) || h.face;
      e.x = clamp(e.x + away * HOUND.drag * dt, 10, W - 10);
      h.x = e.x - away * 6;
      h.face = away;
    }
    return h.life > 0;
  }
  if (h.life <= 0) {
    // it bounds off the side of the stage
    h.x += h.face * HOUND.speed * dt;
    return h.x > -10 && h.x < W + 10;
  }
  if (!h.target || h.target.hp <= 0 || h.target.air) h.target = quarry(h, null);
  if (!h.target) return true;
  const dx = h.target.x - h.x;
  h.face = Math.sign(dx) || h.face;
  if (Math.abs(dx) > HOUND.reach) h.x += h.face * Math.min(Math.abs(dx), HOUND.speed * dt);
  h.y = surfaceBelow(h.x, h.y - 10);
  if (Math.abs(dx) <= HOUND.reach && h.bite <= 0) bite(h, h.target);
  return true;
}

/** Snare Hound: a snare's bite, Point-Blank's kick or the warp's heavy bolt may call a hound that bites, holds and drags foes away from her */
export const snareHound: SkillBehavior = {
  create: () => ({ cd: 0, hounds: [] }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    m.cd -= dt;
    m.hounds = m.hounds.filter((h) => run(h, dt));
  },
  draw(memory) {
    place();
    for (const h of memoryOf(memory).hounds) {
      const f = h.face;
      const step = Math.sin(h.run) * 1.5;
      const { x, y } = h;
      line(x - f * 5, y - 5, x + f * 3, y - 5, FUR);
      line(x - f * 5, y - 4, x + f * 3, y - 4, FUR_DARK);
      line(x + f * 3, y - 6, x + f * 6, y - 7, FUR);
      px(x + f * 6, y - 6, FUR_DARK);
      px(x + f * 4, y - 8, FUR_LIGHT);
      line(x - f * 5, y - 5, x - f * 7, y - 7, FUR_LIGHT);
      line(x - f * 4, y - 4, x - f * 4 - step, y, FUR_DARK);
      line(x + f * 2, y - 4, x + f * 2 + step, y, FUR_DARK);
    }
  },
  on: {
    kick(memory, event) {
      const m = memoryOf(memory);
      if (m.cd <= 0 && event.foes[0] && rng.chance(skillValues(ID).chance)) call(m, event.foes[0]);
    },
    warpBolt(memory, event) {
      const m = memoryOf(memory);
      if (m.cd <= 0 && rng.chance(skillValues(ID).chance)) call(m, event.foe);
    },
    snareBite(memory, event) {
      const m = memoryOf(memory);
      if (m.cd <= 0 && rng.chance(skillValues(ID).chance)) call(m, event.foe);
    },
  },
};
