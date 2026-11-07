import { ENEMIES } from "../../../constants/enemies";
import { CHAIN } from "../../../constants/hulda/spells";
import { HERO_COLORS as HC } from "../../../constants/palette";
import { W } from "../../../constants/stage";
import { circle, glow, place, px } from "../../../engine/frame";
import { sfx } from "../../../services/audio";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { clamp } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { kindOf } from "../../enemies/kinds";
import { touches } from "../../skills/targets";
import { game, hero, progress } from "../../state";
import { hitStop, shake } from "../../world";
import { isFree, setState } from "../actions";
import { skin } from "../skin";
import { claim, isClaimed, unclaim } from "./claims";
import { canHold, take } from "./hold";
import { hulda } from "./memory";

/** what one cast of Iron Chain does, from its level's row */
export interface ChainSpec {
  power: number;
  range: number;
  count: number;
  yank: number;
  collide: number;
  stomp: number;
  /** each chain's side (1 ahead, -1 behind) and angle above the floor */
  aims: readonly (readonly [number, number])[];
}

interface Hooked {
  e: Enemy;
  /** where it was when the chain caught it */
  x0: number;
  y0: number;
}

interface Chain {
  side: number;
  dx: number;
  dy: number;
  /** how far the head has flown, and how far it got before turning back */
  out: number;
  reach: number;
  back: boolean;
  hooked: Hooked[];
}

/** where the chains leave her: the gauntlet at her shoulder */
const hand = (side: number): [number, number] => [hero.x + side * 6, hero.y - CHAIN.height];

/** a foe home in the heap sits at her feet on the chain's side; a flier at her hands */
function heapSpot(e: Enemy, side: number): [number, number] {
  const x = clamp(hero.x + side * CHAIN.heap, 8, W - 8);
  return [x, kindOf(e.type).flies ? hero.y - 20 : hero.y];
}

function pinAt(e: Enemy, x: number, y: number): void {
  e.x = x;
  e.y = y;
  e.vx = 0;
  e.vy = 0;
  e.air = false;
  e.stun = Math.max(e.stun, 0.1);
  claim(e);
}

/**
 * One cast of Iron Chain: each chain flies out from her gauntlet, hooks foes it meets (up to its count) and drags them
 * into a heap at her feet; a big foe it meets either stops it or, with the yank, pulls her to it for a crush. Once every
 * chain is home, dragged foes crash together, Hell Chains' heap stomps, and the first minion home is in her hands.
 */
