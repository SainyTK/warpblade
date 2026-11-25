import { dealDamage } from "../../../../game/damage";
import { createSlash } from "../../../../game/effects/slash";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { objectMemory, rememberPerSeat } from "../../../../game/seatMemory";
import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { nearestFoe } from "../../../../game/skills/targets";
import { game, hero, progress, rng } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { NIGHT_RAMP } from "../../look/colors";
import { drawPhantom } from "../phantom";
import { vesperSound } from "../sound";

const ID = "ve_twin";
/** a phantom cuts this often, stands this far from its foe, looks for a new foe this far away, and lasts this long with no
 *  stay of its own */
const TWIN = { every: 0.12, gap: 12, seek: 80, life: 0.9, cooldown: 1 } as const;
/** the phantom's cut: a short arc of night */
const CUT = {
  cx: 0,
  cy: 0,
  R: 14,
  sy: 0.8,
  rot: 0.4,
  a0: -2.4,
  a1: 0.9,
  W: 5,
  sweep: 0.03,
  trail: 0.15,
  ramp: NIGHT_RAMP,
};

interface Phantom {
  x: number;
  y: number;
  face: number;
  foe: Enemy | null;
  cuts: number;
  next: number;
  left: number;
}
interface TwinMemory {
  cd: number;
  phantoms: Phantom[];
}
const memoryOf = (m: SkillMemory): TwinMemory => m as unknown as TwinMemory;

/** how many phantoms are out for Mirror Dance's buff; the HUD never reads it, so only the host keeps it */
const out = { count: 0 };
rememberPerSeat(objectMemory(out, true));

/** Mirror Dance: while a phantom is out her own blows deal more */
export const twinBuff = (): number => (out.count > 0 && skillEvolved(ID) ? skillValues(ID).buff : 0);

/** a parry or a perfect dodge may call phantoms of her, beside the nearest foe */
function call(m: TwinMemory): void {
  const v = skillValues(ID);
  if (m.cd > 0 || !rng.chance(v.chance)) return;
  m.cd = withBuild("cooldown", TWIN.cooldown);
  const foe = nearestFoe(hero.x, hero.y - 16);
  if (!foe) return;
  const n = skillEvolved(ID) ? 2 : 1;
  for (let i = 0; i < n; i++) {
    const side = i === 0 ? -(Math.sign(foe.x - hero.x) || hero.face) : Math.sign(foe.x - hero.x) || hero.face;
    m.phantoms.push({
      x: foe.x + side * TWIN.gap,
      y: foe.y,
      face: -side,
      foe,
      cuts: withBuild("amount", v.cuts),
      next: 0.1,
      left: withBuild("duration", v.stay ?? TWIN.life),
    });
  }
}

/** a phantom cuts its foe; once its string is spent it stays to cut any foe near it, if it has a stay */
function strike(p: Phantom): void {
  const v = skillValues(ID);
  if (!p.foe || p.foe.hp <= 0) p.foe = v.stay ? nearestFoe(p.x, p.y - 16) : null;
  if (!p.foe || Math.abs(p.foe.x - p.x) > TWIN.seek) return;
  const [x, y] = enemyCenter(p.foe);
  p.face = Math.sign(x - p.x) || p.face;
  const finale = p.cuts === 1 && v.launch;
  game.fx.push(createSlash(p.x, p.y, p.face, { ...CUT, cy: y - p.y }));
  // with the fifth level the phantom cuts from the foe's back
  const from = v.back ? x + p.face * 10 : p.x;
  dealDamage(p.foe, progress.stats.ad * v.power, {
    fromX: from,
    kx: p.face * 15,
    launch: finale ? -220 : undefined,
    source: ID,
  });
  vesperSound.dart();
}

/**
 * Twin Phantom: a parry or a perfect dodge may call a phantom of her beside the nearest foe, which cuts it in a string of
 * its own; levels add a launch at its end, back attacks, more cuts and a stay, and as Mirror Dance two come and her own
 * blows hit harder while one is out.
 */
export const twinPhantom: SkillBehavior = {
  create: () => ({ cd: 0, phantoms: [] }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
    for (const p of m.phantoms) {
      p.left -= dt;
      p.next -= dt;
      if (p.next > 0) continue;
      p.next = TWIN.every;
      if (p.cuts > 0) {
        strike(p);
        p.cuts--;
      } else if (skillValues(ID).stay) strike(p);
    }
    m.phantoms = m.phantoms.filter((p) => p.left > 0 && (p.cuts > 0 || !!skillValues(ID).stay));
    out.count = m.phantoms.length;
  },
  draw(memory) {
    for (const p of memoryOf(memory).phantoms) drawPhantom(p.x, p.y, p.face, Math.min(1, p.left * 3));
  },
  on: {
    parry: (memory) => call(memoryOf(memory)),
    perfectDodge: (memory) => call(memoryOf(memory)),
  },
};

/** a fresh run: no phantom out */
export function resetTwinCount(): void {
  out.count = 0;
}
