import { dealDamage } from "../../../../game/damage";
import { createSlash } from "../../../../game/effects/slash";
import { enemyBox, enemyCenter } from "../../../../game/enemies/enemy";
import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { game, progress, rng } from "../../../../game/state";
import { boxHit } from "../../../../game/world";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { ARRIVE_A, ARRIVE_B } from "../moves/slashes";
import { drawPhantom } from "../phantom";
import { tempoTop } from "../tempo";

const ID = "ve_shade";
/** a shade starts this far from its foe and dashes this far past it at this speed */
const DASH = { from: 34, past: 34, speed: 420 } as const;

interface Shade {
  x: number;
  y: number;
  face: number;
  to: number;
  back: boolean;
  struck: Set<Enemy>;
  foe: Enemy;
}
interface ShadeMemory {
  cd: number;
  shades: Shade[];
}
const memoryOf = (m: SkillMemory): ShadeMemory => m as unknown as ShadeMemory;

/** a shade from one side of the foe, dashing through it to the other */
function shadeAt(foe: Enemy, side: number): Shade {
  return {
    x: foe.x - side * DASH.from,
    y: foe.y,
    face: side,
    to: foe.x + side * DASH.past,
    back: false,
    struck: new Set(),
    foe,
  };
}

/** the shade dashes; it cuts its foe as it passes (every foe on its line from the third level), and turns back once from
 *  the fifth */
function dash(s: Shade, dt: number): boolean {
  const v = skillValues(ID);
  s.x += s.face * DASH.speed * dt;
  for (const e of v.line ? game.enemies : [s.foe]) {
    if (e.hp <= 0 || s.struck.has(e) || !boxHit([s.x - 4, s.y - 30, s.x + 4, s.y], enemyBox(e))) continue;
    s.struck.add(e);
    const [x, y] = enemyCenter(e);
    game.fx.push(createSlash(x, y + 18, s.face, { ...ARRIVE_A, cy: -18 }));
    game.fx.push(createSlash(x, y + 18, s.face, { ...ARRIVE_B, cy: -18 }));
    dealDamage(e, progress.stats.ad * v.power, { fromX: s.x - s.face * 6, kx: s.face * 30, ky: -30, source: ID });
  }
  if (Math.sign(s.to - s.x) === s.face) return true;
  if (!v.back || s.back) return false;
  s.back = true;
  s.face = -s.face;
  s.to = s.foe.x + s.face * DASH.past;
  s.struck.clear();
  return true;
}

/**
 * Dusk Shade: a blow of hers may call a shade that dashes through its foe with a cross cut; levels make it cut its whole
 * line, turn back and come in pairs, and as Shade Troupe a shade comes with every blow at the top of Tempo.
 */
export const duskShade: SkillBehavior = {
  create: () => ({ cd: 0, shades: [] }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
    m.shades = m.shades.filter((s) => dash(s, dt));
  },
  draw(memory) {
    for (const s of memoryOf(memory).shades) drawPhantom(s.x, s.y, s.face, 0.8);
  },
  on: {
    blow(memory, ev) {
      if (ev.source !== "attacks") return;
      const m = memoryOf(memory);
      const v = skillValues(ID);
      const always = skillEvolved(ID) && tempoTop();
      if (m.cd > 0 || (!always && !rng.chance(v.chance))) return;
      m.cd = withBuild("cooldown", v.cooldown);
      const side = rng.chance(0.5) ? 1 : -1;
      m.shades.push(shadeAt(ev.foe, side));
      if (v.pair) m.shades.push(shadeAt(ev.foe, -side));
    },
  },
};
