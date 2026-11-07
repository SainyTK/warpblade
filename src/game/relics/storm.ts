import { PAL } from "../../constants/palette";
import { STORM_STRIKE as S } from "../../constants/relics/storm";
import { GROUND } from "../../constants/stage";
import { ellipseRing, glow, line, place, px } from "../../engine/frame";
import { sfx } from "../../services/audio";
import type { RelicBehavior, RelicMemory } from "../../types/build";
import type { Enemy } from "../../types/enemy";
import { buildStats, relicStats } from "../../utils/build";
import { WHITE } from "../../utils/color";
import { dealDamage } from "../damage";
import { createFloorRing } from "../effects/floorRing";
import { enemyCenter } from "../enemies/enemy";
import { game, hero, progress, rng } from "../state";
import { surfaceBelow } from "../world";
import { distance2, foesOnScreen } from "./relicTargets";
import { createStormStrike } from "./stormStrike";

/** a strike called down on a foe: the mark crackles under it until `at` */
type Call = { e: Enemy; at: number };

type StormMemory = {
  t: number;
  /** seconds until the next volley */
  cd: number;
  calls: Call[];
};

const memoryOf = (m: RelicMemory): StormMemory => m as StormMemory;
const stats = (level: number, evolved: boolean) => relicStats("storm", level, evolved, buildStats(progress.build));
const groundUnder = (e: Enemy): number => {
  const [x, y] = enemyCenter(e);
  return Math.min(GROUND, surfaceBelow(x, y));
};

/** call strikes on random foes on screen, each foe once before any foe twice */
function callVolley(m: StormMemory, amount: number): void {
  const foes = foesOnScreen();
  for (let i = foes.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [foes[i], foes[j]] = [foes[j], foes[i]];
  }
  for (let i = 0; i < amount; i++) m.calls.push({ e: foes[i % foes.length], at: m.t + S.mark + i * S.spacing });
}

/** the strike lands: the foe and those beside it, and with the crown the foes it arcs to */
function strike(e: Enemy, level: number, evolved: boolean): void {
  const s = stats(level, evolved);
  const [x, y] = enemyCenter(e);
  const reach2 = (S.radius * s.area) ** 2;
  const struck = game.enemies.filter((o) => o.hp > 0 && (o === e || distance2(o, x, y) < reach2));
  for (const o of struck) dealDamage(o, s.damage, { source: "storm", kx: 0, ky: -40 });
  const arcs: [number, number][] = [];
  if (evolved)
    for (const o of game.enemies
      .filter((o) => o.hp > 0 && !struck.includes(o) && distance2(o, x, y) < S.arcReach ** 2)
      .sort((p, q) => distance2(p, x, y) - distance2(q, x, y))
      .slice(0, S.arcs)) {
      arcs.push(enemyCenter(o));
      dealDamage(o, s.damage * S.arcShare, { source: "storm", ky: -30 });
    }
  const ground = groundUnder(e);
  game.fx.push(
    createStormStrike(x, y, ground, arcs, evolved),
    createFloorRing(x, ground, S.radius * s.area, PAL.volt, 0.35),
  );
}

/** a crackling ring tightening on the floor under a called foe */
function drawMark(m: StormMemory, c: Call): void {
  if (c.e.hp <= 0) return;
  const k = 1 - (c.at - m.t) / S.mark;
  if (k < 0) return;
  const x = enemyCenter(c.e)[0];
  const ground = groundUnder(c.e);
  const r = 9 - k * 5;
  ellipseRing(x, ground, r, r * 0.3, PAL.volt[3], 0.8);
  glow(x, ground, 14, PAL.volt[2], 0.25 * k);
}

/** Thunder Crown: three crackling points of light over the hero's head */
function drawCrown(m: StormMemory): void {
  const V = PAL.volt;
  const x = hero.x;
  const y = hero.y - 39 + Math.sin(m.t * 2.4) * 0.8;
  line(x - 4, y + 2, x + 4, y + 2, V[2]);
  for (const dx of [-4, 0, 4]) {
    const h = dx === 0 ? 4 : 3;
    line(x + dx, y + 2, x + dx, y + 2 - h, V[3]);
    px(x + dx, y + 1 - h, rng.chance(0.2) ? V[4] : WHITE);
  }
  if (rng.chance(0.15)) px(x + rng.range(-5, 5), y + rng.range(-5, 2), V[4]);
  glow(x, y, 10, V[3], 0.3);
}

/** Storm Rod: lightning strikes random foes on screen. Evolved, each strike arcs to more foes. Design: docs/growth-design.md */
export const storm: RelicBehavior = {
  create: (): StormMemory => ({ t: 0, cd: 1, calls: [] }),
  update(memory, level, evolved, dt) {
    const m = memoryOf(memory);
    const s = stats(level, evolved);
    m.t += dt;
    m.cd -= dt;
    if (m.cd <= 0 && m.calls.length === 0 && foesOnScreen().length) {
      callVolley(m, s.amount);
      m.cd = s.cooldown;
    }
    let landed = false;
    m.calls = m.calls.filter((c) => {
      if (c.at > m.t) return c.e.hp > 0;
      if (c.e.hp > 0) {
        strike(c.e, level, evolved);
        landed = true;
      }
      return false;
    });
    if (landed) sfx.shatter();
  },
  draw(memory, _level, evolved) {
    const m = memoryOf(memory);
    place();
    for (const c of m.calls) drawMark(m, c);
    if (evolved && hero.state !== "dead") drawCrown(m);
  },
};
