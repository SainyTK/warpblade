import { BEAR, SPIRIT, SUMMON_GATE } from "../../../constants/hulda/spirits";
import { W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { clamp } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createBellowRing } from "../../effects/bellowRing";
import { createFloorRing } from "../../effects/floorRing";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { game, hero, particles, progress, rng } from "../../state";
import { dust, shake } from "../../world";
import { skillValues, withCharms } from "../query";
import { distance2, nearestFoe } from "../targets";
import { type BearPose, blitBear } from "./bearSprite";

const ID = "h_spiritBear";

type BearState = "drop" | "roar" | "stand" | "maul" | "leave";

interface Bear {
  x: number;
  /** its feet, and the floor it lands on */
  y: number;
  floor: number;
  face: number;
  state: BearState;
  /** seconds in the state */
  t: number;
  /** seconds it stays after landing; Infinity for a clan bear */
  stay: number;
  /** seconds until its next maul */
  maulCd: number;
  /** it walked this step */
  moving: boolean;
  alpha: number;
}

interface BearMemory {
  cd: number;
  bears: Bear[];
}

const memoryOf = (m: SkillMemory): BearMemory => m as unknown as BearMemory;
const MAUL_TIME = 0.22;

/** the foes on the floor around a point within r */
function foesNear(x: number, floor: number, r: number): Enemy[] {
  return game.enemies.filter((e) => {
    if (e.hp <= 0) return false;
    const [cx, cy] = enemyCenter(e);
    return Math.abs(cx - x) <= r && cy > floor - 50 && cy < floor + 8;
  });
}

/** the bear crashes onto the landing: every foe in its radius takes the drop, and with the roar the foes near are dragged in */
function land(b: Bear): void {
  const v = skillValues(ID);
  const r = withCharms("area", v.radius);
  for (const e of foesNear(b.x, b.floor, r)) {
    const [cx, cy] = enemyCenter(e);
    dealDamage(e, progress.stats.ad * v.drop, { source: ID, fromX: b.x, kx: Math.sign(cx - b.x) * 80, stun: 0.5 });
    game.fx.push(createImpact(cx, cy, Math.sign(cx - b.x) || 1, true, SPIRIT));
  }
  game.fx.push(createFloorRing(b.x, b.floor, r, SPIRIT, 0.4));
  dust(b.x, b.floor, 8);
  shake(0.15, 2);
  sfx.boom();
  if (v.roar) {
    const caught = foesNear(b.x, b.floor, withCharms("area", BEAR.roar));
    game.fx.push(createBellowRing(b.x + b.face * 14, b.floor - 14, caught, [b.x, b.floor], SPIRIT));
    sfx.tone(110, 60, 0.3, "sawtooth", 0.06);
    b.state = "roar";
  } else b.state = "stand";
  b.t = 0;
}

/** a maul: the paw swipes at the nearest foe in reach, or at every foe near with the swipe */
function maul(b: Bear): void {
  const v = skillValues(ID);
  const near = foesNear(b.x + b.face * 10, b.floor, v.swipe ? BEAR.reach : BEAR.bite);
  const targets = v.swipe ? near : near.slice(0, 1);
  for (const e of targets) {
    const [cx, cy] = enemyCenter(e);
    dealDamage(e, progress.stats.ad * v.maul, { source: ID, fromX: b.x, kx: b.face * 60, stun: 0.2 });
    game.fx.push(createImpact(cx, cy, b.face, false, SPIRIT));
  }
  if (targets.length) sfx.hit(false, 0.7);
}

/** standing: it walks to the nearest foe and mauls it; a clan bear with nothing near keeps at the hero's side */
function stand(b: Bear, dt: number, clan: boolean): void {
  const v = skillValues(ID);
  b.maulCd -= dt;
  const foe = nearestFoe(b.x, b.floor - 12);
  const far = !foe || distance2(foe, b.x, b.floor - 12) > 100 ** 2;
  const goal = clan && far ? hero.x - hero.face * 18 : foe ? foe.x : b.x;
  const dx = goal - b.x;
  b.moving = Math.abs(dx) > BEAR.bite;
  if (b.moving) {
    b.face = Math.sign(dx);
    b.x = clamp(b.x + b.face * BEAR.walk * dt * (clan && far ? 2 : 1), 8, W - 8);
    b.floor = clan && far ? hero.y : b.floor;
    b.y = b.floor;
  } else if (foe && !far && b.maulCd <= 0) {
    b.state = "maul";
    b.t = 0;
    b.maulCd = withCharms("cooldown", v.every);
    maul(b);
  }
}

