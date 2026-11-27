import { fleck, hairline, line, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { skin } from "../../../../game/hero/skin";
import { skillValues, withBuild } from "../../../../game/skills/query";
import { nearestFoe, touches } from "../../../../game/skills/targets";
import { game, hero, progress, rng } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { WHITE } from "../../../../utils/color";
import { TAU } from "../../../../utils/math";
import { PAPER } from "../../constants/skillLook";
import { SKILL } from "../../constants/skills/ids";
import { STORE_ANGLE } from "../moves/slashes";
import { sayaFx } from "../skillFx";
import { storeCut } from "../store";

/** a paper blade: its place on the orbit, its seconds left, when it last cut each foe, and its flight once let go */
interface Blade {
  phase: number;
  left: number;
  hit: Map<Enemy, number>;
  x: number;
  y: number;
  flying: Enemy | null;
}

interface PaperMemory {
  t: number;
  blades: Blade[];
}

const memoryOf = (m: SkillMemory): PaperMemory => m as unknown as PaperMemory;

/** a blade folds with this chance, up to the most at once */
function fold(mem: PaperMemory, chance: number): void {
  const v = skillValues(SKILL.paper);
  if (mem.blades.length >= v.most || !rng.chance(chance)) return;
  const power = progress.stats.ad * (v.power + (v.store ?? 0)) * (mem.blades.length + 1);
  sayaFx(SKILL.paper, { x: hero.x, y: hero.y - 18, face: hero.face }, { damage: power, quiet: mem.blades.length > 0 });
  mem.blades.push({
    phase: rng.range(0, TAU),
    left: withBuild("duration", v.time),
    hit: new Map(),
    x: hero.x,
    y: hero.y - 18,
    flying: null,
  });
}

/** a blade cuts a foe it touches, at most once each `every` seconds */
function cut(mem: PaperMemory, b: Blade, e: Enemy, factor: number): void {
  const v = skillValues(SKILL.paper);
  const ad = progress.stats.ad;
  b.hit.set(e, mem.t);
  game.fx.push(createImpact(b.x, b.y, Math.sign(e.x - hero.x) || 1, false));
  sayaFx(
    SKILL.paper,
    { x: b.x, y: b.y, face: Math.sign(e.x - hero.x) || 1 },
    { damage: ad * (v.power + (v.store ?? 0)) * factor * mem.blades.length },
  );
  dealDamage(e, ad * v.power * factor, { fromX: b.x, kx: Math.sign(e.x - b.x) * 30, source: SKILL.paper });
  if (v.store) storeCut(e, ad * v.store, STORE_ANGLE.line);
}

/** a blade circles her and cuts what it touches; as its time ends it flies at a foe with the seventh level */
function move(mem: PaperMemory, b: Blade, dt: number): boolean {
  const v = skillValues(SKILL.paper);
  if (b.flying) {
    const [tx, ty] = enemyCenter(b.flying);
    const d = Math.hypot(tx - b.x, ty - b.y) || 1;
    b.x += ((tx - b.x) / d) * PAPER.flight * dt;
    b.y += ((ty - b.y) / d) * PAPER.flight * dt;
    if (b.flying.hp <= 0) return false;
    if (!touches(b.flying, b.x, b.y, PAPER.reach)) return true;
    cut(mem, b, b.flying, v.fly);
    return false;
  }
  b.left -= dt;
  b.phase += PAPER.spin * dt;
  const r = v.wider ? PAPER.wider : PAPER.radius;
  b.x = hero.x + Math.cos(b.phase) * r;
  b.y = hero.y - 18 + Math.sin(b.phase) * r * 0.5;
  for (const e of game.enemies) {
    if (e.hp <= 0 || !touches(e, b.x, b.y, PAPER.reach)) continue;
    if (mem.t - (b.hit.get(e) ?? -99) >= v.every) cut(mem, b, e, 1);
  }
  if (b.left > 0) return true;
  if (!v.fly) return false;
  b.flying = nearestFoe(b.x, b.y);
  return !!b.flying;
}

/** a folded paper blade: a thin pale shape with an ink edge, turning as it flies */
function drawBlade(b: Blade): void {
  const a = b.phase * 2;
  const dx = Math.cos(a) * 3;
  const dy = Math.sin(a) * 1.5;
  line(b.x - dx, b.y - dy, b.x + dx, b.y + dy, skin.ramp[5]);
  hairline(b.x - dx, b.y - dy + 0.5, b.x + dx, b.y + dy + 0.5, skin.ramp[1]);
  fleck(b.x + dx, b.y + dy, WHITE);
}

/** Paper Blades: a kill (and with its second level a full release) may fold a blade that circles her and cuts */
export const paperBlades: SkillBehavior = {
  create: () => ({ t: 0, blades: [] }),
  update(m, _state, dt) {
    const mem = memoryOf(m);
    mem.t += dt;
    mem.blades = mem.blades.filter((b) => move(mem, b, dt));
  },
  draw(m) {
    const mem = memoryOf(m);
    if (!mem.blades.length) return;
    place();
    for (const b of mem.blades) drawBlade(b);
  },
  on: {
    kill: (m) => fold(memoryOf(m), skillValues(SKILL.paper).chance),
    release(m, event) {
      const v = skillValues(SKILL.paper);
      if (event.full && v.release) fold(memoryOf(m), v.chance * v.release);
    },
  },
};
