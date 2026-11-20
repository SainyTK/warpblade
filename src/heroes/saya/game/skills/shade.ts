import { clampStageX } from "../../../../game/adventure";
import { dealDamage } from "../../../../game/damage";
import { createSlash } from "../../../../game/effects/slash";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { markFoe } from "../../../../game/enemies/skillStatus";
import { ghostCanvas } from "../../../../game/hero/afterimages";
import { drawHeroSprite } from "../../../../game/hero/look";
import { skillValues } from "../../../../game/skills/query";
import { nearestFoe } from "../../../../game/skills/targets";
import { game, hero, progress, rng } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { SAYA_POSES } from "../../constants/clips/poses";
import { SHADE_LOOK } from "../../constants/skillLook";
import { SKILL } from "../../constants/skills/ids";
import { SLASHES, STORE_ANGLE } from "../moves/slashes";
import { storeCut } from "../store";

/** a shade waiting to draw: the foe, which side of it, and the seconds until each of its draws */
interface Shade {
  foe: Enemy;
  side: number;
  draws: number[];
}

interface ShadeMemory {
  cd: number;
  shades: Shade[];
}

const memoryOf = (m: SkillMemory): ShadeMemory => m as unknown as ShadeMemory;

/** the pose a shade strikes in: the draw cut's level stroke at arm's length */
const DRAW_POSE = {
  ...SAYA_POSES.ready,
  fx: 18,
  fy: -18.6,
  sa: -0.06,
  hx: 4.5,
  hy: -10.8,
  nx: 8,
  ny: -20.2,
  ffx: 13.5,
  bfx: -7.5,
};

/** call shades on the foe nearest her, when the chance and the wait allow */
function call(mem: ShadeMemory): void {
  const v = skillValues(SKILL.shade);
  if (mem.cd > 0 || !rng.chance(v.chance)) return;
  const foe = nearestFoe(hero.x, hero.y - 18);
  if (!foe || Math.abs(foe.x - hero.x) > SHADE_LOOK.reach) return;
  mem.cd = v.cd;
  const near = Math.sign(foe.x - hero.x) || hero.face;
  const draws = v.twice ? [SHADE_LOOK.delay, SHADE_LOOK.delay + SHADE_LOOK.again] : [SHADE_LOOK.delay];
  for (let i = 0; i < v.count; i++) mem.shades.push({ foe, side: i === 0 ? near : -near, draws: [...draws] });
}

/** a shade draws on its foe: the hit lands on that foe only, and may store, mark and be a sure crit */
function draw(s: Shade): void {
  const v = skillValues(SKILL.shade);
  const ad = progress.stats.ad;
  const [cx] = enemyCenter(s.foe);
  const x = clampStageX(cx + s.side * SHADE_LOOK.gap, 8);
  const face = -s.side;
  drawHeroSprite(ghostCanvas, DRAW_POSE, 0);
  game.ghosts.push({
    s: ghostCanvas.snapshot(),
    x,
    y: s.foe.y,
    flip: face < 0,
    life: SHADE_LOOK.life,
    max: SHADE_LOOK.life,
  });
  game.fx.push(createSlash(x, s.foe.y, face, SLASHES.draw));
  dealDamage(s.foe, ad * v.power, { fromX: x, kx: face * 60, sureCrit: !!v.crit, heavy: true, source: SKILL.shade });
  if (v.store) storeCut(s.foe, ad * v.store, STORE_ANGLE.drawCut);
  if (v.mark) markFoe(s.foe, SKILL.shade, SHADE_LOOK.markTime, v.mark);
}

/** Ink Shade: a parry, a perfect dodge or (with its fifth level) a clean sheathe may call a shade that draws once on
 *  the nearest foe; Twin Moon calls two that each draw twice */
export const shade: SkillBehavior = {
  create: () => ({ cd: 0, shades: [] }),
  update(m, _state, dt) {
    const mem = memoryOf(m);
    mem.cd = Math.max(0, mem.cd - dt);
    for (const s of mem.shades) {
      s.draws = s.draws.map((t) => t - dt);
      if (s.foe.hp > 0 && s.draws[0] <= 0) draw(s);
      s.draws = s.draws.filter((t) => t > 0);
    }
    mem.shades = mem.shades.filter((s) => s.draws.length && s.foe.hp > 0);
  },
  on: {
    parry: (m) => call(memoryOf(m)),
    perfectDodge: (m) => call(memoryOf(m)),
    release(m, event) {
      if (event.clean && skillValues(SKILL.shade).clean) call(memoryOf(m));
    },
  },
};