/** false once it has faded out */
function live(b: Bear, dt: number): boolean {
  b.t += dt;
  b.stay -= dt;
  if (b.state === "leave") {
    b.alpha -= dt / BEAR.fade;
    return b.alpha > 0;
  }
  b.alpha = Math.min(1, b.alpha + dt / BEAR.fade);
  if (rng.chance(dt * 6)) {
    particles.spawn(PK.MOTE, b.x + rng.range(-10, 10), b.y - rng.range(10, 20), 0, -rng.range(10, 25), 0.6, {
      col: SPIRIT[rng.int(4, 6)],
      size: 0.6,
    });
  }
  if (b.state === "drop") {
    b.y = Math.min(b.floor, b.y + BEAR.fall * dt);
    if (b.y >= b.floor) land(b);
    return true;
  }
  if ((b.state === "roar" && b.t >= BEAR.roarTime) || (b.state === "maul" && b.t >= MAUL_TIME)) {
    b.state = "stand";
    b.t = 0;
  }
  if (b.stay <= 0) {
    b.state = "leave";
    return true;
  }
  if (b.state === "stand") stand(b, dt, !Number.isFinite(b.stay));
  return true;
}

/** a bear drops onto a landing spot from above */
function drop(b: Bear, x: number, floor: number): void {
  Object.assign(b, { x: clamp(x, 8, W - 8), floor, y: floor - BEAR.height, state: "drop", t: 0 });
}

function call(m: BearMemory, x: number, floor: number): void {
  const v = skillValues(ID);
  const b: Bear = { x, y: 0, floor, face: hero.face, state: "drop", t: 0, stay: 0, maulCd: 0, moving: false, alpha: 0 };
  drop(b, x, floor);
  b.stay = v.stay ? withCharms("duration", v.stay) + BEAR.height / BEAR.fall : BEAR.height / BEAR.fall + 0.5;
  m.bears.push(b);
  m.cd = Math.max(SUMMON_GATE, withCharms("cooldown", v.cooldown));
}

/** Bear Clan: its bears stay for good at her side */
function keepClan(m: BearMemory): void {
  const want = skillValues(ID).clan;
  while (m.bears.filter((b) => !Number.isFinite(b.stay)).length < want) {
    const b: Bear = {
      x: hero.x,
      y: 0,
      floor: hero.y,
      face: hero.face,
      state: "drop",
      t: 0,
      stay: Infinity,
      maulCd: 0,
      moving: false,
      alpha: 0,
    };
    drop(b, hero.x - hero.face * (16 + m.bears.length * 22), hero.y);
    m.bears.push(b);
  }
}

/** the bear's look for its state */
function poseOf(b: Bear): BearPose {
  const u = Math.min(1, b.t / MAUL_TIME);
  switch (b.state) {
    case "drop":
      return { rear: 0.15, reach: 0, jaw: 0.5, step: 0, spread: 1 };
    case "roar":
      return { rear: 0.35, reach: 0, jaw: 1, step: 0, spread: 0 };
    case "maul":
      return { rear: 0.5 * (1 - u) + 0.1, reach: u < 0.5 ? u * 2 : 2 - u * 2, jaw: 0.6, step: 0, spread: 0 };
    default:
      return { rear: 0, reach: 0, jaw: 0, step: b.moving ? Math.sin(b.t * 9) : 0, spread: 0 };
  }
}

/**
 * Spirit Bear: a throw may call a spirit bear that crashes down where the foe lands; levels let it stay and maul, roar
 * foes in, swipe every foe near, and answer slams too. Bear Clan keeps two at her side for good, and every throw drops
 * both on the landing.
 */
export const spiritBear: SkillBehavior = {
  create: () => ({ cd: 0, bears: [] }),
  update(memory, state, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
    if (state.evolved) keepClan(m);
    m.bears = m.bears.filter((b) => live(b, dt));
  },
  drawBack(memory) {
    for (const b of memoryOf(memory).bears) blitBear(poseOf(b), b.x, b.y, b.face, b.alpha);
  },
  on: {
    throw(memory, event, state) {
      const m = memoryOf(memory);
      const v = skillValues(ID);
      if (event.slam && !v.slams) return;
      if (state.evolved) {
        for (const b of m.bears)
          if (!Number.isFinite(b.stay) && b.state !== "drop") drop(b, event.x + rng.range(-8, 8), event.y);
        return;
      }
      if (m.cd > 0) return;
      if (rng.chance(v.chance)) call(m, event.x, event.y);
      else m.cd = SUMMON_GATE;
    },
  },
};
