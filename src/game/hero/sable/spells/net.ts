import { line, place, px } from "../../../../engine/frame";
import { sfx } from "../../../../services/audio";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { hex } from "../../../../utils/color";
import { dealDamage } from "../../../damage";
import { ignite } from "../../../enemies/burn";
import { enemyBox, enemyCenter } from "../../../enemies/enemy";
import { markFoe } from "../../../enemies/skillStatus";
import { skillValues } from "../../../skills/query";
import { game, hero, lights, progress } from "../../../state";
import { foesOnSegment } from "../../../ultimates/segmentHits";
import { muzzle } from "../aim";
import { sable } from "../memory";
import type { SableSpell } from "./spell";

const ROPE = hex("#c8b48a");
const WEIGHT = hex("#5a6468");
/** pixels a second and pixels a thrown net flies before it opens on the floor */
const FLIGHT = { speed: 230, range: 150 } as const;
/** radians between nets thrown at once; I held throws this many more nets, this far apart */
const FAN = { spread: 0.22, wideMore: 2, wideSpread: 0.3 } as const;
/** seconds pitch burns on a foe, and how near a foe must stand to a burning one to catch */
const PITCH = { burn: 3, catch: 14 } as const;

/** an open net: the foes it holds, and Pitch Net's fire */
interface OpenNet extends Effect {
  holds(e: Enemy): boolean;
  boltStruck(): void;
}

/** the open nets on the stage; kept apart from `game.fx`, which is emptied while effects update */
const nets = new Set<OpenNet>();

/** the open net holding this foe, if any */
export function netHolding(e: Enemy): OpenNet | undefined {
  for (const n of nets) if (n.holds(e)) return n;
  return undefined;
}

/** a new run: no nets */
export const clearNets = (): void => nets.clear();

/** the net opens where it came down: every foe under it is bitten, held and marked; the middle drags them together */
function openNet(x: number, y: number): void {
  const v = skillValues("s_net");
  const held = game.enemies.filter((e) => {
    if (e.hp <= 0) return false;
    const [x0, , x1] = enemyBox(e);
    return x1 > x - v.width && x0 < x + v.width;
  });
  for (const e of held) {
    dealDamage(e, progress.stats.ap * v.power, {
      fromX: x,
      kx: 0,
      ky: 0,
      stun: v.hold,
      heavy: true,
      source: "abilities",
    });
    if (v.mark) markFoe(e, "s_net", v.hold, v.mark);
  }
  lights.add(x, y - 6, v.width + 8, ROPE, 0.6, 0.2);
  sfx.block();
  let t = 0;
  let lit = false;
  const net: OpenNet = {
    holds: (e) => held.includes(e) && t < v.hold,
    boltStruck() {
      if (!v.pitch || lit) return;
      lit = true;
      const burning = held.filter((e) => e.hp > 0);
      for (const e of burning) ignite(e, PITCH.burn);
      // the fire leaps once to every foe touching a burning one
      for (const e of game.enemies)
        if (e.hp > 0 && burning.some((b) => Math.abs(enemyCenter(b)[0] - enemyCenter(e)[0]) < PITCH.catch))
          ignite(e, PITCH.burn);
    },
    update(dt) {
      t += dt;
      if (v.drag) for (const e of held) if (e.hp > 0 && !e.air) e.x += (x - e.x) * Math.min(1, 3 * dt);
      if (t < v.hold) return true;
      nets.delete(net);
      return false;
    },
    draw() {
      place();
      const a = Math.min(1, (v.hold - t) * 4);
      const w = v.width;
      const top = y - 22;
      for (let i = 0; i <= 4; i++) {
        const u = i / 4;
        line(x - w + 2 * w * u, y, x - w * 0.6 + 1.2 * w * u, top, lit ? hex("#ff9a3a") : ROPE, a * 0.8);
      }
      for (let j = 1; j <= 3; j++) {
        const yy = y - (22 * j) / 4;
        const ww = w * (1 - (0.4 * j) / 4);
        line(x - ww, yy, x + ww, yy, ROPE, a * 0.7);
      }
      px(x - w, y - 1, WEIGHT, a);
      px(x + w, y - 1, WEIGHT, a);
    },
  };
  nets.add(net);
  game.fx.push(net);
}

/** a net in flight: a bundle of rope and weights that opens on the first foe it meets, or where it comes down */
function throwNet(x: number, y: number, angle: number): void {
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  let flown = 0;
  let px0 = x;
  let py0 = y;
  game.fx.push({
    update(dt) {
      const step = FLIGHT.speed * dt;
      const ax = px0;
      const ay = py0;
      px0 += ux * step;
      py0 += uy * step + flown * 0.002;
      flown += step;
      const hit = foesOnSegment(ax, ay, px0, py0, new Set())[0];
      if (hit || flown >= FLIGHT.range) {
        openNet(hit ? enemyCenter(hit)[0] : px0, hit ? hit.y : hero.y);
        return false;
      }
      return true;
    },
    draw() {
      place();
      const spin = flown * 0.2;
      for (let i = 0; i < 4; i++) {
        const a = spin + (i * Math.PI) / 2;
        line(px0, py0, px0 + Math.cos(a) * 4, py0 + Math.sin(a) * 4, ROPE);
        px(px0 + Math.cos(a) * 4, py0 + Math.sin(a) * 4, WEIGHT);
      }
    },
  });
}

/** `n` nets thrown from the kneeling shot, `spread` radians apart */
function fan(n: number, spread: number): void {
  const m = muzzle("low");
  for (let i = 0; i < n; i++) throwNet(m.x, m.y, m.angle + (i - (n - 1) / 2) * spread);
  sfx.swing(1.1);
}

/** Net Bolt on her I bar */
export const NET_SPELL: SableSpell = {
  label: "NET",
  tint: "#c8b48a",
  mp: () => skillValues("s_net").mp,
  cooldown: () => skillValues("s_net").cooldown,
  left: () => sable.netCd,
  spend: (s) => {
    sable.netCd = s;
  },
  room: () => true,
  release: () => fan(skillValues("s_net").nets, FAN.spread),
  wide: () => fan(skillValues("s_net").nets + FAN.wideMore, FAN.wideSpread),
};
