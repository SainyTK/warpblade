import { fleck, hairline, line, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { skin } from "../../../../game/hero/skin";
import { skillValues } from "../../../../game/skills/query";
import { nearestFoe, touches } from "../../../../game/skills/targets";
import { fxRng, game, hero, progress, rng } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { WHITE } from "../../../../utils/color";
import { CRANE } from "../../constants/skillLook";
import { SKILL } from "../../constants/skills/ids";
import { STORE_ANGLE } from "../moves/slashes";
import { sayaFx } from "../skillFx";
import { storeCut } from "../store";

/** one ink crane in flight: where it is, its heading, the foe it flies at, cuts left, the foes it has cut, its age */
interface Crane {
  x: number;
  y: number;
  a: number;
  target: Enemy | null;
  cuts: number;
  cut: Enemy[];
  age: number;
  flap: number;
}

interface CraneMemory {
  cd: number;
  cranes: Crane[];
}

const memoryOf = (m: SkillMemory): CraneMemory => m as unknown as CraneMemory;

/** a crane folds itself from the ink of a release at (x, y) */
const folded = { at: -1 };
const struck = { at: -1 };

function fold(mem: CraneMemory, x: number, y: number, turns: number): void {
  if (folded.at !== game.t) {
    folded.at = game.t;
    const v = skillValues(SKILL.crane);
    const damage = progress.stats.ad * (v.power + (v.store ?? 0)) * turns;
    sayaFx(SKILL.crane, { x, y, face: hero.face, toX: x + hero.face * 6, toY: y - 26 }, { damage, quiet: true });
  }
  mem.cranes.push({
    x,
    y,
    a: -Math.PI / 2 + rng.range(-0.6, 0.6),
    target: null,
    cuts: turns,
    cut: [],
    age: 0,
    flap: fxRng.range(0, 6),
  });
}

/** a crane flies at the nearest foe it has not cut, cuts it on touch, and turns for the next while it has cuts left */
function fly(c: Crane, dt: number): boolean {
  c.age += dt;
  c.flap += dt * 18;
  if (!c.target || c.target.hp <= 0) c.target = nearestFoe(c.x, c.y, c.cut);
  if (!c.target) return c.age < CRANE.life;
  const [tx, ty] = enemyCenter(c.target);
  const want = Math.atan2(ty - c.y, tx - c.x);
  let turn = want - c.a;
  while (turn > Math.PI) turn -= Math.PI * 2;
  while (turn < -Math.PI) turn += Math.PI * 2;
  c.a += Math.max(-CRANE.turn * dt, Math.min(CRANE.turn * dt, turn));
  c.x += Math.cos(c.a) * CRANE.speed * dt;
  c.y += Math.sin(c.a) * CRANE.speed * dt;
  if (!touches(c.target, c.x, c.y, CRANE.reach)) return c.age < CRANE.life;
  const v = skillValues(SKILL.crane);
  const ad = progress.stats.ad;
  game.fx.push(createImpact(c.x, c.y, Math.sign(Math.cos(c.a)) || 1, false));
  if (struck.at !== game.t) {
    struck.at = game.t;
    const face = Math.sign(Math.cos(c.a)) || 1;
    const at = { x: c.x - Math.cos(c.a) * 34, y: c.y - Math.sin(c.a) * 34, face, toX: c.x, toY: c.y };
    sayaFx(SKILL.crane, at, { damage: ad * (v.power + (v.store ?? 0)) * c.cuts });
  }
  dealDamage(c.target, ad * v.power, { fromX: c.x, kx: Math.cos(c.a) * 40, source: SKILL.crane });
  if (v.store) storeCut(c.target, ad * v.store, STORE_ANGLE.rise);
  c.cut = [...c.cut, c.target];
  c.target = null;
  c.cuts--;
  return c.cuts > 0 && c.age < CRANE.life;
}

/** a small folded crane of ink: two wings that beat, a white edge along their tops */
function drawCrane(c: Crane): void {
  const ramp = skin.ramp;
  const dx = Math.cos(c.a);
  const dy = Math.sin(c.a);
  const beat = Math.sin(c.flap) * 2.5;
  const [hx, hy] = [c.x + dx * 3, c.y + dy * 3];
  const [tx, ty] = [c.x - dx * 3, c.y - dy * 3];
  line(tx, ty, hx, hy, ramp[1]);
  line(c.x, c.y, c.x - dy * 3 - dx, c.y + dx * 3 - beat, ramp[2]);
  line(c.x, c.y, c.x + dy * 3 - dx, c.y - dx * 3 - beat, ramp[1]);
  hairline(c.x, c.y - 0.5, c.x - dy * 3 - dx, c.y + dx * 3 - beat - 0.5, WHITE, 0.8);
  fleck(hx, hy, WHITE);
}

/** Ink Crane: a release may fold cranes that fly at foes and cut them; Thousand Cranes folds one per foe released */
export const inkCrane: SkillBehavior = {
  create: () => ({ cd: 0, cranes: [] }),
  update(m, _state, dt) {
    const mem = memoryOf(m);
    mem.cd = Math.max(0, mem.cd - dt);
    mem.cranes = mem.cranes.filter((c) => fly(c, dt));
  },
  draw(m) {
    const mem = memoryOf(m);
    if (!mem.cranes.length) return;
    place();
    for (const c of mem.cranes) drawCrane(c);
  },
  on: {
    release(m, event) {
      const mem = memoryOf(m);
      const v = skillValues(SKILL.crane);
      if ((!event.full && !v.early) || !event.cuts.length) return;
      if (v.perFoe) {
        for (const c of event.cuts) fold(mem, ...enemyCenter(c.foe), v.turns);
        return;
      }
      if (mem.cd > 0 || !rng.chance(v.chance)) return;
      mem.cd = v.cd;
      const [x, y] = enemyCenter(event.cuts[0].foe);
      for (let i = 0; i < v.count; i++) fold(mem, x, y - i * 4, v.turns);
    },
  },
};
