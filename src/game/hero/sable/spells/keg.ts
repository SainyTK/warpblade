import { W } from "../../../../constants/stage";
import { line, place, polygon, px } from "../../../../engine/frame";
import { sfx } from "../../../../services/audio";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import type { Box } from "../../../../types/world";
import { hex, WHITE } from "../../../../utils/color";
import { clamp } from "../../../../utils/math";
import { dealDamage } from "../../../damage";
import { createFloorRing } from "../../../effects/floorRing";
import { ignite } from "../../../enemies/burn";
import { enemyBox, enemyCenter } from "../../../enemies/enemy";
import { skillValues } from "../../../skills/query";
import { game, hero, lights, particles, progress, rng } from "../../../state";
import { boxHit, shake, surfaceBelow } from "../../../world";
import type { Shot } from "../bolt/shot";
import { sable } from "../memory";
import { lure } from "./decoy";
import type { SableSpell } from "./spell";

const WOOD = hex("#7a4e2c");
const WOOD_DARK = hex("#4a2e1a");
const BAND = hex("#5a6468");
const FIRE = hex("#ffb04a");
/** pixels it rolls out, and in how long */
const ROLL = { far: 60, time: 0.5 } as const;
/** a kicked keg flies this far at this speed */
const KICKED = { far: 150, speed: 260 } as const;
/** the blast of a keg left to fizzle, as a share of a full one */
const FIZZLE = 0.25;
/** how high above the floor a passing bolt still sets a keg off, pixels */
const SHOT_REACH = 26;
/** a blast sets off another keg this near, a moment later */
const CHAIN = { reach: 50, delay: 0.15 } as const;

/** a keg on the floor or in flight */
interface Keg extends Effect {
  box(): Box;
  /** blow it up; `mul` scales the blast */
  setOff(mul: number, delay?: number): void;
  kick(dir: number): void;
}

/** the kegs on the stage; kept apart from `game.fx`, which is emptied while effects update */
const kegs = new Set<Keg>();
const liveKegs = (): Keg[] => [...kegs];

/** a new run: no kegs */
export const clearKegs = (): void => kegs.clear();

/** a bolt flying through a keg sets it off, harder when the bolt is primed (Powder Keg) */
export function kegsOnSegment(ax: number, ay: number, bx: number, by: number, b: Shot): void {
  for (const k of liveKegs()) {
    // a bolt at her chest height passing over the keg still sets it off: the fuse stands tall and catches it
    const [x0, , x1, y1] = k.box();
    const y0 = y1 - SHOT_REACH;
    const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 2));
    for (let i = 0; i <= n; i++) {
      const x = ax + ((bx - ax) * i) / n;
      const y = ay + ((by - ay) * i) / n;
      if (x < x0 || x > x1 || y < y0 || y > y1) continue;
      const v = skillValues("s_keg");
      k.setOff(b.prime ? v.primedMul : 1);
      if (b.prime && v.mpBack) hero.mp = Math.min(progress.stats.mp, hero.mp + v.mpBack);
      break;
    }
  }
}

/** a waiting keg ahead of her, in range, with a foe in its blast: her shots go for it; null when there is none */
export function kegInSights(range: number): readonly [number, number] | null {
  const radius = skillValues("s_keg").radius ?? 0;
  for (const k of liveKegs()) {
    const [x0, , x1, y1] = k.box();
    const x = (x0 + x1) / 2;
    const ahead = (x - hero.x) * hero.face;
    if (ahead <= 0 || ahead > range) continue;
    if (game.enemies.some((e) => e.hp > 0 && Math.abs(enemyCenter(e)[0] - x) < radius)) return [x, y1 - 5];
  }
  return null;
}

/** her kick sends a keg it reaches flying (Powder Keg level 7) */
export function kickKegs(box: Box): void {
  if (!skillValues("s_keg").kick) return;
  for (const k of liveKegs()) if (boxHit(box, k.box())) k.kick(hero.face);
}

