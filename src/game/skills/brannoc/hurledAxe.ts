import { HURLED_AXE, TWIN_FANGS } from "../../../constants/brannoc/skills";
import { SPARKS } from "../../../constants/palette";
import { place } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { TAU } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createDebtMotes } from "../../effects/brannoc/debtMotes";
import { drawHandAxe } from "../../effects/brannoc/handAxe";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { repay } from "../../hero/brannoc/debt";
import { game, hero, progress } from "../../state";
import { skillValues, withCharms } from "../query";
import { touches } from "../targets";
import { layBleed } from "./bleed";
import { type FoeGate, passGate, tickGate } from "./foeGate";

const ID = "b_axeThrow";

/** a thrown hand axe: where it is, the way it flies out, how far it has gone, and the foes it struck each way */
interface ThrownAxe {
  x: number;
  y: number;
  dx: number;
  dy: number;
  travelled: number;
  reach: number;
  out: boolean;
  spin: number;
  struckOut: Set<Enemy>;
  struckBack: Set<Enemy>;
}

/** Twin Fangs: seconds the two axes still orbit him, and the angle of the first */
interface Fangs {
  left: number;
  angle: number;
}

interface AxeMemory {
  axes: ThrownAxe[];
  fangs: Fangs | null;
  gate: FoeGate;
}

const memoryOf = (m: SkillMemory): AxeMemory => m as unknown as AxeMemory;

/** his chest, where the axes leave from and come back to */
const chestY = (): number => hero.y - HURLED_AXE.chest;

/** one axe's strike on a foe it passes */
function strike(e: Enemy, x: number, power: number, dir: number): boolean {
  const v = skillValues(ID);
  const result = dealDamage(e, progress.stats.ad * power, {
    fromX: x,
    kx: dir * HURLED_AXE.knock,
    source: "abilities",
  });
  if (result === "blocked") return false;
  const [cx, cy] = enemyCenter(e);
  game.fx.push(createImpact(cx, cy, dir, false, SPARKS.rage));
  if (v.bleed) layBleed(e, ID);
  return true;
}

/** the axe strikes each foe it passes once each way; going out without pierce, the first it strikes turns it back */
function strikeOnTheWay(a: ThrownAxe): void {
  const v = skillValues(ID);
  const struck = a.out ? a.struckOut : a.struckBack;
  const dir = a.out ? Math.sign(a.dx) || 1 : Math.sign(hero.x - a.x) || 1;
  for (const e of game.enemies) {
    if (e.hp <= 0 || struck.has(e) || !touches(e, a.x, a.y, HURLED_AXE.touch)) continue;
    struck.add(e);
    const landed = strike(e, a.x, v.power ?? 0, dir);
    if (a.out && landed && !v.pierce) {
      a.out = false;
      return;
    }
  }
}

/** he catches it: Hurled Axe's catch repays its share, the motes flying from the axe to his chest */
function caught(x: number, y: number): void {
  const share = skillValues(ID).returnRepay ?? 0;
  if (!share) return;
  if (repay(share, null) > 0) game.fx.push(createDebtMotes(x, y, hero.x, chestY()));
}

/** an axe flies out along its line, then comes back to his hand wherever he is; false once he has caught it */
function fly(a: ThrownAxe, dt: number): boolean {
  const step = withCharms("speed", HURLED_AXE.speed) * dt;
  a.spin += HURLED_AXE.spin * dt * (Math.sign(a.dx) || 1);
  if (a.out) {
    a.x += a.dx * step;
    a.y += a.dy * step;
    a.travelled += step;
    if (a.travelled >= a.reach) a.out = false;
    strikeOnTheWay(a);
    return true;
  }
  const gx = hero.x - a.x;
  const gy = chestY() - a.y;
  const d = Math.hypot(gx, gy);
  if (d <= step + 2) {
    caught(a.x, a.y);
    return false;
  }
  a.x += (gx / d) * step;
  a.y += (gy / d) * step;
  strikeOnTheWay(a);
  return true;
}

/** a hand axe thrown ahead of him, climbing `climb` radians */
function thrown(climb: number): ThrownAxe {
  return {
    x: hero.x + hero.face * 6,
    y: chestY(),
    dx: hero.face * Math.cos(climb),
    dy: Math.sin(climb),
    travelled: 0,
    reach: withCharms("area", HURLED_AXE.reach),
    out: true,
    spin: 0,
    struckOut: new Set(),
    struckBack: new Set(),
  };
}

/** where each of the two orbiting axes is, and whether it is on the near side of him */
function fangSpots(f: Fangs): { x: number; y: number; near: boolean; angle: number }[] {
  const r = withCharms("area", TWIN_FANGS.radius);
  return [f.angle, f.angle + Math.PI].map((g) => ({
    x: hero.x + Math.cos(g) * r,
    y: chestY() + Math.sin(g) * r * TWIN_FANGS.squash,
    near: Math.sin(g) >= 0,
    angle: g * 3,
  }));
}

/** Twin Fangs: the axes go round him and strike each foe they pass, each foe at most so often; at the end he catches
 *  both */
function orbit(m: AxeMemory, f: Fangs, dt: number): void {
  f.left -= dt;
  f.angle += TAU * TWIN_FANGS.turns * dt;
  const spots = fangSpots(f);
  for (const s of spots)
    for (const e of game.enemies) {
      if (e.hp <= 0 || !touches(e, s.x, s.y, HURLED_AXE.touch)) continue;
      if (!passGate(m.gate, e, TWIN_FANGS.every)) continue;
      strike(e, s.x, TWIN_FANGS.power, Math.sign(enemyCenter(e)[0] - hero.x) || hero.face);
    }
  if (f.left > 0) return;
  for (const s of spots) caught(s.x, s.y);
  m.fangs = null;
}

function drawFangs(m: AxeMemory, near: boolean): void {
  if (!m.fangs) return;
  place();
  for (const s of fangSpots(m.fangs)) if (s.near === near) drawHandAxe(s.x, s.y, s.angle, near ? 1 : 0.7);
}

/**
 * Hurled Axe: a spell on I paid in HP. A spinning hand axe flies ahead of him and comes back, striking on the way out
 * and back; with its levels it passes through foes, bleeds them, a second axe is thrown high, and catching each one
 * repays the debt. Twin Fangs keeps two axes orbiting him for a few seconds in place of the throw.
 */
export const hurledAxeSkill: SkillBehavior = {
  create: () => ({ axes: [], fangs: null, gate: new Map() }),
  update(memory, _s, dt) {
    const m = memoryOf(memory);
    tickGate(m.gate, dt);
    m.axes = m.axes.filter((a) => fly(a, dt));
    if (m.fangs) orbit(m, m.fangs, dt);
  },
  drawBack(memory) {
    drawFangs(memoryOf(memory), false);
  },
  draw(memory) {
    const m = memoryOf(memory);
    place();
    for (const a of m.axes) drawHandAxe(a.x, a.y, a.spin);
    drawFangs(m, true);
  },
  on: {
    cast(memory, event) {
      if (event.ability !== ID) return;
      const m = memoryOf(memory);
      const v = skillValues(ID);
      if (v.fangs) {
        m.fangs = { left: withCharms("duration", v.fangs), angle: m.fangs?.angle ?? 0 };
        return;
      }
      const count = Math.round(withCharms("amount", v.axes ?? 1));
      for (let i = 0; i < count; i++) m.axes.push(thrown(i === 0 ? 0 : HURLED_AXE.high * i));
    },
  },
};
