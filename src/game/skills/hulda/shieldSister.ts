import { SISTER, SUMMON_GATE } from "../../../constants/hulda/spirits";
import { W } from "../../../constants/stage";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import type { SpriteImage } from "../../../types/sprite";
import { dealDamage } from "../../damage";
import { enemyBox } from "../../enemies/enemy";
import { game, hero, progress, rng } from "../../state";
import { boxHit, surfaceBelow } from "../../world";
import { skillEvolved, skillValues, withCharms } from "../query";
import { nearestFoe } from "../targets";
import { drawSister, sisterFrames } from "./sisterSprite";

const ID = "h_shieldSister";

interface Sister {
  x: number;
  y: number;
  dir: number;
  /** pixels left of the charge under way; 0 while she rests */
  left: number;
  length: number;
  /** passes back still to run in this charge */
  passes: number;
  struck: Enemy[];
  /** seconds she stays charging; past it she fades once the charge ends */
  stay: number;
  /** seconds until her next charge while she stays */
  rest: number;
  /** 0 to 1 as she fades in, then down to 0 as she leaves */
  alpha: number;
  leaving: boolean;
  /** a wall sister of the evolution */
  wall: boolean;
  t: number;
  frames: readonly [SpriteImage, SpriteImage];
}

interface SisterMemory {
  cd: number;
  /** seconds until the evolved wall sends the next sister in */
  wallT: number;
  /** the side the next wall sister comes from */
  wallSide: number;
  sisters: Sister[];
}

const memoryOf = (m: SkillMemory): SisterMemory => m as unknown as SisterMemory;

/** the floor under the hero: sisters charge along it */
const floorY = (): number => (hero.ground ? hero.y : surfaceBelow(hero.x, hero.y));

function spawn(m: SisterMemory, x: number, dir: number, length: number, wall = false): void {
  const v = skillValues(ID);
  m.sisters.push({
    x,
    y: floorY(),
    dir,
    left: length,
    length,
    passes: v.back && !wall ? 1 : 0,
    struck: [],
    stay: wall ? 0 : withCharms("duration", v.stay),
    rest: 0,
    alpha: 0,
    leaving: false,
    wall,
    t: 0,
    frames: sisterFrames(),
  });
}

/** a call: `count` sisters charge from just behind the hero the way she faces */
function call(m: SisterMemory): void {
  const v = skillValues(ID);
  const count = Math.round(withCharms("amount", v.count));
  const length = withCharms("area", v.length);
  for (let i = 0; i < count; i++) spawn(m, hero.x - hero.face * (SISTER.start + i * SISTER.gap), hero.face, length);
  m.cd = Math.max(SUMMON_GATE, withCharms("cooldown", v.cooldown));
}

/** her shield meets every foe in its box once a pass */
function strike(s: Sister): void {
  const v = skillValues(ID);
  const [x0, y0, x1, y1] = SISTER.box;
  const box: [number, number, number, number] = [s.x + x0, s.y + y0, s.x + x1, s.y + y1];
  for (const e of game.enemies) {
    if (e.hp <= 0 || s.struck.includes(e) || !boxHit(box, enemyBox(e))) continue;
    s.struck.push(e);
    dealDamage(e, progress.stats.ad * v.power, {
      source: ID,
      fromX: s.x - s.dir * 6,
      kx: s.dir * SISTER.kick,
      stun: v.stun || undefined,
      heavy: v.stun > 0,
    });
  }
}

/** a charge ends: back the other way, rest before the next while she stays, or leave */
function endPass(s: Sister): void {
  s.struck = [];
  if (s.passes > 0) {
    s.passes--;
    s.dir = -s.dir;
    s.left = s.length;
    return;
  }
  s.left = 0;
  if (s.stay > 0) s.rest = SISTER.rest;
  else s.leaving = true;
}

/** she turns toward the nearest foe and charges again */
function recharge(s: Sister): void {
  const foe = nearestFoe(s.x, s.y - 12);
  if (!foe) return;
  s.dir = Math.sign(foe.x - s.x) || s.dir;
  s.left = s.length;
  s.passes = skillValues(ID).back ? 1 : 0;
}

/** false once she has faded out */
function move(s: Sister, dt: number): boolean {
  s.t += dt;
  s.stay -= dt;
  s.alpha = s.leaving ? s.alpha - dt / SISTER.fade : Math.min(1, s.alpha + dt / SISTER.fade);
  if (s.leaving) return s.alpha > 0;
  if (s.left > 0) {
    const step = Math.min(s.left, SISTER.speed * dt);
    s.x += s.dir * step;
    s.left -= step;
    strike(s);
    if (s.x < 6 || s.x > W - 6) s.left = 0;
    if (s.left <= 0) endPass(s);
    return true;
  }
  s.rest -= dt;
  if (s.stay <= 0) s.leaving = true;
  else if (s.rest <= 0) recharge(s);
  return true;
}

/** Shieldwall: sisters charge in across the floor from either screen edge in turn, a few at a time */
function wall(m: SisterMemory, dt: number): void {
  const v = skillValues(ID);
  m.wallT -= dt;
  if (m.wallT > 0 || m.sisters.filter((s) => s.wall).length >= v.count) return;
  m.wallT = withCharms("cooldown", v.every);
  m.wallSide = -m.wallSide;
  spawn(m, m.wallSide > 0 ? 6 : W - 6, m.wallSide, W - 12, true);
}

/**
 * Shield-Sister: a landed blow may call spectral shield-sisters of her clan who charge through foes along the floor;
 * levels add a pass back, a stunning bash, a stay and a second sister. Shieldwall sends them in from both edges for
 * good. With Thundering Herd (Stampede evolved), two charge beside each Bull Rush.
 */
export const shieldSister: SkillBehavior = {
  create: () => ({ cd: 0, wallT: 0, wallSide: 1, sisters: [] }),
  update(memory, state, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
    if (state.evolved) wall(m, dt);
    m.sisters = m.sisters.filter((s) => move(s, dt));
  },
  draw(memory) {
    for (const s of memoryOf(memory).sisters) {
      const stride = s.left > 0 ? Math.floor(s.t * 10) % 2 : 0;
      drawSister(s.frames, s.x, s.y, s.dir, stride, s.alpha);
    }
  },
  on: {
    blow(memory, event, state) {
      const m = memoryOf(memory);
      if (state.evolved || event.source !== "attacks" || m.cd > 0) return;
      if (rng.chance(skillValues(ID).chance)) call(m);
      else m.cd = SUMMON_GATE;
    },
    dash(memory, event) {
      if (!skillEvolved("h_stampede")) return;
      const m = memoryOf(memory);
      for (const side of [0, 1])
        spawn(m, hero.x - event.dir * (SISTER.herdBack + side * SISTER.gap), event.dir, SISTER.herdLength);
    },
  },
};
