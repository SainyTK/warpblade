import { ENEMIES } from "../../constants/enemies";
import { TITAN } from "../../constants/hulda/ultimates";
import { W } from "../../constants/stage";
import { ULT_LEVELS } from "../../constants/ultimate";
import { glow, line, place } from "../../engine/frame";
import { sfx } from "../../services/audio";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { clamp } from "../../utils/math";
import { dealDamage } from "../damage";
import { createFloorRing } from "../effects/floorRing";
import { createImpact } from "../effects/impact";
import { enemyBox, enemyCenter } from "../enemies/enemy";
import { kindOf } from "../enemies/kinds";
import { claim, isClaimed, unclaim } from "../hero/hulda/claims";
import { skin } from "../hero/skin";
import { skillValues, withCharms } from "../skills/query";
import { game, hero, lights, progress } from "../state";
import { boxHit, dust, hitStop, newSwing, shake } from "../world";
import { ultTargets } from "./targets";

interface Pulled {
  e: Enemy;
  /** where it was when the tether caught it */
  x0: number;
  y0: number;
  /** its place in the heap, around the heap's centre */
  ox: number;
  oy: number;
}

/** a heap foe the scattered heap flung, striking the foes it meets until it lands */
interface Scattered {
  e: Enemy;
  struck: Set<Enemy>;
}

const GRAVITY = 900;

/** hold a foe at a point, frozen so its own update leaves it there */
function hold(e: Enemy, x: number, y: number): void {
  e.x = clamp(x, 10, W - 10);
  e.y = y;
  e.vx = 0;
  e.vy = 0;
  e.air = false;
  e.stun = Math.max(e.stun, 0.1);
  claim(e);
}

/** the foes the tethers reach: the level's side and the skill's reach, minions only, fliers once the tethers catch them */
function tethered(level: number, reach: number, fliers: boolean): Enemy[] {
  return ultTargets(level).filter((e) => {
    if (!ENEMIES[e.type].launchable || isClaimed(e)) return false;
    if (kindOf(e.type).flies && !fliers) return false;
    return level >= 4 || Math.abs(e.x - hero.x) <= reach;
  });
}

/**
 * Titan Throw, Hulda's ultimate skill in place of Quake Drop: crimson tethers yank minions in reach into a heap in her
 * arms, she spins once and hurls the heap ahead as one body. It strikes every foe in its path and bursts where it lands,
 * each foe in the heap and near the landing taking the skill's share of the level's power. Levels catch fliers, drag
 * minis and bosses to the landing, bounce the heap into a second burst, shorten the recharge and scatter the heap into
 * flying bodies. Mountain Hurl swings the heap round twice first, striking everything near, then fires it flat to the
 * wall.
 *
 * Per cast against Quake Drop at charge level 3 (7x on each foe it reaches): at level 8 a heap foe takes the path, two
 * bursts at 3x and a scattered flight, about 6.5 times Quake Drop's hit; evolved, two swing hits, the wall flight and two
 * bursts at 4x, about 13 times.
 */
