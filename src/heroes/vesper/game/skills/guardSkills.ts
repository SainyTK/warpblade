import { dealDamage } from "../../../../game/damage";
import { createSlash } from "../../../../game/effects/slash";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { meleeHit } from "../../../../game/meleeHit";
import { skillEvolved, skillLevel, skillValues, withBuild } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import { boxAhead, boxBehind, newSwing } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { NIGHT_RAMP } from "../../look/colors";
import { vesperFx } from "../skillFx";
import { vesperSound } from "../sound";
import { vesper } from "../state";
import { gainTempo, tempoMost } from "../tempo";

const ID = "ve_turn";
/** Whirling Mirror: the blades spin round her and cut every foe this close, this often */
const SPIN = { reach: 50, every: 0.07 } as const;
/** the spin's arc, a ring of night round her */
const SPIN_SLASH = {
  cx: 0,
  cy: -18,
  R: 24,
  sy: 0.6,
  rot: 0,
  a0: -3,
  a1: 3,
  W: 5,
  sweep: 0.06,
  trail: 0.16,
  ramp: NIGHT_RAMP,
};

/** Whirling Mirror's spin: `cuts` cuts on every foe in reach, one every beat */
function createSpin(cuts: number, damage: number): Effect {
  const o = { t: 0, done: 0 };
  return {
    update(dt) {
      o.t += dt;
      while (o.done < cuts && o.t >= o.done * SPIN.every) {
        o.done++;
        game.fx.push(createSlash(hero.x, hero.y, o.done % 2 ? 1 : -1, SPIN_SLASH));
        for (const e of game.enemies) {
          if (
            e.hp <= 0 ||
            Math.abs(e.x - hero.x) > SPIN.reach ||
            Math.abs(enemyCenter(e)[1] - (hero.y - 16)) > SPIN.reach
          )
            continue;
          dealDamage(e, damage, { fromX: hero.x, kx: Math.sign(e.x - hero.x) * 20, melee: true, heavy: true });
        }
        vesperSound.dart();
      }
      return o.done < cuts;
    },
    draw() {},
  };
}

/**
 * Turning Blade, on a parry: the turn's cut is stronger and from its sixth level sweeps both sides, the opening lasts
 * longer, Tempo goes to the top, and as Whirling Mirror both blades spin round her.
 */
export function parrySkills(_foe: Enemy | null): void {
  const v = skillValues(ID);
  if (skillLevel(ID)) {
    const spin = skillEvolved(ID) ? (v.spin ?? 0) * (v.spinPower ?? 0) : 0;
    vesperFx(
      ID,
      { x: hero.x + hero.face * 8, y: hero.y - 18, face: hero.face },
      { damage: progress.stats.ad * (1 + (v.riposte ?? 0) + spin) },
    );
  }
  if (!v.riposte && !v.open) return;
  if (v.riposte) {
    newSwing();
    const boxes = v.around ? [boxAhead(-4, -38, 30, 2), boxBehind(-4, -38, 30, 2)] : [boxAhead(-4, -38, 30, 2)];
    meleeHit(boxes, { power: v.riposte, kx: 80, ky: -60, big: true, sureCrit: true });
  }
  if (v.open) vesper.opened = Math.max(vesper.opened, withBuild("duration", v.open));
  if (v.parryTop) gainTempo(tempoMost());
  if (skillEvolved(ID)) game.fx.push(createSpin(v.spin, progress.stats.ad * v.spinPower));
}

/** Turning Blade's eighth level: a block cuts back too */
export function blockSkills(): void {
  const v = skillValues(ID);
  if (!v.blockCut) return;
  newSwing();
  game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...SPIN_SLASH, a0: -2, a1: 1.2, R: 16 }));
  meleeHit([boxAhead(-4, -38, 26, 2)], { power: v.blockCut, kx: 60, ky: -30 });
}
