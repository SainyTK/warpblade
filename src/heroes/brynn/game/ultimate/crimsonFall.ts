import { ULT_LEVELS } from "../../../../constants/ultimate";
import { dealDamage } from "../../../../game/damage";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { createImpact } from "../../../../game/effects/impact";
import { createSlash } from "../../../../game/effects/slash";
import { lift } from "../../../../game/hero/lift";
import { ultimateValues } from "../../../../game/hero/ultimate";
import { game, hero, lights, progress } from "../../../../game/state";
import { dust, hitStop, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Effect } from "../../../../types/effect";
import { BRYNN_HELD_CLIPS } from "../../constants/clips/held";
import { CRIMSON, CRIMSON_SPARKS } from "../../constants/colors";
import { FALL } from "../../constants/fall";
import { createFloorWave } from "../effects/floorWave";

/** the crescent's look: an arc as tall as the reach allows, round the point the blade comes down on */
const crescent = (reach: number) => ({
  cx: 10,
  cy: -30,
  R: Math.min(60, 26 + reach * 0.12),
  sy: 0.9,
  rot: 0.1,
  a0: -2.6,
  a1: 1.1,
  W: 18,
  hold: 0.1,
  trail: 0.4,
  ramp: CRIMSON,
});

/** the blade comes down: every foe in reach in front and behind, up to the crescent's height, is struck and knocked down */
function fall(level: number): void {
  const v = ultimateValues();
  const h = hero;
  const reach = FALL.reach[level - 1] * (1 + (v.reach ?? 0));
  const damage = ULT_LEVELS[level - 1].power * progress.stats.ad * FALL.share * (v.power ?? 1);
  game.fx.push(createSlash(h.x, h.y, h.face, crescent(reach)));
  game.fx.push(createFloorRing(h.x + h.face * 20, h.y, reach, CRIMSON, 0.55));
  game.fx.push(createFloorRing(h.x + h.face * 20, h.y, reach * 0.5, CRIMSON, 0.4));
  lights.add(h.x + h.face * 20, h.y - 20, 80, CRIMSON[4], 1, 0.4);
  dust(h.x + h.face * 24, h.y, 12, h.face);
  for (const e of game.enemies) {
    if (e.hp <= 0 || Math.abs(e.x - h.x) > reach || e.y < h.y - FALL.height) continue;
    const dir = Math.sign(e.x - h.x) || h.face;
    dealDamage(e, damage, { fromX: h.x, kx: dir * 120, ky: -80, stun: FALL.stun, heavy: true, source: "ultimate" });
    game.fx.push(createImpact(e.x, e.y - 10, dir, true, CRIMSON_SPARKS));
  }
  if (v.fissures)
    for (const face of [h.face, -h.face])
      game.fx.push(
        createFloorWave({
          x: h.x + face * 16,
          y: h.y,
          face,
          reach: reach * 1.2,
          speed: 380,
          damage: damage * v.fissures,
          stun: FALL.stun,
          source: "ultimate",
          kind: "fissure",
        }),
      );
  hitStop(0.16);
  shake(0.45, 5);
  sfx.boom();
}

/** Crimson Fall waits for its clip's hit frame and for her feet, then falls */
function createFall(level: number): Effect {
  let done = false;
  const hit = BRYNN_HELD_CLIPS.ultimate.hit;
  return {
    update() {
      if (done) return false;
      if (hero.state !== "ultimate") return false;
      if (hero.st < hit || (!hero.ground && hero.st < BRYNN_HELD_CLIPS.ultimate.dur - 0.1)) return true;
      done = true;
      fall(level);
      return false;
    },
    draw() {},
  };
}

/** Crimson Fall, Brynn's ultimate: she leaps with the sword overhead and brings it down in one enormous crescent */
export function castCrimsonFall(level: number): void {
  lift(FALL.lift, true);
  game.fx.push(createFall(level));
}
