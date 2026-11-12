import { WOLF } from "../../../constants/brannoc/skills";
import { SPARKS } from "../../../constants/palette";
import { GROUND } from "../../../constants/stage";
import { place } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { drawSpiritWolf } from "../../effects/brannoc/spiritWolf";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { isBloodied } from "../../hero/brannoc/fury";
import { game, progress, rng } from "../../state";
import { skillValues, withCharms } from "../query";
import { foesOnScreen } from "../targets";
import { layBleed } from "./bleed";

const ID = "b_wolves";
/** seconds a bite's leap lasts, and how high it carries the wolf */
const BITE = { time: 0.2, lift: 6 } as const;
/** run frames a second */
const STRIDE = 12;

interface Wolf {
  x: number;
  face: number;
  target: Enemy | null;
  /** seconds since it came, it has stood with nothing to bite, since it began to fade, and of its bite's leap left */
  t: number;
  idle: number;
  gone: number;
  leap: number;
  /** seconds it stays and bites again (0 for one bite), whether it has bitten, and the wait to its next bite */
  stay: number;
  bitten: boolean;
  biteCd: number;
}

interface WolvesMemory {
  cd: number;
  wolves: Wolf[];
}

const memoryOf = (m: SkillMemory): WolvesMemory => m as unknown as WolvesMemory;

/** the nearest foe it can reach along the floor: within its look, and low enough to leap at */
function quarry(w: Wolf): Enemy | null {
  let best: Enemy | null = null;
  let bestD: number = WOLF.look;
  for (const e of foesOnScreen()) {
    const [cx, cy] = enemyCenter(e);
    if (cy < GROUND - WOLF.leap) continue;
    const d = Math.abs(cx - w.x);
    if (d >= bestD) continue;
    best = e;
    bestD = d;
  }
  return best;
}

function bite(w: Wolf, e: Enemy): void {
  const v = skillValues(ID);
  w.leap = BITE.time;
  w.bitten = true;
  w.biteCd = WOLF.biteEvery;
  const result = dealDamage(e, progress.stats.ad * (v.power ?? 0), {
    fromX: w.x,
    kx: w.face * WOLF.knock,
    source: ID,
  });
  if (result === "blocked") return;
  const [cx, cy] = enemyCenter(e);
  game.fx.push(createImpact(cx, cy, w.face, false, SPARKS.rage));
  if (v.bleed) layBleed(e, ID);
}

/** a wolf runs at its foe and bites; one that stays bites again until its time is up; false once it has faded */
function hunt(w: Wolf, dt: number): boolean {
  w.t += dt;
  w.leap = Math.max(0, w.leap - dt);
  w.biteCd = Math.max(0, w.biteCd - dt);
  if (w.stay > 0) w.stay = Math.max(0, w.stay - dt);
  const done = w.stay > 0 ? false : w.bitten ? w.leap <= 0 : w.idle > WOLF.idle;
  if (w.gone > 0 || done) {
    w.gone += dt;
    return w.gone < WOLF.fade;
  }
  if (!w.target || w.target.hp <= 0) w.target = quarry(w);
  const e = w.target;
  if (!e) {
    w.idle += dt;
    return true;
  }
  w.idle = 0;
  const gap = enemyCenter(e)[0] - w.x;
  if (Math.abs(gap) > WOLF.bite) {
    w.face = Math.sign(gap);
    w.x += w.face * Math.min(Math.abs(gap), WOLF.speed * dt);
    return true;
  }
  if (w.biteCd <= 0 && w.leap <= 0) bite(w, e);
  return true;
}

/** a red wolf spirit called from where a foe fell */
function wolf(x: number, stay: number): Wolf {
  return {
    x,
    face: rng.chance(0.5) ? 1 : -1,
    target: null,
    t: 0,
    idle: 0,
    gone: 0,
    leap: 0,
    stay,
    bitten: false,
    biteCd: 0,
  };
}

function drawWolf(w: Wolf): void {
  const show = Math.min(1, w.t / WOLF.show) * (1 - w.gone / WOLF.fade);
  const lift = w.leap > 0 ? Math.sin((1 - w.leap / BITE.time) * Math.PI) * BITE.lift : 0;
  drawSpiritWolf(w.x, GROUND, w.face, Math.floor(w.t * STRIDE), show * 0.9, lift, w.leap > 0);
}

/**
 * Blood Wolves: a kill may call red wolf spirits from the fallen foe that run at the nearest foe and bite it; with its
 * levels more wolves, harder bites, bleeding bites, more often, and wolves that stay and bite again. Blood Pack calls
 * a wolf on every kill while he is Bloodied.
 */
export const bloodWolvesSkill: SkillBehavior = {
  create: () => ({ cd: 0, wolves: [] }),
  update(memory, _s, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
    m.wolves = m.wolves.filter((w) => hunt(w, dt));
  },
  draw(memory) {
    place();
    for (const w of memoryOf(memory).wolves) drawWolf(w);
  },
  on: {
    kill(memory, event) {
      const m = memoryOf(memory);
      if (m.cd > 0) return;
      const v = skillValues(ID);
      const called = rng.chance(v.chance ?? 0);
      const pack = !!v.pack && isBloodied();
      const count = called ? Math.round(withCharms("amount", v.count ?? 1)) : pack ? 1 : 0;
      if (!count) return;
      m.cd = withCharms("cooldown", v.cooldown ?? 0.6);
      const [x] = enemyCenter(event.foe);
      const stay = v.stay ? withCharms("duration", v.stay) : 0;
      for (let i = 0; i < count; i++) m.wolves.push(wolf(x + (i - (count - 1) / 2) * 8, stay));
    },
  },
};
