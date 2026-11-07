import { ENEMIES } from "../../../constants/enemies";
import { FIST, SPIRIT, SUMMON_GATE } from "../../../constants/hulda/spirits";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { createImpact } from "../../effects/impact";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { markFoe } from "../../enemies/skillStatus";
import { isClaimed } from "../../hero/hulda/claims";
import { gainFury } from "../../hero/hulda/fury";
import { game, hero, lights, progress, rng } from "../../state";
import { boxHit, dust, hitStop, shake } from "../../world";
import { skillEvolved, skillValues, withCharms } from "../query";
import { nearestFoe } from "../targets";
import { drawAncestorFist } from "./fistSprite";

const ID = "h_ancestorFist";
/** Unbreakable Wall calls at most this many fists in one brace */
const WALL_FISTS = 3;

interface Fist {
  target: Enemy;
  x: number;
  /** the knuckles' height, and where they strike */
  y: number;
  goal: number;
  /** seconds it hangs before it falls; then seconds it lingers after the slam */
  wait: number;
  falling: boolean;
  struck: boolean;
  /** this fist calls a second one when it lands */
  leads: boolean;
  alpha: number;
}

/** an attacker the fist threw: it strikes the foes it meets until it lands */
interface Hurled {
  e: Enemy;
  struck: Enemy[];
}

interface FistMemory {
  cd: number;
  /** fists Unbreakable Wall has called in the brace under way */
  braceCalls: number;
  fists: Fist[];
  hurled: Hurled[];
}

const memoryOf = (m: SkillMemory): FistMemory => m as unknown as FistMemory;

/** where the fist's knuckles meet a foe: the top of its body */
const strikeHeight = (e: Enemy): number => enemyBox(e)[1] + 2;

function summon(m: FistMemory, target: Enemy, delay: number, leads: boolean): void {
  const goal = strikeHeight(target);
  const [cx] = enemyCenter(target);
  m.fists.push({
    target,
    x: cx,
    y: goal - FIST.height,
    goal,
    wait: delay,
    falling: false,
    struck: false,
    leads,
    alpha: 0,
  });
}

function call(m: FistMemory, target: Enemy): void {
  summon(m, target, FIST.hang, skillValues(ID).second > 0);
  m.cd = Math.max(SUMMON_GATE, withCharms("cooldown", skillValues(ID).cooldown));
  sfx.tone(70, 50, 0.25, "sawtooth", 0.05);
}

/** throw the attacker at the nearest crowd */
function hurl(m: FistMemory, e: Enemy): void {
  if (e.hp <= 0 || !ENEMIES[e.type].launchable || isClaimed(e)) return;
  const other = nearestFoe(e.x, e.y, [e]);
  const dir = other ? Math.sign(other.x - e.x) || hero.face : hero.face;
  Object.assign(e, { air: true, airTime: 0, airHits: 0, stun: 0, vx: dir * FIST.throwVx, vy: FIST.throwVy });
  m.hurled.push({ e, struck: [e] });
}

/** the knuckles land: the slam, its ring, the pin, Fury, the throw and the second fist */
function slam(m: FistMemory, f: Fist, evolved: boolean): void {
  const v = skillValues(ID);
  const e = f.target;
  if (e.hp > 0) {
    dealDamage(e, progress.stats.ad * v.power, { source: ID, fromX: f.x, kx: 0, stun: 0.8, heavy: true });
    game.fx.push(createImpact(f.x, f.goal, 1, true, SPIRIT));
  }
  const floor = e.air ? f.goal + 14 : e.y;
  const radius = withCharms("area", Math.max(v.ring, v.pin ? 40 : 0));
  if (radius > 0) {
    for (const o of game.enemies) {
      if (o.hp <= 0) continue;
      const [ox] = enemyCenter(o);
      if (Math.abs(ox - f.x) > radius) continue;
      if (o !== e && v.ring)
        dealDamage(o, progress.stats.ad * v.power * 0.5, { source: ID, fromX: f.x, kx: Math.sign(ox - f.x) * 80 });
      if (v.pin) {
        o.stun = Math.max(o.stun, v.pin);
        markFoe(o, ID, v.pin, v.mark);
      }
    }
    game.fx.push(createFloorRing(f.x, floor, radius, SPIRIT, 0.45));
  }
  gainFury(v.fury);
  if (v.throw) hurl(m, e);
  if (f.leads) {
    const next = nearestFoe(f.x, f.goal, [e]);
    if (next) summon(m, next, FIST.second, false);
  }
  lights.add(f.x, f.goal, evolved ? 70 : 40, SPIRIT[5], 0.9, 0.25);
  dust(f.x, floor, evolved ? 14 : 8);
  hitStop(evolved ? 0.1 : 0.06);
  shake(evolved ? 0.35 : 0.2, evolved ? 4 : 2.5);
  sfx.boom();
}

