import { W } from "../../../constants/stage";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { createSlash } from "../../effects/slash";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { kindOf } from "../../enemies/kinds";
import { G_THRUST } from "../../hero/ysra/glaive/slashes";
import { game, hero, progress, rng } from "../../state";
import { boxHit } from "../../world";
import { skillEvolved, skillValues, withCharms } from "../query";
import { memoryAs } from "./memory";
import { drawShade, SHADE_RAMP } from "./shadeBody";

const ID = "y_shade";
/** a thrust strikes this far ahead of the shade's feet, at this height band */
const THRUST = { reach: 60, top: -28, bottom: -4 } as const;
/** seconds a thrust holds out, between thrusts, and to fade in or out */
const HOLD = 0.14;
const GAP = 0.6;
const FADE = 0.2;
/** where the shades stand: behind her, and the Temple Host's three in a rank */
const BEHIND = 12;
const HOST = [
  { dx: -14, dy: 0, tilt: 0 },
  { dx: -22, dy: -6, tilt: -0.25 },
  { dx: -22, dy: 6, tilt: 0.25 },
] as const;

interface Shade {
  x: number;
  y: number;
  face: number;
  /** seconds since it stepped out, until it leaves; thrusts left; seconds to the next */
  t: number;
  life: number;
  thrusts: number;
  next: number;
  /** seconds its thrust still holds out */
  out: number;
}

interface ShadeMemory {
  cd: number;
  shades: Shade[];
  /** Temple Host: seconds its standing shades still hold their thrust */
  hostOut: number;
}

/** one thrust down the line ahead of a shade, at a slant for the host's fan */
function thrust(x: number, y: number, face: number, tilt = 0): void {
  const v = skillValues(ID);
  const reach = withCharms("area", THRUST.reach);
  const box: [number, number, number, number] =
    face > 0
      ? [x, y + THRUST.top + tilt * 30, x + reach, y + THRUST.bottom + tilt * 30]
      : [x - reach, y + THRUST.top + tilt * 30, x, y + THRUST.bottom + tilt * 30];
  game.fx.push(createSlash(x, y, face, { ...G_THRUST, R: reach * 0.55, rot: tilt, ramp: SHADE_RAMP }));
  for (const e of game.enemies) {
    if (e.hp <= 0 || !boxHit(box, enemyBox(e))) continue;
    dealDamage(e, progress.stats.ad * v.power, { fromX: x, kx: face * 80, source: ID });
    if (v.stagger && kindOf(e.type).staggers) e.stagger = Math.max(e.stagger, v.stagger);
    const [cx, cy] = enemyCenter(e);
    game.fx.push(createImpact(cx, cy, face, false));
  }
}

/** the foe nearest a shade, to turn and thrust at */
const nearest = (x: number): Enemy | null =>
  game.enemies.filter((e) => e.hp > 0).sort((a, b) => Math.abs(a.x - x) - Math.abs(b.x - x))[0] ?? null;

/** a shade steps out behind her, facing her way (and one facing back at its level 7) */
function call(m: ShadeMemory): void {
  const v = skillValues(ID);
  const faces = v.sides >= 2 ? [hero.face, -hero.face] : [hero.face];
  for (const face of faces) {
    const x = Math.max(8, Math.min(W - 8, hero.x - face * BEHIND));
    const life = v.stay ? withCharms("duration", v.stay) : v.thrusts * GAP + FADE;
    m.shades.push({ x, y: hero.y, face, t: 0, life, thrusts: v.thrusts, next: FADE, out: 0 });
  }
  m.cd = withCharms("cooldown", v.cooldown);
}

function step(s: Shade, dt: number, stays: boolean): boolean {
  s.t += dt;
  s.out = Math.max(0, s.out - dt);
  s.next -= dt;
  if (s.thrusts > 0 && s.next <= 0) {
    if (stays) {
      const foe = nearest(s.x);
      if (foe) s.face = Math.sign(foe.x - s.x) || s.face;
    }
    thrust(s.x, s.y, s.face);
    s.thrusts--;
    s.next = stays ? s.life / (skillValues(ID).thrusts + 1) : GAP;
    s.out = HOLD;
  }
  return s.t < s.life;
}

/** Glaive Shade: a landed blow may call a shade that thrusts through the line; as Temple Host, three stand with her and
 *  thrust in a fan with each blow */
export const glaiveShade: SkillBehavior = {
  create: () => ({ cd: 0, shades: [], hostOut: 0 }),
  update(memory, _state, dt) {
    const m = memoryAs<ShadeMemory>(memory);
    m.cd = Math.max(0, m.cd - dt);
    m.hostOut = Math.max(0, m.hostOut - dt);
    const stays = !!skillValues(ID).stay;
    m.shades = m.shades.filter((s) => step(s, dt, stays));
  },
  drawBack(memory, state) {
    const m = memoryAs<ShadeMemory>(memory);
    for (const s of m.shades) {
      const a = Math.min(1, s.t / FADE, (s.life - s.t) / FADE);
      drawShade(s.x, s.y, s.face, s.out > 0, Math.max(0, a));
    }
    if (!state.evolved) return;
    for (const p of HOST) drawShade(hero.x + hero.face * p.dx, hero.y + p.dy, hero.face, m.hostOut > 0, 0.8);
  },
  on: {
    blow(memory, e) {
      if (!e.melee || e.source !== "attacks") return;
      const m = memoryAs<ShadeMemory>(memory);
      if (m.cd > 0) return;
      if (skillEvolved(ID)) {
        for (const p of HOST) thrust(hero.x + hero.face * p.dx, hero.y + p.dy, hero.face, p.tilt);
        m.hostOut = HOLD;
        m.cd = skillValues(ID).cooldown;
        return;
      }
      if (rng.chance(skillValues(ID).chance)) call(m);
    },
  },
};
