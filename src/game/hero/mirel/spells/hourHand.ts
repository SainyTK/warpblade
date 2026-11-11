import { DIAL } from "../../../../constants/mirel/look";
import { PAL } from "../../../../constants/palette";
import { fleck, glow, place } from "../../../../engine/frame";
import { sfx } from "../../../../services/audio";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { TAU } from "../../../../utils/math";
import { dealDamage } from "../../../damage";
import { enemyBox } from "../../../enemies/enemy";
import { skillValues, withCharms } from "../../../skills/query";
import { game, hero, lights, progress } from "../../../state";
import { shake } from "../../../world";
import { type Dial, dialArc, drawHand, drawHandWake, drawHub } from "../clockArt";
import { pressSpell } from "./castSpell";

const ID = "m_handsweep";
/** seconds one sweep takes */
const SWEEP = 0.35;
/** Clockwork's two hands turn for this long */
const CLOCKWORK = 1.2;
/** how far back a sweeping hand's wake fans, in turns, and the size its hub is drawn at */
const WAKE = 0.07;
const HUB = 24;

/** one hand sweeping round a point: from straight up over the front down to straight below, or a full turn */
interface Sweep {
  /** angle at the start and how far it turns, radians, facing right with up negative */
  from: number;
  turn: number;
  /** seconds from the cast it starts, and its power */
  start: number;
  power: number;
}

/** the hand's sweeps: the half circle ahead, Hour Hand's sweep back, a full turn, or Clockwork's two hands */
function sweeps(): Sweep[] {
  const v = skillValues(ID);
  const turn = v.full ? Math.PI * 2 : Math.PI;
  if (v.clockwork) {
    const n = Math.round(CLOCKWORK / SWEEP);
    return Array.from({ length: n * 2 }, (_, i) => ({
      from: -Math.PI / 2 + (i % 2) * Math.PI,
      turn: Math.PI * 2,
      start: Math.floor(i / 2) * SWEEP,
      power: v.power,
    }));
  }
  const out: Sweep[] = [{ from: -Math.PI / 2, turn, start: 0, power: v.power }];
  if (v.back) out.push({ from: -Math.PI / 2 + turn, turn: -turn, start: SWEEP + 0.08, power: v.back });
  return out;
}

/** a foe's body crosses the hand at this angle */
function onHand(e: Enemy, cx: number, cy: number, r: number, angle: number, face: number): boolean {
  const b = enemyBox(e);
  for (let k = 0.2; k <= 1; k += 0.2) {
    const x = cx + Math.cos(angle) * r * k * face;
    const y = cy + Math.sin(angle) * r * k;
    if (x > b[0] - 2 && x < b[2] + 2 && y > b[1] - 2 && y < b[3] + 2) return true;
  }
  return false;
}

/** a giant clock hand sweeps round her, striking each foe once a sweep and knocking it along the sweep */
function createHourHand(cx: number, cy: number, face: number): Effect {
  const v = skillValues(ID);
  const r = withCharms("area", v.radius);
  const plan = sweeps();
  const struck = plan.map(() => new Set<Enemy>());
  const end = Math.max(...plan.map((s) => s.start + SWEEP));
  let t = 0;
  return {
    update(dt) {
      t += dt;
      plan.forEach((s, i) => {
        const u = (t - s.start) / SWEEP;
        if (u < 0 || u > 1.05) return;
        if (u <= dt / SWEEP + 1e-6) sfx.swing(0.6);
        const angle = s.from + s.turn * Math.min(1, u);
        for (const e of game.enemies) {
          if (e.hp <= 0 || struck[i].has(e) || !onHand(e, cx, cy, r, angle, face)) continue;
          struck[i].add(e);
          const along = angle + Math.sign(s.turn) * (Math.PI / 2);
          dealDamage(e, progress.stats.ap * s.power, {
            fromX: cx,
            kx: Math.cos(along) * face * 140,
            ky: Math.sin(along) * 100,
            stun: v.stun || undefined,
            heavy: true,
            source: "abilities",
          });
          shake(0.08, 1.5);
        }
      });
      return t < end + 0.1;
    },
    draw() {
      place();
      for (const s of plan) {
        const u = (t - s.start) / SWEEP;
        if (u < 0 || u > 1.3) continue;
        const k = u > 1 ? 1 - (u - 1) / 0.3 : 1;
        const angle = s.from + s.turn * Math.min(1, u);
        const tx = cx + Math.cos(angle) * r * face;
        const ty = cy + Math.sin(angle) * r;
        // the hand as the clock faces draw it, measured round from twelve the way it is seen on screen
        const dial: Dial = { x: cx, y: cy, r, a: k, floor: Number.POSITIVE_INFINITY };
        const turn = (Math.atan2(ty - cy, tx - cx) + Math.PI / 2) / TAU;
        drawHandWake(dial, turn, r, Math.sign(s.turn) * face * WAKE);
        drawHand(dial, turn, r, true);
        dialArc(
          dial,
          r,
          turn * TAU - Math.PI / 2 - Math.sign(s.turn) * face * 0.5,
          turn * TAU - Math.PI / 2,
          DIAL.bezel,
          k,
        );
        fleck(tx, ty, WHITE, k);
        glow(tx, ty, 10, PAL.hour[3], 0.3 * k);
      }
      drawHub({ x: cx, y: cy, r: HUB, a: 1, floor: Number.POSITIVE_INFINITY });
      glow(cx, cy, 12, PAL.hour[3], 0.25);
    },
  };
}

/** I with Hour Hand */
export const pressHourHand = (): boolean => pressSpell(ID);

/** the hand turns round her on the cast's frame */
export function castHourHand(): void {
  const cx = hero.x;
  const cy = hero.y - 18;
  game.fx.push(createHourHand(cx, cy, hero.face));
  lights.add(cx, cy, 60, PAL.hour[3], 0.5, 0.3);
}