export function castTitanThrow(level: number): void {
  const v = skillValues("h_titanThrow");
  const power = ULT_LEVELS[level - 1].power * progress.stats.ad;
  const face = hero.face;
  const ramp: Ramp = skin.ramp;
  const swingTime = v.swing ? TITAN.swing : 0;
  const burstR = withCharms("area", TITAN.burst);
  hero.ultCd = withCharms("cooldown", v.cooldown);
  const pulled: Pulled[] = tethered(level, withCharms("area", v.reach), v.fliers > 0).map((e, i) => ({
    e,
    x0: e.x,
    y0: e.y,
    ox: ((i % 3) - 1) * 4,
    oy: -Math.floor(i / 3) * 5,
  }));
  const big = v.big ? ultTargets(level).filter((e) => !ENEMIES[e.type].launchable) : [];
  const struck = new Set<Enemy>(pulled.map((p) => p.e));
  const scattered: Scattered[] = [];
  const heapAt = (): [number, number] => [hero.x + face * TITAN.heap.x, hero.y + TITAN.heap.y];
  let t = 0;
  let flying = false;
  let bursts = 0;
  let hx = 0;
  let hy = 0;
  let vx = 0;
  let vy = 0;
  let turn = -1;
  const alive = () => pulled.filter((p) => p.e.hp > 0);

  /** Mountain Hurl: each turn of the swing strikes every foe near her once */
  const swingHits = (a: number) => {
    const now = Math.floor(a / (Math.PI * 2));
    if (now === turn) return;
    turn = now;
    newSwing();
    for (const e of game.enemies) {
      if (struck.has(e) || e.hp <= 0 || Math.abs(enemyCenter(e)[0] - hero.x) > TITAN.swingReach) continue;
      dealDamage(e, power * v.path, {
        fromX: hero.x,
        kx: Math.sign(e.x - hero.x) * 140,
        heavy: true,
        source: "ultimate",
      });
    }
    sfx.swing(0.5);
  };

  /** the heap foes become bodies flung both ways, each striking the foes it meets */
  const scatter = (heap: Pulled[]) => {
    heap.forEach((p, i) => {
      const dir = i % 2 ? -face : face;
      Object.assign(p.e, { air: true, airTime: 0, airHits: 0, stun: 0, vx: dir * TITAN.scatter, vy: TITAN.lift });
      scattered.push({ e: p.e, struck: new Set([p.e]) });
    });
  };

  /** the heap lands: it and every foe near take the burst; dragged big foes are there to take it */
  const burst = () => {
    const floor = hero.y;
    bursts++;
    const heap = alive();
    for (const e of big) {
      if (e.hp <= 0) continue;
      e.x = clamp(hx + Math.sign(e.x - hx || face) * 12, 10, W - 10);
      e.stun = Math.max(e.stun, 0.6);
    }
    for (const p of heap) {
      p.e.y = p.e.y > floor ? floor : p.e.y;
      dealDamage(p.e, power * v.burst, { fromX: hx - face * 10, kx: face * 80, heavy: true, source: "ultimate" });
    }
    for (const e of game.enemies) {
      if (struck.has(e) || e.hp <= 0) continue;
      if (Math.abs(enemyCenter(e)[0] - hx) > burstR) continue;
      dealDamage(e, power * v.burst, { fromX: hx, kx: Math.sign(e.x - hx) * 120, heavy: true, source: "ultimate" });
      if (!ENEMIES[e.type].launchable) e.stun = Math.max(e.stun, 0.6);
    }
    game.fx.push(createFloorRing(hx, floor, burstR * 1.4, ramp, 0.5));
    game.fx.push(createImpact(hx, floor - 10, face, true));
    lights.add(hx, floor - 10, 70, ramp[4], 1, 0.4);
    dust(hx, floor, 14);
    hitStop(0.1);
    shake(0.4, 4);
    sfx.boom();
    if (v.bounce && bursts === 1 && heap.length) {
      vx *= 0.6;
      vy = TITAN.lift * 0.7;
      hy = floor - 1;
      return true;
    }
    for (const p of heap) unclaim(p.e);
    if (v.scatter) scatter(heap);
    return false;
  };

  /** the flying heap strikes each foe in its path once */
  const strikePath = () => {
    const zone = [hx - 10, hy - 14, hx + 10, hy + 6] as const;
    for (const e of game.enemies) {
      if (struck.has(e) || e.hp <= 0 || !boxHit([...zone], enemyBox(e))) continue;
      struck.add(e);
      dealDamage(e, power * v.path, {
        fromX: hx - face * 10,
        kx: face * 160,
        stun: 0.6,
        heavy: true,
        source: "ultimate",
      });
      game.fx.push(createImpact(enemyCenter(e)[0], enemyCenter(e)[1], face, true));
      sfx.hit(true, 0.8);
    }
  };

  /** a scattered body flies until it lands */
  const flyScattered = (s: Scattered): boolean => {
    if (s.e.hp <= 0 || !s.e.air) return false;
    const box = enemyBox(s.e);
    for (const e of game.enemies) {
      if (s.struck.has(e) || e.hp <= 0 || !boxHit(box, enemyBox(e))) continue;
      s.struck.add(e);
      dealDamage(e, power * v.path, {
        fromX: s.e.x,
        kx: Math.sign(s.e.vx) * 140,
        stun: 0.5,
        heavy: true,
        source: "ultimate",
      });
    }
    return true;
  };

  let landed = false;
  const effect: Effect = {
    update(dt) {
      t += dt;
      const heap = alive();
      if (landed) {
        scattered.splice(0, scattered.length, ...scattered.filter(flyScattered));
        return scattered.length > 0;
      }
      if (!flying && t < TITAN.pull) {
        const u = t / TITAN.pull;
        const [cx, cy] = heapAt();
        for (const p of heap) hold(p.e, p.x0 + (cx + p.ox - p.x0) * u, p.y0 + (cy + p.oy - p.y0) * u);
        return true;
      }
      if (!flying && t < TITAN.pull + swingTime + TITAN.spin) {
        const spinT = t - TITAN.pull;
        const turns = spinT < swingTime ? 2 : 1;
        const span = spinT < swingTime ? swingTime : TITAN.spin;
        const a = ((spinT < swingTime ? spinT : spinT - swingTime) / span) * Math.PI * 2 * turns;
        const r = spinT < swingTime ? TITAN.swingRadius : TITAN.heap.x;
        if (spinT < swingTime) swingHits(a);
        const [, cy] = heapAt();
        for (const p of heap) hold(p.e, hero.x + Math.cos(a) * face * r + p.ox, cy + p.oy);
        return true;
      }
      if (!flying) {
        flying = true;
        [hx, hy] = heapAt();
        vx = face * (v.swing ? TITAN.hurl : TITAN.speed);
        vy = v.swing ? 0 : TITAN.lift;
        sfx.swing(0.5);
        if (!heap.length) return false;
      }
      if (!v.swing || bursts > 0) vy += GRAVITY * dt;
      hx += vx * dt;
      hy += vy * dt;
      for (const p of heap) hold(p.e, hx + p.ox, hy + p.oy);
      strikePath();
      const atWall = hx <= 8 || hx >= W - 8;
      if (hy < hero.y && !atWall) return true;
      hx = clamp(hx, 8, W - 8);
      if (burst()) return true;
      landed = true;
      return scattered.length > 0;
    },
    draw() {
      place();
      const heap = alive();
      if (!flying && t < TITAN.pull) {
        // a tether from her hands to each foe it drags in
        const [hx0, hy0] = [hero.x + face * 6, hero.y - 20];
        for (const p of heap) {
          const [ex, ey] = enemyCenter(p.e);
          line(hx0, hy0, ex, ey, (u) => (u < 0.5 ? ramp[4] : ramp[5]), 0.9);
          glow(ex, ey, 6, ramp[4], 0.3);
        }
        return;
      }
      if (flying && !landed) glow(hx, hy - 4, 16, ramp[3], 0.35);
    },
  };
  game.fx.push(effect);
  lights.add(hero.x, hero.y - 20, 60, ramp[4], 0.8, 0.4);
}
