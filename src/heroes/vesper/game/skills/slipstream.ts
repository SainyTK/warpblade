import { RES } from "../../../../constants/stage";
import { fleck, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { createSlash } from "../../../../game/effects/slash";
import { enemyBox, enemyCenter } from "../../../../game/enemies/enemy";
import { refundStamina } from "../../../../game/hero/stamina";
import { meleeHit } from "../../../../game/meleeHit";
import { objectMemory, rememberPerSeat } from "../../../../game/seatMemory";
import { skillEvolved, skillLevel, skillValues, withBuild } from "../../../../game/skills/query";
import { fxRng, game, hero, progress } from "../../../../game/state";
import { boxAhead, boxHit, newSwing } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { DUSK_RAMP, DUSK_SPARKS } from "../../look/colors";
import { ARRIVE_A, ARRIVE_B } from "../moves/slashes";
import { vesper } from "../state";
import { gainTempo } from "../tempo";

const ID = "ve_slip";
/** Dusk Current: the current cuts foes in it this often, and stands this tall over the floor */
const CURRENT = { every: 0.25, tall: 26 } as const;

/** where the dodge in play started, for Dusk Current's path */
const path = { from: 0 };
rememberPerSeat(objectMemory(path, true));

/** Dusk Current: a band of dusk along the floor where she dodged, cutting the foes in it on each beat */
function createCurrent(x0: number, x1: number, y: number, life: number, damage: number): Effect {
  const o = { t: 0, beat: 0 };
  const [l, r] = [Math.min(x0, x1), Math.max(x0, x1)];
  return {
    update(dt) {
      o.t += dt;
      o.beat -= dt;
      if (o.beat <= 0) {
        o.beat = CURRENT.every;
        for (const e of game.enemies)
          if (e.hp > 0 && boxHit([l, y - CURRENT.tall, r, y + 2], enemyBox(e)))
            dealDamage(e, damage, { fromX: e.x - 1, kx: 0, source: ID });
      }
      return o.t < life;
    },
    draw() {
      place();
      const k = 1 - o.t / life;
      for (let x = l; x <= r; x += 1 / RES) {
        const wave = Math.sin(x * 0.4 + o.t * 12) * 1.5;
        fleck(x, y - 2 + wave, DUSK_RAMP[4], k * 0.8);
        if (fxRng.chance(0.04)) fleck(x, y - 4 - fxRng.range(0, CURRENT.tall) * k, DUSK_RAMP[5], k);
      }
    },
  };
}

/** the dodge starts: Slipstream gives back some of its stamina */
function started(): void {
  vesper.slipCut = 0;
  path.from = hero.x;
  const refund = skillValues(ID).refund;
  if (refund) refundStamina(refund);
}

/** the dodge passes a foe: Slipstream's short blade cuts it, each cut a Tempo stack from its third level */
function passed(e: Enemy): void {
  const v = skillValues(ID);
  if (!v.cut) return;
  vesper.slipCut++;
  const [x, y] = enemyCenter(e);
  game.fx.push(createImpact(x, y, hero.face, false, DUSK_SPARKS));
  dealDamage(e, progress.stats.ad * v.cut, {
    fromX: hero.x - hero.face * 4,
    kx: hero.face * 30,
    ky: -30,
    melee: true,
    heavy: true,
  });
  if (v.tempo) gainTempo(v.tempo);
}

/** the dodge ends: Tempo held for a moment, the closing cross cut, and Dusk Current along its path */
function ended(): void {
  if (!skillLevel(ID)) return;
  const v = skillValues(ID);
  // Tempo starts its count to falling this many seconds late
  if (v.hold) vesper.idle = -v.hold;
  if (v.endCut) {
    newSwing();
    game.fx.push(createSlash(hero.x, hero.y, hero.face, ARRIVE_A));
    game.fx.push(createSlash(hero.x, hero.y, hero.face, ARRIVE_B));
    meleeHit([boxAhead(-4, -38, 30, 2)], { power: v.endCut, kx: 100, ky: -60, big: true });
  }
  if (skillEvolved(ID))
    game.fx.push(
      createCurrent(path.from, hero.x, hero.y, withBuild("duration", v.current), progress.stats.ad * v.currentPower),
    );
}

/** Slipstream on the shared dodge's hooks */
export const SLIPSTREAM = { started, passed, ended };
