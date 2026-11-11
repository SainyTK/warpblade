import { WREN_COLORS, WREN_PIXELS } from "../../../constants/mirel/pixels";
import { PAL, SPARKS } from "../../../constants/palette";
import { glow, place } from "../../../engine/frame";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { stampPixels } from "../../effects/fine";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { addStacks } from "../../enemies/skillStatus";
import { game, hero, progress, rng } from "../../state";
import { skillValues, withCharms } from "../query";
import { nearestFoe } from "../targets";

const ID = "m_wren";
/** flight speed, how near a peck lands, seconds between pecks while it has pecks left, and the fade on leaving */
const WREN = { speed: 180, reach: 5, peck: 0.25, every: 1, fade: 0.3, chill: 1 } as const;

interface Wren {
  x: number;
  y: number;
  target: Enemy | null;
  /** pecks left before it leaves, seconds until the next, seconds it stays (0: it leaves after its pecks) */
  pecks: number;
  next: number;
  life: number;
  t: number;
  /** flying off */
  gone: number;
}

interface WrenMemory {
  wrens: Wren[];
  cd: number;
}

const memoryOf = (m: SkillMemory): WrenMemory => m as unknown as WrenMemory;

/** a peck lands; Cuckoo Chorus's pecks add Age */
function peck(w: Wren, e: Enemy): void {
  const v = skillValues(ID);
  const [cx, cy] = enemyCenter(e);
  dealDamage(e, progress.stats.ad * v.power, { fromX: w.x, kx: Math.sign(cx - w.x) * 20, source: ID });
  if (v.chill) e.chill = Math.max(e.chill, WREN.chill);
  const wither = skillValues("m_wither");
  if (v.chorus && wither.damage)
    addStacks(e, "m_wither", {
      stacks: 1,
      max: wither.max,
      damage: progress.stats.ad * wither.damage,
      every: 1,
      duration: wither.life,
    });
  game.fx.push(createImpact(cx, cy, 1, false, SPARKS.hour));
  sfx.clink();
}

/** false once the wren has flown off and faded */
function fly(w: Wren, dt: number): boolean {
  w.t += dt;
  if (w.gone >= 0) {
    w.gone += dt;
    w.y -= 60 * dt;
    return w.gone < WREN.fade;
  }
  w.next -= dt;
  w.life -= dt;
  if (!w.target || w.target.hp <= 0) w.target = nearestFoe(w.x, w.y);
  if (!w.target || (w.pecks <= 0 && w.life <= 0)) {
    w.gone = 0;
    return true;
  }
  const [tx, ty] = enemyCenter(w.target);
  const hover = ty - 8 + Math.sin(w.t * 9) * 2;
  const dx = tx - w.x;
  const dy = hover - w.y;
  const d = Math.hypot(dx, dy);
  if (d > 1) {
    w.x += (dx / d) * Math.min(d, WREN.speed * dt);
    w.y += (dy / d) * Math.min(d, WREN.speed * dt);
  }
  if (d < WREN.reach + 8 && w.next <= 0) {
    peck(w, w.target);
    w.pecks--;
    w.next = w.pecks > 0 ? WREN.peck : WREN.every;
  }
  return true;
}

/** the wren facing left: each row of its picture turned round */
const WREN_MIRRORED = WREN_PIXELS.map((frame) => frame.map((row) => [...row].reverse().join("")));

/** a small clockwork bird: a sand-brass body, a teal eye, wings ticking up and down, a key turning on its back */
function drawWren(w: Wren): void {
  place();
  const k = w.gone >= 0 ? 1 - w.gone / WREN.fade : Math.min(1, w.t * 6);
  const face = w.target ? Math.sign(enemyCenter(w.target)[0] - w.x) || 1 : 1;
  const up = Math.floor(w.t * 16) % 2;
  const rows = face > 0 ? WREN_PIXELS[up] : WREN_MIRRORED[up];
  stampPixels(rows, w.x, w.y, WREN_COLORS, k);
  glow(w.x, w.y, 6, PAL.hour[3], 0.2 * k);
}

/**
 * Clockwork Wren: a Toll that lands may send clockwork birds that peck the nearest foe; levels raise the chance, the
 * pecks' damage and their number, chill and keep them about longer. Cuckoo Chorus sends four with every Toll, and their
 * pecks add Age.
 */
export const clockworkWren: SkillBehavior = {
  create: () => ({ wrens: [], cd: 0 }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
    m.wrens = m.wrens.filter((w) => fly(w, dt));
  },
  draw(memory) {
    for (const w of memoryOf(memory).wrens) drawWren(w);
  },
  on: {
    toll(memory, _event, state) {
      const m = memoryOf(memory);
      const v = skillValues(ID);
      if (!state.evolved && (m.cd > 0 || !rng.chance(v.chance))) return;
      m.cd = withCharms("cooldown", v.cooldown);
      const count = Math.round(withCharms("amount", v.count));
      for (let i = 0; i < count; i++)
        m.wrens.push({
          x: hero.x - hero.face * 4,
          y: hero.y - 30 - i * 3,
          target: null,
          pecks: v.pecks,
          next: 0.15 + i * 0.08,
          life: withCharms("duration", v.life),
          t: 0,
          gone: -1,
        });
    },
  },
};
