import { ENEMIES } from "../../constants/enemies";
import { THROWN } from "../../constants/hulda/grab";
import { W } from "../../constants/stage";
import { glow, hairline, place } from "../../engine/frame";
import { sfx } from "../../services/audio";
import type { SourceId } from "../../types/build";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { dealDamage } from "../damage";
import { enemyBox, enemyCenter } from "../enemies/enemy";
import { isClaimed } from "../hero/hulda/claims";
import { floorThud, thudLight } from "../hero/hulda/effects/thud";
import { spreadFracture, throwPower } from "../hero/hulda/fracture";
import { emitSkillEvent } from "../skills/events";
import { skillLevel, skillValues } from "../skills/query";
import { game, progress } from "../state";
import { boxHit, dust, hitStop, shake } from "../world";
import { createFloorRing } from "./floorRing";
import { createImpact } from "./impact";

/** how many past centres the streak behind the body keeps */
const TRAIL = 6;
const ID = "h_wreckingThrow";
/** a burst wider than this throws up the big slam's rubble */
const BIG_BURST = 40;

/**
 * `throw`: a foe Hulda threw herself, its hits her own. `flung`: a foe Wrecking Throw sent flying on from a thrown
 * body's path; its hits are the skill's own, and it lands without a burst, never flinging or calling anything in turn.
 */
export type BodyKind = "throw" | "flung";

/** Wrecking Throw's numbers, or none when it is not held */
const wreck = (): Readonly<Record<string, number>> | null => (skillLevel(ID) ? skillValues(ID) : null);

/** every foe but the body within `radius` of a point takes a burst; a fractured body passes its Fracture on */
function burst(body: Enemy, x: number, y: number, radius: number, power: number, stun: number, ramp: Ramp): void {
  for (const e of game.enemies) {
    if (e === body || e.hp <= 0) continue;
    const [ex, ey] = enemyCenter(e);
    if (Math.hypot(ex - x, ey - y) > radius) continue;
    dealDamage(e, progress.stats.ad * throwPower(e, power), {
      fromX: x,
      kx: Math.sign(ex - x) * 120,
      stun,
      heavy: true,
    });
    spreadFracture(body, e);
  }
  game.fx.push(createFloorRing(x, body.y, radius, ramp, 0.35));
  game.fx.push(createImpact(x, y, Math.sign(x - body.x) || 1, true));
  floorThud(x, body.y, radius > BIG_BURST ? "big" : "mid");
  sfx.boom();
}

/** a foe the flying body struck flies on along the same line, as a body of the skill's own */
function fling(e: Enemy, dir: number, ramp: Ramp): void {
  if (e.hp <= 0 || !ENEMIES[e.type].launchable || isClaimed(e)) return;
  Object.assign(e, { air: true, airTime: 0, airHits: 0, stun: 0, vx: dir * THROWN.flingVx, vy: THROWN.flingVy });
  game.fx.push(createThrownBody(e, dir, ramp, "flung"));
}

/**
 * A foe Hulda threw: while it flies it strikes every other foe it touches once, and when it lands it takes a last blow
 * and lies stunned. Wrecking Throw bursts it on landing, bounces it into a second burst, flings the foes it strikes on
 * as bodies and, evolved, fires it to the wall as Human Cannonball, bursting on every foe on the way. The foe draws
 * itself; this draws the streak behind it.
 */
