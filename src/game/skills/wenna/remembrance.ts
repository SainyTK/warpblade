import { PAL } from "../../../constants/palette";
import { CANDLE_ART, CANDLE_FLAMES, FLAME_LETTERS, WAX_LETTERS } from "../../../constants/wenna/stamps";
import { glow, place } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { stampPixels } from "../../effects/fine";
import { drawFlameBolt } from "../../effects/wenna/flameBolt";
import { enemyCenter } from "../../enemies/enemy";
import { addStacks } from "../../enemies/skillStatus";
import { game, progress, rng } from "../../state";
import { skillValues, withCharms } from "../query";
import { nearestFoe, touches } from "../targets";

const ID = "w_ghost";
/** a ghost candle floats this high over where its Wick stood; its bolts fly this fast and this far */
const GHOST = { rise: 18, speed: 220, range: 160 } as const;

interface Bolt {
  x: number;
  y: number;
  vx: number;
  vy: number;
  left: number;
  pierce: number;
  struck: Enemy[];
}

interface Ghost {
  x: number;
  y: number;
  t: number;
  life: number;
  next: number;
}

interface GhostMemory {
  ghosts: Ghost[];
  bolts: Bolt[];
  cd: number;
}

const memoryOf = (m: SkillMemory): GhostMemory => m as unknown as GhostMemory;

/** one bolt strikes a foe; Vigil of the Lost's bolts add Hot Wax */
function strike(b: Bolt, e: Enemy): void {
  const v = skillValues(ID);
  dealDamage(e, progress.stats.ap * v.power, { fromX: b.x, kx: Math.sign(b.vx) * 30, source: ID });
  const hot = skillValues("w_hotWax");
  if (v.vigil && hot.damage)
    addStacks(e, "w_hotWax", {
      stacks: 1,
      max: hot.stacks * 3,
      damage: progress.stats.ap * hot.damage,
      every: 1,
      duration: hot.life,
    });
  b.struck.push(e);
}

/** false once the bolt has spent its flight or its pierce */
function flyBolt(b: Bolt, dt: number): boolean {
  b.x += b.vx * dt;
  b.y += b.vy * dt;
  b.left -= GHOST.speed * dt;
  for (const e of game.enemies) {
    if (e.hp <= 0 || b.struck.includes(e) || !touches(e, b.x, b.y, 2)) continue;
    strike(b, e);
    if (b.pierce-- <= 0) return false;
  }
  return b.left > 0;
}

/** a ghost candle floats where its Wick ended and fires at the foe nearest it */
function haunt(g: Ghost, m: GhostMemory, dt: number): boolean {
  g.t += dt;
  g.next -= dt;
  if (g.next <= 0) {
    const v = skillValues(ID);
    g.next = v.every ?? 0.6;
    const e = nearestFoe(g.x, g.y);
    if (e) {
      const [cx, cy] = enemyCenter(e);
      const d = Math.hypot(cx - g.x, cy - g.y) || 1;
      m.bolts.push({
        x: g.x,
        y: g.y,
        vx: ((cx - g.x) / d) * GHOST.speed,
        vy: ((cy - g.y) / d) * GHOST.speed,
        left: GHOST.range,
        pierce: v.pierce ?? 0,
        struck: [],
      });
    }
  }
  return g.t < g.life;
}

/** a pale candle with a violet ghost flame, bobbing, fading over its last half second */
function drawGhost(g: Ghost): void {
  const k = Math.min(1, g.t * 4, (g.life - g.t) * 2);
  const y = g.y + Math.sin(g.t * 4) * 1.5;
  stampPixels(CANDLE_ART, g.x, y + 2.5, WAX_LETTERS, 0.7 * k);
  stampPixels(CANDLE_FLAMES[Math.floor(g.t * 10) % CANDLE_FLAMES.length], g.x, y - 1.25, FLAME_LETTERS, k);
  glow(g.x, y - 1, 7, PAL.wick[3], 0.3 * k);
}

/**
 * Remembrance: a Wick that ends may leave a ghost candle that fires bolts at foes; with its levels more often, piercing,
 * longer and two at once. Vigil of the Lost leaves one for every Wick, and its bolts add Hot Wax.
 */
export const remembranceSkill: SkillBehavior = {
  create: () => ({ ghosts: [], bolts: [], cd: 0 }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
    m.ghosts = m.ghosts.filter((g) => haunt(g, m, dt));
    m.bolts = m.bolts.filter((b) => flyBolt(b, dt));
  },
  draw(memory) {
    const m = memoryOf(memory);
    place();
    for (const g of m.ghosts) drawGhost(g);
    for (const b of m.bolts) {
      drawFlameBolt(b.x, b.y, b.vx, b.vy);
    }
  },
  on: {
    wick(memory, event) {
      if (event.lit) return;
      const m = memoryOf(memory);
      const v = skillValues(ID);
      if (!v.vigil && (m.cd > 0 || !rng.chance(v.chance))) return;
      m.cd = withCharms("cooldown", v.cooldown ?? 2);
      const count = Math.round(withCharms("amount", v.count ?? 1));
      for (let i = 0; i < count; i++)
        m.ghosts.push({
          x: event.x + (i - (count - 1) / 2) * 8,
          y: event.y - GHOST.rise,
          t: 0,
          life: withCharms("duration", v.life),
          next: 0.2 + i * 0.15,
        });
    },
  },
};