export function createChainCast(spec: ChainSpec): Effect {
  const chains: Chain[] = spec.aims.map(([side, a]) => ({
    side,
    dx: side * Math.cos(a),
    dy: -Math.sin(a),
    out: 0,
    reach: spec.range,
    back: false,
    hooked: [],
  }));
  const taken = new Set<Enemy>();
  let yankTo: Enemy | null = null;
  let homeT = 0;
  let done = false;
  hulda.chainBusy = true;

  const head = (c: Chain): [number, number] => {
    const [x, y] = hand(c.side);
    const d = c.back ? c.reach * (1 - homeT / CHAIN.drag) : c.out;
    return [x + c.dx * d, y + c.dy * d];
  };

  const hook = (c: Chain, e: Enemy): void => {
    taken.add(e);
    const [cx, cy] = enemyCenter(e);
    dealDamage(e, progress.stats.ad * spec.power, { fromX: hero.x, kx: 0, heavy: true, source: "abilities" });
    game.fx.push(createImpact(cx, cy, -c.side, false));
    sfx.hit(false, 1.1);
    if (ENEMIES[e.type].launchable) {
      c.hooked.push({ e, x0: e.x, y0: e.y });
      claim(e);
      return;
    }
    c.reach = c.out;
    c.back = true;
    if (spec.yank > 0 && !yankTo) yankTo = e;
    else e.stun = Math.max(e.stun, CHAIN.bigStun);
  };

  const fly = (c: Chain, dt: number): void => {
    if (c.back) return;
    c.out = Math.min(spec.range, c.out + CHAIN.speed * dt);
    const [x, y] = head(c);
    for (const e of game.enemies) {
      if (c.back || e.hp <= 0 || taken.has(e) || isClaimed(e) || !touches(e, x, y, CHAIN.hookR)) continue;
      hook(c, e);
      if (c.hooked.length >= spec.count) {
        c.reach = c.out;
        c.back = true;
      }
    }
    if (c.out >= spec.range || x < 0 || x > W) {
      c.reach = c.out;
      c.back = true;
    }
  };

  /** she flies along her chain to the big foe and crushes it */
  const yank = (dt: number): boolean => {
    const e = yankTo;
    if (!e || e.hp <= 0 || hero.state !== "chain") return false;
    const want = e.x - Math.sign(e.x - hero.x || hero.face) * 12;
    const step = CHAIN.yank * dt;
    if (Math.abs(want - hero.x) > step) {
      hero.x += Math.sign(want - hero.x) * step;
      return true;
    }
    hero.x = want;
    const [cx, cy] = enemyCenter(e);
    dealDamage(e, progress.stats.ad * spec.yank, {
      fromX: hero.x,
      kx: 0,
      heavy: true,
      melee: true,
      source: "abilities",
    });
    game.fx.push(createImpact(cx, cy, hero.face, true));
    hitStop(0.07);
    shake(0.18, 2);
    sfx.boom();
    return false;
  };

  /** every chain home: the heap crashes together, stomps with Hell Chains, and the first minion is hers to hold */
  const land = (): void => {
    const heap = chains.flatMap((c) => c.hooked.map((h) => h.e)).filter((e) => e.hp > 0);
    const others = Math.min(3, heap.length - 1);
    for (const e of heap) {
      unclaim(e);
      e.stun = Math.max(e.stun, CHAIN.stun);
      if (spec.collide > 0 && others > 0)
        dealDamage(e, progress.stats.ad * spec.collide * others, {
          fromX: hero.x,
          kx: 0,
          heavy: true,
          source: "abilities",
        });
    }
    if (spec.stomp > 0 && heap.length) {
      const [hx] = enemyCenter(heap[0]);
      for (const e of game.enemies) {
        if (e.hp <= 0 || Math.abs(enemyCenter(e)[0] - hx) > CHAIN.stompRing) continue;
        dealDamage(e, progress.stats.ad * spec.stomp, {
          fromX: hx,
          kx: 0,
          stun: 0.5,
          heavy: true,
          source: "abilities",
        });
      }
      game.fx.push(createFloorRing(hx, hero.y, CHAIN.stompRing, skin.ramp, 0.4));
      shake(0.2, 2.5);
      sfx.boom();
    }
    const first = heap.find((e) => e.hp > 0 && canHold(e));
    const ready = hero.state === "chain" || (isFree() && hero.ground);
    if (first && ready && !hulda.held && hero.ground) {
      take(first);
      setState("hold");
    }
  };

  return {
    update(dt) {
      if (done) return false;
      if (hero.hp <= 0) {
        for (const c of chains) for (const h of c.hooked) unclaim(h.e);
        hulda.chainBusy = false;
        return false;
      }
      const yanking = yank(dt);
      if (!yanking) yankTo = null;
      for (const c of chains) fly(c, dt);
      if (chains.every((c) => c.back)) homeT = Math.min(CHAIN.drag, homeT + dt);
      const u = homeT / CHAIN.drag;
      for (const c of chains)
        for (const h of c.hooked) {
          if (h.e.hp <= 0) continue;
          if (!c.back) {
            const [x, y] = head(c);
            pinAt(h.e, x, kindOf(h.e.type).flies ? y : Math.max(h.y0, y));
            continue;
          }
          const [tx, ty] = heapSpot(h.e, c.side);
          const [sx, sy] = [h.e.x, h.e.y];
          pinAt(h.e, sx + (tx - sx) * u, sy + (ty - sy) * u);
        }
      if (homeT < CHAIN.drag || yanking) return true;
      done = true;
      hulda.chainBusy = false;
      land();
      return false;
    },
    draw() {
      place();
      for (const c of chains) {
        const [x0, y0] = hand(c.side);
        const [x1, y1] = head(c);
        const len = Math.hypot(x1 - x0, y1 - y0);
        // links of two pixels each, turned alternately along and across the chain, lit on their top edge
        const n = Math.floor(len / 3);
        const ux = len ? (x1 - x0) / len : 1;
        const uy = len ? (y1 - y0) / len : 0;
        for (let i = 0; i <= n; i++) {
          const u = n ? i / n : 0;
          const x = x0 + (x1 - x0) * u;
          const y = y0 + (y1 - y0) * u + Math.sin(u * Math.PI) * (c.back ? 0 : 1.5);
          const along = i % 2 === 0;
          px(x, y, along ? HC.steel : HC.steelDark);
          px(along ? x + ux : x - uy, along ? y + uy : y + ux, along ? HC.steelDark : HC.steelDeep);
          if (along) px(x, y - 1, HC.steelLight, 0.8);
        }
        circle(x1, y1, 2.2, HC.steel);
        px(x1 + c.side, y1 - 1, HC.steelGlint);
        glow(x1, y1, 7, skin.ramp[4], 0.35);
      }
    },
  };
}
