import { STOPPED_CLOCK } from "../../../constants/mirel/abilities";
import { PAL, SAND } from "../../../constants/palette";
import { line, place, px } from "../../../engine/frame";
import { sfx } from "../../../services/audio";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { TAU } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { stopFoe } from "../../enemies/timeStop";
import { emitSkillEvent } from "../../skills/events";
import { game, hero, lights, particles, progress, rng } from "../../state";
import { setState } from "../actions";
import { canCast } from "./castCheck";
import { mirel, mirelHost } from "./memory";

/** the clock face over a stopped foe: its width, and how often its hand ticks */
const FACE = 10;
const TICK = 0.25;

/** the nearest foe ahead within reach, at any height near hers, or null */
function foeAhead(): Enemy | null {
  let best: Enemy | null = null;
  let bestD: number = STOPPED_CLOCK.reach;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    const d = (cx - hero.x) * hero.face;
    if (d < -6 || d > bestD || Math.abs(cy - (hero.y - 16)) > STOPPED_CLOCK.height) continue;
    best = e;
    bestD = d;
  }
  return best;
}

/** seconds a foe of this rank stays stopped */
const stopFor = (e: Enemy): number => STOPPED_CLOCK.stop[e.rank];

/** a clock face over a stopped foe, its hand ticking every quarter second, until the foe restarts */
export function createClockFace(e: Enemy): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return e.hp > 0 && e.stopped > 0;
    },
    draw() {
      place();
      const b = enemyBox(e);
      const [cx] = enemyCenter(e);
      const cy = b[1] - FACE - 2;
      const steps = 40;
      for (let i = 0; i < steps; i++) {
        const a = (i / steps) * TAU;
        px(cx + Math.cos(a) * FACE, cy + Math.sin(a) * FACE, PAL.hour[3], 0.9);
      }
      for (let i = 0; i < 12; i += 3) {
        const a = -Math.PI / 2 + (i / 12) * TAU;
        px(cx + Math.cos(a) * (FACE - 2), cy + Math.sin(a) * (FACE - 2), PAL.hour[5]);
      }
      const hand = -Math.PI / 2 + Math.floor(t / TICK) * (TAU / 12);
      line(cx, cy, cx + Math.cos(hand) * (FACE - 3), cy + Math.sin(hand) * (FACE - 3), PAL.hour[4]);
      px(cx, cy, PAL.hour[5]);
    },
  };
}

/** I with Stopped Clock: aim at the foe ahead; with nobody in reach it fizzles for half the MP */
export function pressStoppedClock(): boolean {
  const target = foeAhead();
  const mp = target ? STOPPED_CLOCK.mp : STOPPED_CLOCK.mp / 2;
  if (!canCast(mirel.clockCd, mp)) return true;
  hero.mp -= mp;
  mirel.clockCd = STOPPED_CLOCK.cooldown;
  mirel.casting = "stoppedClock";
  mirelHost.clockFoe = target;
  if (hero.ground) hero.vx = 0;
  setState("clockCast");
  sfx.cast();
  emitSkillEvent({ type: "cast", ability: "stoppedClock" });
  return true;
}

/** a puff of sand where the spell found nobody */
function fizzle(): void {
  const x = hero.x + hero.face * 30;
  const y = hero.y - 18;
  for (let i = 0; i < 10; i++)
    particles.spawn(
      PK.MOTE,
      x + rng.range(-4, 4),
      y + rng.range(-4, 4),
      rng.range(-30, 30),
      rng.range(-30, 10),
      rng.range(0.3, 0.5),
      {
        col: rng.chance(0.6) ? SAND.light : SAND.shade,
        size: 0.6,
      },
    );
}

/** the cast: on its frame the foe stops dead under a clock face and takes the hit */
export function runClockCast(): void {
  const h = hero;
  if (!h.hitDone && h.st >= STOPPED_CLOCK.hit) {
    h.hitDone = true;
    const e = mirelHost.clockFoe;
    mirelHost.clockFoe = null;
    if (!e || e.hp <= 0) fizzle();
    else {
      stopFoe(e, stopFor(e), STOPPED_CLOCK.returns);
      dealDamage(e, progress.stats.ap * STOPPED_CLOCK.power, { fromX: h.x, source: "abilities" });
      game.fx.push(createClockFace(e));
      const [cx, cy] = enemyCenter(e);
      lights.add(cx, cy, 34, PAL.hour[4], 0.9, 0.25);
      sfx.chime(3);
    }
  }
  if (h.st >= STOPPED_CLOCK.dur) setState(h.ground ? "idle" : "fall");
}
