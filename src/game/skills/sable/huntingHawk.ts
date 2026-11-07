import { line, place, px } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { hex } from "../../../utils/color";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { addStacks } from "../../enemies/skillStatus";
import { game, hero, progress, rng } from "../../state";
import { skillValues, withCharms } from "../query";
import { nearestFoe } from "../targets";

const ID = "s_hawk";
/** flight speed, how near is a strike, how long a lone dive lingers before it leaves, and the carry's drop delay */
const FLIGHT = { speed: 210, perch: 160, reach: 5, lone: 1.6, linger: 0.6, drop: 0.55 } as const;
const FEATHER = hex("#8a5a34");
const FEATHER_DARK = hex("#4a2e1a");
const BREAST = hex("#e8d2a8");
/** poison a Shrike Flock dive lays, with Venom Tips' tick when it is not held */
const SHRIKE_POISON = { rate: 0.3, max: 30, time: 6, tick: 0.5 } as const;

interface Hawk {
  x: number;
  y: number;
  /** seconds it still hunts */
  life: number;
  target: Enemy | null;
  /** seconds until its next dive */
  next: number;
  flap: number;
}

interface HawkMemory {
  cd: number;
  hawks: Hawk[];
  /** carried foes waiting to be dropped, with the seconds left */
  drops: { foe: Enemy; t: number }[];
}

const memoryOf = (m: SkillMemory): HawkMemory => m as unknown as HawkMemory;

/** where a hawk circles while it waits: over Sable's shoulder */
const perch = (i: number): readonly [number, number] => [hero.x - hero.face * (8 + i * 10), hero.y - 42 - (i % 2) * 6];

/** hawks come down from the sky behind her; a call with hawks already up sends them in again */
function call(m: HawkMemory, foe: Enemy | null): void {
  const v = skillValues(ID);
  const count = Math.round(withCharms("amount", v.hawks));
  const life = v.stay ? withCharms("duration", v.stay) : FLIGHT.lone;
  while (m.hawks.length < count) {
    const [x, y] = perch(m.hawks.length);
    m.hawks.push({ x: x - hero.face * 40, y: y - 40, life, target: null, next: 0, flap: rng.range(0, 6) });
  }
  for (const h of m.hawks) {
    h.life = Math.max(h.life, life);
    if (h.next <= 0 || !h.target) h.target = foe;
  }
  m.cd = withCharms("cooldown", v.cooldown);
}

/** the dive lands: damage, a throw up, Shrike Flock's poison, and the carry */
function strike(m: HawkMemory, h: Hawk, e: Enemy): void {
  const v = skillValues(ID);
  const [cx, cy] = enemyCenter(e);
  dealDamage(e, progress.stats.ad * v.power, {
    fromX: h.x,
    kx: Math.sign(cx - h.x) * 40,
    ky: -30,
    launch: v.launch ? -(v.carry ? 260 : v.launch) : undefined,
    source: ID,
  });
  game.fx.push(createImpact(cx, cy, Math.sign(cx - h.x) || 1, false));
  if (v.carry) m.drops.push({ foe: e, t: FLIGHT.drop });
  if (v.venom) {
    const venom = skillValues("s_venom");
    const rate = venom.rate ?? SHRIKE_POISON.rate;
    addStacks(e, "s_venom", {
      stacks: v.venom,
      max: venom.max ?? SHRIKE_POISON.max,
      damage: progress.stats.ad * rate * SHRIKE_POISON.tick,
      every: SHRIKE_POISON.tick,
      duration: venom.time ?? SHRIKE_POISON.time,
    });
  }
}

/** a hawk dives at its foe, strikes, climbs back to its perch and waits; it leaves when its time is up */
function fly(m: HawkMemory, h: Hawk, i: number, dt: number): boolean {
  const v = skillValues(ID);
  h.life -= dt;
  h.next -= dt;
  h.flap += dt * 14;
  const diving = h.next <= 0 && h.life > 0;
  if (diving && (!h.target || h.target.hp <= 0)) h.target = nearestFoe(h.x, h.y);
  const [px0, py0] = perch(i);
  // a hawk whose time is up climbs away off the top of the screen
  const [tx, ty] = diving && h.target ? enemyCenter(h.target) : h.life > 0 ? [px0, py0] : [px0, py0 - 120];
  const dx = tx - h.x;
  const dy = ty - h.y;
  const d = Math.hypot(dx, dy);
  const speed = withCharms("speed", diving ? FLIGHT.speed : FLIGHT.perch) * dt;
  if (d > 0.5) {
    h.x += (dx / d) * Math.min(d, speed);
    h.y += (dy / d) * Math.min(d, speed);
  }
  if (diving && h.target && d < FLIGHT.reach) {
    strike(m, h, h.target);
    h.target = null;
    h.next = v.every;
  }
  return h.life > -FLIGHT.linger;
}

/** Hunting Hawk: a landed bolt may call a hawk that dives on the foe; it stays and dives again, two hawks, a carry, and
 *  Shrike Flock's four hawks that never leave and poison */
export const huntingHawk: SkillBehavior = {
  create: () => ({ cd: 0, hawks: [], drops: [] }),
  update(memory, state, dt) {
    const m = memoryOf(memory);
    m.cd -= dt;
    if (state.evolved && m.hawks.length < skillValues(ID).hawks) call(m, null);
    m.hawks = m.hawks.filter((h, i) => fly(m, h, i, dt));
    for (const d of m.drops) {
      d.t -= dt;
      if (d.t <= 0 && d.foe.hp > 0)
        dealDamage(d.foe, progress.stats.ad * skillValues(ID).carry, { ky: 120, heavy: true, source: ID });
    }
    m.drops = m.drops.filter((d) => d.t > 0);
  },
  draw(memory) {
    const m = memoryOf(memory);
    place();
    for (const h of m.hawks) {
      const flip = Math.sin(h.flap) * 3;
      line(h.x - 4, h.y - flip, h.x, h.y, FEATHER_DARK);
      line(h.x + 4, h.y - flip, h.x, h.y, FEATHER_DARK);
      line(h.x - 1, h.y, h.x + 1, h.y, FEATHER);
      px(h.x, h.y + 1, BREAST);
      px(h.x, h.y - 1, FEATHER);
    }
  },
  on: {
    blow(memory, event) {
      const m = memoryOf(memory);
      if (m.cd > 0 || !rng.chance(skillValues(ID).chance)) return;
      call(m, event.foe);
    },
    airString(memory) {
      // Skyhunter: every air string calls a hawk
      const m = memoryOf(memory);
      if (skillValues("s_featherdraw").fan) call(m, null);
    },
  },
};
