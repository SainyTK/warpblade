import { fleck, glow, hairline, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { touches } from "../../../../game/skills/targets";
import { game, hero, progress, rng } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { WHITE } from "../../../../utils/color";
import { DUSK_RAMP } from "../../look/colors";
import { tempoTop } from "../tempo";

const ID = "ve_swallow";
/** a swallow's speed, turn rate, life and reach; how far it looks for a foe; Swallow Storm's circle round her */
const BIRD = { speed: 230, turn: 10, life: 1.4, reach: 4, seek: 160, circle: 22 } as const;

interface Swallow {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  target: Enemy | null;
  struck: Enemy[];
}
interface SwallowMemory {
  cd: number;
  birds: Swallow[];
}
const memoryOf = (m: SkillMemory): SwallowMemory => m as unknown as SwallowMemory;

/** the nearest foe a swallow may dive at: airborne ones, or any from its fifth level */
function prey(x: number, y: number, skip: readonly Enemy[]): Enemy | null {
  const any = !!skillValues(ID).ground;
  let best: Enemy | null = null;
  let d: number = BIRD.seek;
  for (const e of game.enemies) {
    if (e.hp <= 0 || skip.includes(e) || (!e.air && !any)) continue;
    const [ex, ey] = enemyCenter(e);
    const dist = Math.hypot(ex - x, ey - y);
    if (dist < d) {
      d = dist;
      best = e;
    }
  }
  return best;
}

/** send `n` swallows up from her shoulders */
function send(m: SwallowMemory, n: number): void {
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i - (n - 1) / 2) * 0.5;
    m.birds.push({
      x: hero.x,
      y: hero.y - 24,
      vx: Math.cos(a) * 120,
      vy: Math.sin(a) * 120,
      life: BIRD.life,
      target: null,
      struck: [],
    });
  }
}

/** a swallow turns toward its prey, flies and strikes; false once it is spent */
function fly(b: Swallow, dt: number): boolean {
  const v = skillValues(ID);
  b.life -= dt;
  if (!b.target || b.target.hp <= 0) b.target = prey(b.x, b.y, b.struck);
  if (b.target) {
    const [tx, ty] = enemyCenter(b.target);
    const now = Math.atan2(b.vy, b.vx);
    const want = Math.atan2(ty - b.y, tx - b.x) - now;
    const turn = Math.atan2(Math.sin(want), Math.cos(want));
    const a = now + Math.max(-BIRD.turn * dt, Math.min(BIRD.turn * dt, turn));
    const speed = withBuild("speed", BIRD.speed);
    b.vx = Math.cos(a) * speed;
    b.vy = Math.sin(a) * speed;
  }
  b.x += b.vx * dt;
  b.y += b.vy * dt;
  if (!b.target || !touches(b.target, b.x, b.y, BIRD.reach)) return b.life > 0;
  const e = b.target;
  dealDamage(e, progress.stats.ad * v.power, {
    fromX: b.x,
    kx: Math.sign(b.vx) * 20,
    launch: e.air ? undefined : -200,
    source: ID,
  });
  b.struck.push(e);
  b.target = null;
  return b.struck.length < (v.pierce ?? 1) && b.life > 0;
}

/** a swallow: a dark forked shape pointing where it flies, its wings beating, with a white throat */
function drawSwallow(b: Swallow): void {
  const a = Math.atan2(b.vy, b.vx);
  const [c, s] = [Math.cos(a), Math.sin(a)];
  const beat = Math.sin(b.life * 40) * 1.5;
  const at = (d: number, w: number): [number, number] => [b.x + c * d - s * w, b.y + s * d + c * w];
  const [h, t1, t2, w1, w2] = [at(2, 0), at(-3, -1.2), at(-3, 1.2), at(-1, -3 - beat), at(-1, 3 + beat)];
  hairline(h[0], h[1], t1[0], t1[1], DUSK_RAMP[2]);
  hairline(h[0], h[1], t2[0], t2[1], DUSK_RAMP[2]);
  hairline(at(0, 0)[0], at(0, 0)[1], w1[0], w1[1], DUSK_RAMP[3]);
  hairline(at(0, 0)[0], at(0, 0)[1], w2[0], w2[1], DUSK_RAMP[3]);
  fleck(h[0], h[1], WHITE);
  glow(b.x, b.y, 5, DUSK_RAMP[4], 0.35);
}

/**
 * Night Swallows: a launch of hers may send dusk swallows that dive at foes in the air; levels add pierce, more birds, dives
 * at foes on the floor that throw them up and a swallow on air blows at the top of Tempo, and as Swallow Storm six circle
 * her and dive at every launch.
 */
export const nightSwallows: SkillBehavior = {
  create: () => ({ cd: 0, birds: [] }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
    m.birds = m.birds.filter((b) => fly(b, dt));
  },
  draw(memory, state) {
    place();
    for (const b of memoryOf(memory).birds) drawSwallow(b);
    if (!state.evolved) return;
    for (let i = 0; i < 6; i++) {
      const a = game.t * 3 + (i * Math.PI) / 3;
      fleck(hero.x + Math.cos(a) * BIRD.circle, hero.y - 20 + Math.sin(a) * BIRD.circle * 0.4, DUSK_RAMP[4], 0.8);
    }
  },
  on: {
    launch(memory) {
      const m = memoryOf(memory);
      const v = skillValues(ID);
      if (m.cd > 0 || !rng.chance(v.chance)) return;
      m.cd = withBuild("cooldown", v.cooldown);
      send(m, withBuild("amount", skillEvolved(ID) ? v.storm : v.count));
    },
    blow(memory, ev) {
      if (!skillValues(ID).airTop || !tempoTop() || hero.ground || ev.source !== "attacks") return;
      const m = memoryOf(memory);
      if (m.birds.length < withBuild("amount", skillValues(ID).count) * 2) send(m, 1);
    },
  },
};