/** false once it has faded away */
function move(m: FistMemory, f: Fist, dt: number, evolved: boolean): boolean {
  f.alpha = f.struck ? f.alpha - dt / FIST.linger : Math.min(1, f.alpha + dt / FIST.hang);
  if (f.struck) return f.alpha > 0;
  if (f.target.hp > 0) {
    f.x = enemyCenter(f.target)[0];
    f.goal = strikeHeight(f.target);
  }
  if (!f.falling) {
    f.wait -= dt;
    f.y = f.goal - FIST.height;
    f.falling = f.wait <= 0;
    return true;
  }
  f.y += FIST.fall * dt;
  if (f.y < f.goal) return true;
  f.y = f.goal;
  f.struck = true;
  slam(m, f, evolved);
  return true;
}

/** a thrown attacker strikes each foe it meets for half the slam; false once it lands */
function fly(h: Hurled): boolean {
  if (h.e.hp <= 0 || !h.e.air) return false;
  const box = enemyBox(h.e);
  for (const o of game.enemies) {
    if (o.hp <= 0 || h.struck.includes(o) || !boxHit(box, enemyBox(o))) continue;
    h.struck.push(o);
    dealDamage(o, progress.stats.ad * skillValues(ID).power * 0.5, {
      source: ID,
      fromX: h.e.x,
      kx: Math.sign(h.e.vx) * 120,
      stun: 0.5,
      heavy: true,
    });
  }
  return true;
}

/**
 * Ancestor's Fist: a blow she takes on purpose (the rush, the haymaker's wind-up, Iron Wall's brace) may call a giant
 * spectral gauntlet down on the attacker; levels add a throw at the crowd, a ring, Fury and a second fist. Hand of the
 * Mountain is twice the size and pins every foe near. With Unbreakable Wall (Iron Wall evolved), each blow in the brace
 * calls one, keeping this skill's cooldown, at most three a brace. Its hits and throws call nothing in turn.
 */
export const ancestorFist: SkillBehavior = {
  create: () => ({ cd: 0, braceCalls: 0, fists: [], hurled: [] }),
  update(memory, state, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
    if (hero.state !== "brace") m.braceCalls = 0;
    m.fists = m.fists.filter((f) => move(m, f, dt, state.evolved));
    m.hurled = m.hurled.filter(fly);
  },
  draw(memory, state) {
    const scale = state.evolved ? FIST.evolvedScale : FIST.scale;
    for (const f of memoryOf(memory).fists) drawAncestorFist(f.x, f.y, scale, f.alpha);
  },
  on: {
    armour(memory, event) {
      if (!event.counter) return;
      const m = memoryOf(memory);
      const wall = event.kind === "brace" && skillEvolved("h_ironWall");
      if (m.cd > 0 || (wall && m.braceCalls >= WALL_FISTS)) return;
      const attacker = nearestFoe(event.fromX, hero.y - 14);
      if (!attacker) return;
      if (!wall && !rng.chance(skillValues(ID).chance)) {
        m.cd = SUMMON_GATE;
        return;
      }
      if (wall) m.braceCalls++;
      call(m, attacker);
    },
  },
};
