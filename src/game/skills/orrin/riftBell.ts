import { PAL, SPARKS } from "../../../constants/palette";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { game, lights, progress, rng } from "../../state";
import { hitStop, shake } from "../../world";
import { skillValues, withCharms } from "../query";
import { foesOnScreen } from "../targets";
import { BELL, type Bell, bellAngle, bellMouth, BELL_TIME as TIME } from "./bellShape";
import { drawBell, drawBellRift, drawToll } from "./bellSprite";

const ID = "o_bell";
interface BellMemory {
  cd: number;
  bells: Bell[];
}

const memoryOf = (m: SkillMemory): BellMemory => m as unknown as BellMemory;

/** a bell drops on a chain from a small rift above the foe */
function drop(m: BellMemory, foe: Enemy): void {
  const v = skillValues(ID);
  const [cx] = enemyCenter(foe);
  const top = enemyBox(foe)[1];
  const size = v.great ? 2 : 1;
  m.bells.push({
    x: cx,
    y: Math.max(10, top - BELL.above * size),
    phase: "drop",
    t: 0,
    passes: 0,
    swings: v.swings,
    struck: [],
    size,
    flash: 0,
  });
  m.cd = withCharms("cooldown", v.cooldown);
  sfx.rattle();
}

/** the bell's mouth sweeps through the foes at the bottom of its swing */
function strike(b: Bell): void {
  const v = skillValues(ID);
  const [mx, my] = bellMouth(b);
  const reach = withCharms("area", (v.wide ? BELL.wide : BELL.mouth) * b.size);
  const dir = Math.sign(Math.sin(bellAngle(b) + 0.01) - Math.sin(bellAngle(b) - 0.01)) || 1;
  let hit = false;
  for (const e of game.enemies) {
    if (e.hp <= 0 || b.struck.includes(e)) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.abs(cx - mx) > reach || Math.abs(cy - my) > reach * 0.8 + 6) continue;
    b.struck.push(e);
    hit = true;
    dealDamage(e, progress.stats.ad * v.power, {
      fromX: mx - dir * 8,
      kx: dir * 120,
      ky: -40,
      heavy: true,
      stun: v.stun && b.passes === 0 ? BELL.stun : undefined,
      source: ID,
    });
    game.fx.push(createImpact(cx, cy, dir, true, SPARKS.brass));
  }
  if (!hit) return;
  b.flash = 0.12;
  hitStop(0.04);
  shake(0.12, 1.6 * b.size);
  sfx.hit(true, 0.6);
}

/** the toll: a ring of sound for ability damage, and the Great Bell's stun on every foe on screen */
function toll(b: Bell): void {
  const v = skillValues(ID);
  const [mx, my] = bellMouth(b);
  const reach = withCharms("area", BELL.toll * b.size);
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.hypot(cx - mx, cy - my) > reach) continue;
    dealDamage(e, progress.stats.ap * v.toll, { fromX: mx, kx: Math.sign(cx - mx) * 60, source: ID });
  }
  if (v.great) for (const e of foesOnScreen()) e.stun = Math.max(e.stun, BELL.tollStun);
  lights.add(mx, my, reach, PAL.brass[3], 0.8, TIME.toll);
  shake(0.2, v.great ? 3 : 1.5);
  sfx.hit(true, 0.45);
}

/** false once the bell has risen back into its rift */
function ring(b: Bell, dt: number): boolean {
  b.t += dt;
  b.flash = Math.max(0, b.flash - dt);
  if (b.phase === "drop" && b.t >= TIME.drop) {
    b.phase = "swing";
    b.t = 0;
  }
  if (b.phase === "swing") {
    // the mouth passes the bottom halfway through each swing across
    if (b.t >= TIME.swing * 0.35 && b.t - dt < TIME.swing * 0.65) strike(b);
    if (b.t >= TIME.swing) {
      b.passes++;
      b.t -= TIME.swing;
      b.struck = [];
      if (b.passes >= b.swings) {
        const tolls = skillValues(ID).toll > 0;
        b.phase = tolls ? "toll" : "rise";
        b.t = 0;
        if (tolls) toll(b);
      }
    }
  }
  if (b.phase === "toll" && b.t >= TIME.toll) {
    b.phase = "rise";
    b.t = 0;
  }
  return !(b.phase === "rise" && b.t >= TIME.rise);
}

/**
 * Rift Bell: a tip hit may drop a bronze bell on a chain from a rift above the foe, which swings through it; levels add
 * a stun on the first swing, a wider swing, a toll ring, a second bell and a third swing. The Great Bell is twice the
 * size and its toll stuns everything on screen.
 */
export const riftBell: SkillBehavior = {
  create: () => ({ cd: 0, bells: [] }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
    m.bells = m.bells.filter((b) => ring(b, dt));
  },
  drawBack(memory) {
    for (const b of memoryOf(memory).bells) drawBellRift(b);
  },
  draw(memory) {
    for (const b of memoryOf(memory).bells) {
      drawBell(b);
      drawToll(b);
    }
  },
  on: {
    tip(memory, event) {
      const m = memoryOf(memory);
      const v = skillValues(ID);
      if (m.cd > 0 || m.bells.length >= Math.round(withCharms("amount", v.count))) return;
      if (rng.chance(v.chance)) drop(m, event.foe);
    },
  },
};
