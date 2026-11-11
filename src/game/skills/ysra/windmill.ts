import { EMBER } from "../../../constants/characters/ysra/look";
import { ENEMIES } from "../../../constants/enemies";
import { fleck, glow, line, place } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { WHITE } from "../../../utils/color";
import { dealDamage } from "../../damage";
import { fineRing } from "../../effects/fine";
import { enemyBox } from "../../enemies/enemy";
import { game, hero, progress } from "../../state";
import { boxHit } from "../../world";
import { skillValues, withCharms } from "../query";
import { memoryAs } from "./memory";
import { scorch } from "./scorch";

const ID = "y_windmill";
/** how many steps of fire trail behind each tip of the turning glaive */
const WAKE_STEPS = 12;
/** the wheel's radius around her middle, its passes a second, and how fast it draws foes in */
const RADIUS = 30;
const PASSES = 6;
const PULL_SPEED = 90;

interface WheelMemory {
  /** seconds the wheel still spins, and to its next pass */
  spin: number;
  pass: number;
}

/** one pass of the wheel: every foe it reaches is struck and scorched, and the foes in the pull are drawn in */
function pass(): void {
  const v = skillValues(ID);
  const r = withCharms("area", RADIUS);
  const box: [number, number, number, number] = [hero.x - r, hero.y - 18 - r, hero.x + r, hero.y];
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const d = e.x - hero.x;
    if (Math.abs(d) < v.pull && Math.abs(d) > r * 0.5) e.vx = -Math.sign(d) * PULL_SPEED * (1 - ENEMIES[e.type].weight);
    if (!boxHit(box, enemyBox(e))) continue;
    dealDamage(e, progress.stats.ad * v.power, { fromX: hero.x, kx: -Math.sign(d) * 40, source: ID });
    if (v.scorch) scorch(e as Enemy, v.scorch);
  }
}

/** Fire Wheel: after the windmill, a wheel of fire keeps spinning around her as she walks */
export const windmill: SkillBehavior = {
  create: () => ({ spin: 0, pass: 0 }),
  update(memory, _state, dt) {
    const m = memoryAs<WheelMemory>(memory);
    if (m.spin <= 0) return;
    m.spin -= dt;
    m.pass -= dt;
    if (m.pass > 0) return;
    m.pass = 1 / PASSES;
    pass();
  },
  draw(memory) {
    const m = memoryAs<WheelMemory>(memory);
    if (m.spin <= 0) return;
    const r = withCharms("area", RADIUS);
    const cx = hero.x;
    const cy = hero.y - 18;
    const a0 = game.t * 18;
    place();
    fineRing(cx, cy, r, r * 0.35, EMBER[4], 0.9);
    fineRing(cx, cy, r - 1, (r - 1) * 0.35, EMBER[2], 0.5);
    for (let k = 0; k < 2; k++) {
      const a = a0 + k * Math.PI;
      const tx = cx + Math.cos(a) * r;
      const ty = cy + Math.sin(a) * r * 0.35;
      line(cx - (tx - cx) * 0.4, cy - (ty - cy) * 0.4, tx, ty, (u) => EMBER[u > 0.7 ? 5 : 4]);
      // the blade's wake: an arc of fire trailing behind each tip round the ring
      for (let w = 1; w <= WAKE_STEPS; w++) {
        const b = a - w * 0.09;
        fleck(cx + Math.cos(b) * r, cy + Math.sin(b) * r * 0.35, EMBER[w < 5 ? 5 : 4], 1 - w / WAKE_STEPS);
        fleck(cx + Math.cos(b) * (r - 0.5), cy + Math.sin(b) * (r - 0.5) * 0.35, EMBER[3], 1 - w / WAKE_STEPS);
      }
      fleck(tx, ty, WHITE);
      glow(tx, ty, 8, EMBER[4], 0.5);
    }
    glow(cx, cy, r, EMBER[3], 0.25 * Math.min(1, m.spin * 3));
  },
  on: {
    spin(memory) {
      const v = skillValues(ID);
      if (!v.wheel) return;
      const m = memoryAs<WheelMemory>(memory);
      m.spin = withCharms("duration", v.wheel);
      m.pass = 0;
    },
  },
};
