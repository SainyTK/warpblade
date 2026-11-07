import { FEEL, PHANTOM_RAMP } from "../../../constants/combo";
import { PAL, SPARKS } from "../../../constants/palette";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { createSlash } from "../../effects/slash";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { meleeHit } from "../../meleeHit";
import { objectMemory, rememberPerSeat } from "../../seatMemory";
import { skillEvolved, skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { boxAhead, newSwing } from "../../world";
import { UPPERCUT } from "../moves/slashes";
import { showPhantom } from "../phantom";
import { refundStamina } from "../stamina";

const SKILL = "k_passing";
/** Phantom Rush: the phantoms cut again this long after the dash ends, standing this far apart along its path */
const RUSH = { delay: 0.25, spacing: 18, life: 0.4 } as const;
const CUT_SLASH = { cx: 0, cy: -20, R: 18, sy: 0.35, rot: 0.15, a0: -2.8, a1: 0.4, W: 6, ramp: PHANTOM_RAMP };

/** where the dash in progress started, for Phantom Rush's path */
const dash = { from: 0 };
rememberPerSeat(objectMemory(dash, true));

export function startPassingCut(): void {
  dash.from = hero.x;
}

/** Passing Cut: a foe the dash passes through is cut, triple on a perfect dodge, slowed, and pays back stamina */
export function cutPassed(e: Enemy): void {
  const v = skillValues(SKILL);
  if (!v.cut) return;
  const perfect = hero.perfectUsed && v.perfect ? v.perfect : 1;
  const [ex, ey] = enemyCenter(e);
  game.fx.push(createSlash(ex, ey + 20, hero.face, CUT_SLASH));
  game.fx.push(createImpact(ex, ey, hero.face, perfect > 1, SPARKS.crystal));
  dealDamage(e, progress.stats.ad * v.cut * perfect, { fromX: hero.x - hero.face * 10, kx: hero.face * 30, ky: -20 });
  if (v.refund) refundStamina(v.refund);
  if (v.chill) e.chill = Math.max(e.chill, withCharms("duration", v.chill));
}

/** the dash ends: a rising cut on the foe ahead, and with Phantom Rush phantoms along the path that cut again */
export function endPassingCut(): void {
  const v = skillValues(SKILL);
  if (v.rising) {
    newSwing();
    const hits = meleeHit([boxAhead(-4, -46, 30, 0)], {
      power: v.rising,
      kx: 30,
      ky: -60,
      launch: -220,
      feel: FEEL.firm,
    });
    if (hits) game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...UPPERCUT, W: 7 }));
  }
  if (skillEvolved(SKILL)) game.fx.push(createRush(dash.from, hero.x, hero.y, hero.face, progress.stats.ad * v.rush));
}

/** Phantom Rush: phantoms stand along the dash's path, then cut every foe on it */
function createRush(from: number, to: number, y: number, face: number, damage: number): Effect {
  const n = Math.max(1, Math.floor(Math.abs(to - from) / RUSH.spacing));
  for (let i = 0; i <= n; i++) showPhantom(from + ((to - from) * i) / n, y, face, RUSH.delay + RUSH.life);
  let t = 0;
  return {
    update(dt) {
      t += dt;
      if (t < RUSH.delay) return true;
      const x0 = Math.min(from, to);
      const x1 = Math.max(from, to);
      for (const e of game.enemies) {
        const [bx0, by0, bx1, by1] = enemyBox(e);
        if (e.hp <= 0 || bx1 < x0 || bx0 > x1 || by1 < y - 40 || by0 > y + 4) continue;
        const [ex, ey] = enemyCenter(e);
        game.fx.push(createSlash(ex, ey + 20, -face, { ...CUT_SLASH, ramp: PAL.crystal }));
        dealDamage(e, damage, { fromX: ex - face * 10, kx: face * 30, source: SKILL });
      }
      return false;
    },
    draw() {},
  };
}
