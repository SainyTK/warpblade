import { PAL } from "../../../constants/palette";
import { glow, place, px } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { createSlash } from "../../effects/slash";
import { addStacks } from "../../enemies/skillStatus";
import { skin } from "../../hero/skin";
import { game, progress, rng } from "../../state";
import { skillValues, withCharms } from "../query";
import { nearestFoe } from "../targets";

const ID = "t_wraith";
/** seconds between a wraith's slashes, its drift speed and how near it must be to slash */
const WRAITH = { every: 0.6, speed: 50, reach: 14 } as const;

interface Wraith {
  x: number;
  y: number;
  left: number;
  next: number;
  t: number;
}

interface WraithMemory {
  wraiths: Wraith[];
  cd: number;
}

const memoryOf = (m: SkillMemory): WraithMemory => m as unknown as WraithMemory;

/** a slash at a foe, and a bleed with its level */
function slash(w: Wraith, e: Enemy): void {
  const v = skillValues(ID);
  dealDamage(e, progress.stats.ad * v.power, { fromX: w.x, source: ID });
  if (v.bleed)
    addStacks(e, ID, {
      stacks: 1,
      max: 6,
      damage: progress.stats.ad * 0.1,
      every: 1,
      duration: withCharms("duration", 3),
    });
  if (v.blind && e.rank === "minion") e.blind = Math.max(e.blind, v.blind);
  const face = Math.sign(e.x - w.x) || 1;
  game.fx.push(
    createSlash(w.x, w.y, face, { cx: 4, cy: -10, R: 8, sy: 0.8, rot: 0, a0: -1.2, a1: 1, W: 2, ramp: skin.ramp }),
  );
  w.next = WRAITH.every;
}

/** a wraith's burst as it ends reaches this far */
const BURST_REACH = 24;

/** with its level, a wraith bursts as it ends */
function burst(w: Wraith): void {
  const power = skillValues(ID).burst;
  if (!power) return;
  for (const e of game.enemies)
    if (e.hp > 0 && Math.abs(e.x - w.x) <= BURST_REACH)
      dealDamage(e, progress.stats.ad * power, { fromX: w.x, source: ID });
  game.fx.push(createFloorRing(w.x, w.y, BURST_REACH, PAL.gloam, 0.3));
}

/** it drifts to the nearest foe and slashes it; false once its time is up */
function haunt(w: Wraith, dt: number): boolean {
  w.t += dt;
  w.left -= dt;
  w.next -= dt;
  const e = nearestFoe(w.x, w.y - 10);
  if (e) {
    const dx = e.x - w.x;
    if (Math.abs(dx) > WRAITH.reach * 0.6) w.x += Math.sign(dx) * Math.min(Math.abs(dx), WRAITH.speed * dt);
    w.y += (e.y - w.y) * Math.min(1, dt * 3);
    if (Math.abs(dx) <= WRAITH.reach && w.next <= 0) slash(w, e);
  }
  if (w.left > 0) return true;
  burst(w);
  return false;
}

/**
 * Hollow Wraith: a foe he fells from behind may rise as a wraith that slashes the nearest foe for a while; with its
 * levels more often, bleeding, longer and two at once. Legion of Dusk raises one with every kill from behind.
 */
export const wraithSkill: SkillBehavior = {
  create: () => ({ wraiths: [], cd: 0 }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
    m.wraiths = m.wraiths.filter((w) => haunt(w, dt));
  },
  draw(memory) {
    place();
    for (const w of memoryOf(memory).wraiths) {
      const fade = Math.min(1, w.left * 2, w.t * 4);
      const x = Math.round(w.x);
      const y = Math.round(w.y);
      const sway = Math.round(Math.sin(w.t * 6));
      for (let j = 1; j < 16; j++) {
        const half = j < 4 ? 1 : j < 12 ? 2 : 1;
        for (let i = -half; i <= half; i++)
          px(x + i + (j < 5 ? sway : 0), y - j, PAL.gloam[j < 5 ? 1 : 2], fade * (j < 4 ? 0.5 : 0.85));
      }
      px(x - 1, y - 12, PAL.gloam[5], fade);
      px(x + 1, y - 12, PAL.gloam[5], fade);
      glow(w.x, w.y - 9, 9, PAL.gloam[3], 0.18 * fade);
    }
  },
  on: {
    backstab(memory, event) {
      if (!event.kill) return;
      const m = memoryOf(memory);
      const v = skillValues(ID);
      if (m.cd > 0 || m.wraiths.length >= (v.wraiths || 1)) return;
      if (!v.legion && !rng.chance(v.chance)) return;
      m.cd = withCharms("cooldown", v.cooldown ?? 2);
      m.wraiths.push({ x: event.foe.x, y: event.foe.y, left: withCharms("duration", v.life), next: 0.3, t: 0 });
    },
  },
};