export function createThrownBody(body: Enemy, dir: number, ramp: Ramp, kind: BodyKind = "throw"): Effect {
  const own = kind === "throw";
  const source: SourceId | undefined = own ? undefined : ID;
  const v = wreck();
  const cannon = own && !!v?.cannon;
  const height = body.y;
  const struck = new Set<Enemy>([body]);
  const trail: [number, number][] = [];
  let t = 0;
  let bounced = false;
  let done = false;

  /** the body meets a foe in its path */
  const strike = (e: Enemy, cx: number, cy: number): void => {
    struck.add(e);
    const [ex, ey] = enemyCenter(e);
    if (cannon && v) burst(body, ex, ey, v.burst, v.burstPower, v.stun, ramp);
    else {
      const power = v ? v.path : THROWN.power;
      dealDamage(e, progress.stats.ad * throwPower(e, power), {
        fromX: cx,
        kx: dir * THROWN.kx,
        stun: THROWN.stun,
        heavy: true,
        source,
      });
      if (own) spreadFracture(body, e);
    }
    game.fx.push(createImpact((cx + ex) / 2, (cy + ey) / 2, dir, true));
    thudLight(ex, ey, "small");
    hitStop(THROWN.stop);
    sfx.hit(true, 0.7);
    if (own && v?.fling) fling(e, dir, ramp);
  };

  /** the body hits the floor (or, as a cannonball, the wall): a last blow, then Wrecking Throw's burst */
  const land = (): void => {
    if (body.hp <= 0) {
      done = true;
      return;
    }
    const [cx, cy] = enemyCenter(body);
    if (!bounced) {
      dealDamage(body, progress.stats.ad * throwPower(body, THROWN.landPower), {
        fromX: cx - dir * 10,
        kx: 0,
        heavy: true,
        source,
      });
      body.stun = Math.max(body.stun, THROWN.landStun);
      dust(cx, body.y, 6);
      floorThud(cx, body.y, "small");
      shake(0.1, 1.5);
      if (own) emitSkillEvent({ type: "throw", foe: body, x: cx, y: body.y, slam: false });
    }
    if (!own || !v) {
      done = true;
      return;
    }
    if (cannon) {
      burst(body, cx, cy, v.crash, v.crashPower, v.stun, ramp);
      shake(0.3, 3);
      done = true;
      return;
    }
    burst(body, cx, cy, v.burst, v.burstPower, v.stun, ramp);
    if (!v.bounce || bounced || body.hp <= 0) {
      done = true;
      return;
    }
    bounced = true;
    t = 0;
    Object.assign(body, { air: true, vx: dir * THROWN.bounceVx, vy: THROWN.bounceVy, stun: 0 });
  };

  return {
    update(dt) {
      if (done || body.hp <= 0) return false;
      t += dt;
      if (cannon) {
        body.vx = dir * THROWN.cannonVx;
        body.vy = 0;
        body.y = height;
        body.air = true;
      }
      const [cx, cy] = enemyCenter(body);
      trail.unshift([cx, cy]);
      if (trail.length > TRAIL) trail.pop();
      const box = enemyBox(body);
      for (const e of game.enemies) {
        if (struck.has(e) || e.hp <= 0 || !boxHit(box, enemyBox(e))) continue;
        strike(e, cx, cy);
      }
      const wall = body.x < THROWN.wall || body.x > W - THROWN.wall;
      if (cannon ? wall || t >= THROWN.cannonLife : !body.air || t >= THROWN.life) land();
      return !done;
    },
    draw() {
      place();
      const wide = cannon ? 2 : 0;
      for (let i = 1; i < trail.length; i++) {
        const [x0, y0] = trail[i - 1];
        const [x1, y1] = trail[i];
        const k = 1 - i / trail.length;
        // lines of torn air behind the body: a bright one two image pixels thick with thinner ones either side
        const c = ramp[Math.max(2, Math.round(2 + k * 3))];
        hairline(x0, y0, x1, y1, c, k * 1.4);
        hairline(x0, y0 + 0.5, x1, y1 + 0.5, ramp[2], k * 1.4);
        hairline(x0, y0 + 4, x1, y1 + 4, ramp[3], k * 0.9);
        hairline(x0, y0 - 4, x1, y1 - 4, ramp[wide ? 5 : 4], k * 0.9);
        if (wide) hairline(x0, y0 - 7, x1, y1 - 7, ramp[4], k * 0.7);
      }
      if (trail.length) glow(trail[0][0], trail[0][1], 8 + wide * 2, ramp[3], own ? 0.22 : 0.14);
    },
  };
}