/** the blast: ability power to every foe in reach, thrown up, burning pitch; other kegs near it go off too */
function blast(x: number, y: number, mul: number): void {
  const v = skillValues("s_keg");
  const radius = v.radius;
  for (const e of game.enemies) {
    const [cx, cy] = enemyCenter(e);
    if (e.hp <= 0 || Math.hypot(cx - x, (cy - y) * 1.3) > radius) continue;
    dealDamage(e, progress.stats.ap * v.blast * mul, {
      fromX: x,
      kx: Math.sign(cx - x) * 140,
      ky: -70,
      launch: v.launch ? -v.launch : undefined,
      heavy: true,
      source: "abilities",
    });
    if (v.pitch) ignite(e, v.pitch);
  }
  for (const k of liveKegs()) {
    const [x0, , x1] = k.box();
    if (Math.abs((x0 + x1) / 2 - x) < CHAIN.reach) k.setOff(1, CHAIN.delay);
  }
  game.fx.push(createFloorRing(x, y, radius, [WOOD_DARK, WOOD, FIRE, FIRE, WHITE, WHITE], 0.4, 0.4));
  for (let i = 0; i < 18; i++)
    particles.spawn(PK.FIRE, x, y - 6, rng.range(-120, 120), -rng.range(40, 160), rng.range(0.3, 0.6), {
      col: 0,
      size: rng.range(1, 2),
    });
  lights.add(x, y - 8, radius + 20, FIRE, 1, 0.3);
  shake(0.25, 2 + mul);
  sfx.boom();
}

/** one powder keg: rolls out, waits, blows when shot, kicked into a foe, or set off by a blast; fizzles when left */
function rollKeg(x0: number, y: number, dir: number, from: number, far: number): void {
  const v = skillValues("s_keg");
  let x = x0;
  let ky = y;
  let t = 0;
  let fuse = -1;
  let mul = 1;
  let flying = 0;
  let flyDir = dir;
  const keg: Keg = {
    box: () => [x - 4, ky - 9, x + 4, ky],
    setOff(m, delay = 0) {
      if (fuse >= 0) return;
      mul = m;
      fuse = delay;
    },
    kick(d) {
      flying = KICKED.far;
      flyDir = d;
    },
    update(dt) {
      t += dt;
      if (fuse >= 0) {
        fuse -= dt;
        if (fuse > 0) return true;
        kegs.delete(keg);
        blast(x, ky, mul);
        return false;
      }
      if (flying > 0) {
        const step = KICKED.speed * dt;
        x = clamp(x + flyDir * step, 6, W - 6);
        flying -= step;
        ky = surfaceBelow(x, ky - 12);
        const hit = game.enemies.some((e) => e.hp > 0 && boxHit(enemyBox(e), keg.box()));
        if (hit || flying <= 0 || x <= 6 || x >= W - 6) keg.setOff(1);
        return true;
      }
      if (t < from + ROLL.time) {
        const u = clamp((t - from) / ROLL.time);
        x = clamp(x0 + dir * far * u, 6, W - 6);
        return true;
      }
      if (v.lure) lure(x, v.lure, dt);
      if (t > from + ROLL.time + v.wait) keg.setOff(FIZZLE);
      return true;
    },
    draw() {
      place();
      const roll = Math.min(t, ROLL.time) * 14;
      polygon(
        [
          [x - 4, ky],
          [x + 4, ky],
          [x + 4.5, ky - 4.5],
          [x + 4, ky - 9],
          [x - 4, ky - 9],
          [x - 4.5, ky - 4.5],
        ],
        WOOD,
      );
      line(x - 4.5, ky - 2.5 + Math.sin(roll) * 0.3, x + 4.5, ky - 2.5, BAND);
      line(x - 4.5, ky - 6.5, x + 4.5, ky - 6.5, BAND);
      line(x - 1, ky - 8, x - 1, ky - 1, WOOD_DARK);
      // the fuse sputters, faster as the wait runs out
      const spark = Math.floor(t * (6 + t)) % 2 === 0;
      px(x + 2, ky - 10, WOOD_DARK);
      if (spark) px(x + 3, ky - 11, FIRE);
      if (fuse >= 0) px(x + 3, ky - 11, WHITE);
    },
  };
  kegs.add(keg);
  game.fx.push(keg);
}

/** Powder Keg on her I rotation */
export const KEG_SPELL: SableSpell = {
  label: "KEG",
  mp: () => skillValues("s_keg").mp,
  cooldown: () => skillValues("s_keg").cooldown,
  left: () => sable.kegCd,
  spend: (s) => {
    sable.kegCd = s;
  },
  room: () => true,
  release() {
    const n = skillValues("s_keg").kegs;
    for (let i = 0; i < n; i++) rollKeg(hero.x + hero.face * 8, hero.y, hero.face, i * 0.25, ROLL.far - i * 24);
    sfx.tone(140, 90, 0.1, "square", 0.05);
  },
};
