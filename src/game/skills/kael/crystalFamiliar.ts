import { ABILITY_COLOR, PAL } from "../../../constants/palette";
import { circle, glow, hairline, place, polygon, px } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import type { Element } from "../../../types/spell";
import { WHITE } from "../../../utils/color";
import { TAU } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { ignite } from "../../enemies/burn";
import { enemyCenter } from "../../enemies/enemy";
import { createLightning } from "../../spells/lightning";
import { game, hero, progress, rng } from "../../state";
import { skillValues, withCharms } from "../query";
import { nearestFoe, touches } from "../targets";

const ID = "k_familiar";
/** a shard's flight speed, turn rate, life, how close it must come and how hard it knocks */
const SHARD = { speed: 200, turn: 9, life: 1.6, reach: 3, kick: 40 } as const;
/** where familiars hover: behind and above Kael's shoulder, spread apart, bobbing */
const HOVER = { back: 10, up: 34, apart: 9, bob: 2, follow: 6 } as const;
/** how long an ice shard chills, a fire shard burns, and how far a lightning shard (or the Choir's) arcs */
const ELEMENT_HIT = { chill: 1.5, burn: 1, arcReach: 60, arcShare: 0.5 } as const;
/** the familiars of Crystal Choir never leave */
const FOREVER = 600;

interface Familiar {
  x: number;
  y: number;
  left: number;
  fire: number;
  phase: number;
}

interface Shard {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  target: Enemy | null;
  struck: Enemy[];
  element: Element | null;
}

interface FamiliarMemory {
  cd: number;
  familiars: Familiar[];
  shards: Shard[];
  /** the element of the last cast, which shards take from Crystal Familiar's seventh level */
  element: Element | null;
}

const memoryOf = (m: SkillMemory): FamiliarMemory => m as unknown as FamiliarMemory;

/** a familiar fires one shard at the nearest foe */
function fire(m: FamiliarMemory, f: Familiar): void {
  const target = nearestFoe(f.x, f.y);
  if (!target) return;
  const a = Math.atan2(enemyCenter(target)[1] - f.y, enemyCenter(target)[0] - f.x) + rng.range(-0.5, 0.5);
  const element = skillValues(ID).element ? m.element : null;
  m.shards.push({
    x: f.x,
    y: f.y,
    vx: Math.cos(a) * 80,
    vy: Math.sin(a) * 80,
    life: SHARD.life,
    target,
    struck: [],
    element,
  });
}

/** a shard struck a foe: its damage, its element's touch, and the Choir's arc */
function strike(s: Shard, foe: Enemy, evolved: boolean): void {
  const v = skillValues(ID);
  const damage = progress.stats.ap * v.power;
  dealDamage(foe, damage, { source: ID, fromX: s.x, kx: Math.sign(s.vx) * SHARD.kick });
  if (s.element === "fire") ignite(foe, ELEMENT_HIT.burn);
  if (s.element === "ice") foe.chill = Math.max(foe.chill, ELEMENT_HIT.chill);
  if (s.element !== "volt" && !evolved) return;
  const [x, y] = enemyCenter(foe);
  const next = nearestFoe(x, y, [foe, ...s.struck]);
  if (!next || Math.hypot(enemyCenter(next)[0] - x, enemyCenter(next)[1] - y) > ELEMENT_HIT.arcReach) return;
  game.fx.push(
    createLightning(next, enemyCenter(next), {
      damage: damage * ELEMENT_HIT.arcShare,
      arcDamage: 0,
      arcs: 0,
      shock: 0.3,
      glow: 0.3,
      fromY: y,
      skyFlash: false,
      source: ID,
    }),
  );
}

/** turn toward a foe, fly, strike what it touches; false once spent */
function fly(s: Shard, dt: number, evolved: boolean): boolean {
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
  strike(s, s.target, evolved);
  s.struck.push(s.target);
  s.target = null;
  return s.struck.length < skillValues(ID).pierce && s.life > 0;
}

