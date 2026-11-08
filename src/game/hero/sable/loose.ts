import { BOLT, STRING } from "../../../constants/sable/bolt";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { createCrossbowBolt } from "../../effects/crossbowBolt";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { createPayoff, payoffLands } from "../../skills/payoff";
import { skillValues } from "../../skills/query";
import { game, hero, lights, progress } from "../../state";
import { foesOnSegment } from "../../ultimates/segmentHits";
import { hitStop, shake } from "../../world";
import { skin } from "../skin";
import { boltLanded, boltStopped } from "./bolt/landed";
import { basePower, bonusSum, pierceOf, rangeOf, speedOf, sureCrit } from "./bolt/power";
import type { Shot } from "./bolt/shot";
import { kegsOnSegment } from "./spells/keg";

/** where a bolt struck from in its flight, for the skills that care */
interface Flight {
  dir: number;
  passed: number;
  flown: number;
  range: number;
}

/** a perfect reload's bolt as it strikes this foe: Perfect Rhythm's prime on the foe its payoff lands on, the plain
 *  prime of a charged bolt on any other */
const paidOff = (e: Enemy, b: Shot): Shot =>
  b.prime === "reload" && b.payoff && !payoffLands(b.payoff, e) ? { ...b, prime: "charged" } : b;

/** a bolt strikes a foe: damage from attack damage with every skill bonus added into one sum, a push away from where it
 *  was loosed and a spark; true when the foe fell */
function strike(e: Enemy, shot: Shot, f: Flight): boolean {
  const b = paidOff(e, shot);
  const lit = b.prime !== null;
  const breach = b.closing && !b.plain ? skillValues("s_breach") : {};
  const push = b.closing ? STRING.closingPush * (breach.push ?? 1) : 1;
  const passStagger = b.plain ? 0 : (skillValues("s_pierce").stagger ?? 0);
  const stagger = Math.max(b.closing ? STRING.closingStagger : BOLT.stagger, passStagger);
  const [cx, cy] = enemyCenter(e);
  dealDamage(e, progress.stats.ad * basePower(b) * (1 + bonusSum(b, f.passed, f.flown)), {
    fromX: b.x - f.dir * 10,
    kx: f.dir * BOLT.kx * push,
    ky: BOLT.ky,
    heavy: lit || !!breach.breaks,
    stun: breach.stun,
    stagger,
    sureCrit: sureCrit(b, f.flown, f.range),
    source: b.source,
  });
  hero.lastHit = e;
  game.fx.push(createImpact(cx - f.dir * 3, cy, f.dir, lit || !!b.closing));
  lights.add(cx, cy, lit ? 22 : 14, skin.ramp[4], 0.7, 0.12);
  sfx.hit(lit, 1.3);
  if (lit) {
    hitStop(0.03);
    shake(0.08, 1);
  }
  return e.hp <= 0;
}

/** loose one bolt: it flies, sets off kegs it meets, passes through as many foes as the skills allow and flies on
 *  through a kill with Ricochet */
export function looseBolt(b: Shot): void {
  const struck = b.struck ?? new Set<Enemy>();
  const family = { ...b, struck, payoff: b.payoff ?? createPayoff() };
  const dir = Math.cos(b.angle) >= 0 ? 1 : -1;
  const range = rangeOf(b);
  const ricochet = b.plain ? {} : skillValues("s_ricochet");
  const f: Flight = { dir, passed: 0, flown: 0, range };
  let through = pierceOf(b);
  const pass = (ax: number, ay: number, bx: number, by: number): boolean => {
    f.flown += Math.hypot(bx - ax, by - ay);
    kegsOnSegment(ax, ay, bx, by, b);
    for (const e of foesOnSegment(ax, ay, bx, by, struck)) {
      struck.add(e);
      const killed = strike(e, family, f);
      const last = !(killed && ricochet.killOn) && through-- <= 0;
      if (!b.plain) boltLanded(e, family, { flown: f.flown, killed, dir });
      f.passed++;
      if (!last) continue;
      if (!b.plain) boltStopped(e, family);
      return true;
    }
    return false;
  };
  // a foe pressed up against her, between her chest and the muzzle, is struck at once
  if (!b.depth && !b.offshoot && pass(hero.x, b.y, b.x, b.y)) return;
  game.fx.push(
    createCrossbowBolt({
      x: b.x,
      y: b.y,
      angle: b.angle,
      ramp: skin.ramp,
      primed: b.prime !== null,
      heavy: !!b.closing && !b.plain && !!skillValues("s_breach").bonus,
      bounces: ricochet.wall ? 1 : 0,
      range,
      speed: speedOf(b),
      pass,
      edge: () => {
        if (!ricochet.edgePrime) return false;
        family.prime = "charged";
        return true;
      },
    }),
  );
}