/** familiars hover in a row behind Kael's shoulder, easing after him */
function hover(m: FamiliarMemory, dt: number): void {
  m.familiars.forEach((f, i) => {
    const tx = hero.x - hero.face * (HOVER.back + i * HOVER.apart);
    const ty = hero.y - HOVER.up + Math.sin(game.t * 3 + f.phase) * HOVER.bob - i * 3;
    const k = Math.min(1, HOVER.follow * dt);
    f.x += (tx - f.x) * k;
    f.y += (ty - f.y) * k;
  });
}

/** a new familiar at Kael's shoulder */
const newFamiliar = (left: number): Familiar => ({
  x: hero.x,
  y: hero.y - HOVER.up,
  left,
  fire: 0.2,
  phase: rng.range(0, TAU),
});

/** a cast: maybe call a familiar, and from level 3 the familiars out fire a volley */
function answerCast(m: FamiliarMemory, evolved: boolean): void {
  const v = skillValues(ID);
  // Crystal Choir's familiars are always out and fire on their own beat: a cast adds no volley
  if (evolved) return;
  if (v.volley) for (const f of m.familiars) for (let i = 0; i < v.volley; i++) fire(m, f);
  if (m.cd > 0 || !rng.chance(v.chance)) return;
  m.cd = withCharms("cooldown", v.cooldown);
  const life = withCharms("duration", v.life);
  if (m.familiars.length < withCharms("amount", v.most)) m.familiars.push(newFamiliar(life));
  else m.familiars.sort((a, b) => a.left - b.left)[0].left = life;
}

/** a familiar: a faceted crystal with a bright core, a soft glow, and a glint that turns */
function drawFamiliar(f: Familiar, evolved: boolean): void {
  const C = PAL.crystal;
  const x = Math.round(f.x);
  const y = Math.round(f.y);
  polygon(
    [
      [x, y - 4],
      [x + 3, y],
      [x, y + 4],
      [x - 3, y],
    ],
    C[3],
  );
  polygon(
    [
      [x, y - 4],
      [x + 3, y],
      [x, y],
    ],
    C[5],
  );
  px(x, y - 1, WHITE);
  glow(x, y, evolved ? 12 : 9, C[3], 0.4);
  const g = game.t * 4 + f.phase;
  px(x + Math.round(Math.cos(g) * 5), y + Math.round(Math.sin(g) * 2), C[4], 0.8);
}

function drawShard(s: Shard): void {
  const c = s.element ? ABILITY_COLOR[s.element] : PAL.crystal[4];
  hairline(s.x, s.y, s.x - s.vx * 0.03, s.y - s.vy * 0.03, PAL.crystal[2], 0.6);
  circle(s.x, s.y, 1.2, c);
  px(s.x - 0.5, s.y - 0.5, WHITE);
  glow(s.x, s.y, 5, c, 0.4);
}

/** Crystal Familiar: a cast may call a crystal familiar that hovers at Kael's shoulder and fires homing shards; as
 *  Crystal Choir three are always out and their shards arc on */
export const crystalFamiliar: SkillBehavior = {
  create: () => ({ cd: 0, familiars: [], shards: [], element: null }),
  update(memory, { evolved }, dt) {
    const m = memoryOf(memory);
    const v = skillValues(ID);
    m.cd = Math.max(0, m.cd - dt);
    if (evolved) while (m.familiars.length < v.most) m.familiars.push(newFamiliar(FOREVER));
    for (const f of m.familiars) {
      f.left -= dt;
      f.fire -= dt;
      if (f.fire > 0) continue;
      f.fire = withCharms("cooldown", v.every);
      fire(m, f);
    }
    m.familiars = m.familiars.filter((f) => f.left > 0);
    hover(m, dt);
    m.shards = m.shards.filter((s) => fly(s, dt, evolved));
  },
  draw(memory, state) {
    place();
    const m = memoryOf(memory);
    for (const f of m.familiars) drawFamiliar(f, state.evolved);
    for (const s of m.shards) drawShard(s);
  },
  on: {
    cast(memory, ev, state) {
      const m = memoryOf(memory);
      if (ev.ability === "fire" || ev.ability === "ice" || ev.ability === "volt") m.element = ev.ability;
      answerCast(m, state.evolved);
    },
  },
};
