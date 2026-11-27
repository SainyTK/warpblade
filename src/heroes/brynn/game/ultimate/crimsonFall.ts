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
import { later } from "../effects/later";
import { createQuake } from "../effects/quake";
import { brynnFx, CRESCENT, CREST, layered, PLANTED } from "../fx";

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

/**
 * One crescent comes down on side `face`: every foe in reach in front and behind, up to the crescent's height, is
 * struck and knocked down. `n` counts the crescents of one cast, each wider than the last with Sundered Sky.
 */
function fall(level: number, face: number, n: number): void {
  const v = ultimateValues();
  const h = hero;
  const reach = FALL.reach[level - 1] * (1 + (v.reach ?? 0)) * (1 + (v.widen ?? 0) * n);
  const damage = ULT_LEVELS[level - 1].power * progress.stats.ad * FALL.share * (v.power ?? 1);
  game.fx.push(createSlash(h.x, h.y, face, crescent(reach)));
  const at = { x: h.x + face * 20, y: h.y, face, reach: 30 + level * 12 };
  if (n === 0) {
    brynnFx("br_fall", "pillar", at, { damage, signature: layered(CREST, PLANTED) });
    brynnFx("br_fall", "nova", { ...at, reach: reach * 0.35 }, { damage, quiet: true, delay: 0.05 });
  } else {
    const swing = { x: h.x + face * 12, y: h.y - 24, face, reach: 26 };
    brynnFx("br_fall", "slash", swing, { damage, quiet: true, signature: CRESCENT });
  }
  game.fx.push(createFloorRing(h.x + face * 20, h.y, reach, CRIMSON, 0.55));
  game.fx.push(createFloorRing(h.x + face * 20, h.y, reach * 0.5, CRIMSON, 0.4));
  lights.add(h.x + face * 20, h.y - 20, 80, CRIMSON[4], 1, 0.4);
  dust(h.x + face * 24, h.y, 12, face);
  for (const e of game.enemies) {
    const gap = Math.abs(e.x - h.x);
    if (e.hp <= 0 || gap > reach * (v.pull ? FALL.pull : 1) || e.y < h.y - FALL.height) continue;
    const dir = Math.sign(e.x - h.x) || face;
    // past the reach, the skill drags foes in toward her
    const kx = gap > reach ? -dir * FALL.drag : dir * 120;
    dealDamage(e, damage, { fromX: h.x, kx, ky: -80, stun: FALL.stun, heavy: true, source: "ultimate" });
    game.fx.push(createImpact(e.x, e.y - 10, dir, true, CRIMSON_SPARKS));
  }
  if (v.fissures && n === 0)
    for (const side of [h.face, -h.face])
      game.fx.push(
        createFloorWave({
          x: h.x + side * 16,
          y: h.y,
          face: side,
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

/** after the first crescent: the others it brings (each turned the other way), and the aftershocks round her */
function followUp(level: number): void {
  const v = ultimateValues();
  const h = hero;
  for (let n = 1; n < (v.falls ?? 1); n++)
    game.fx.push(later(n * FALL.next, () => fall(level, n % 2 ? -h.face : h.face, n)));
  const blow = ULT_LEVELS[level - 1].power * progress.stats.ad * FALL.share * (v.power ?? 1);
  for (let i = 1; i <= (v.quakes ?? 0); i++)
    game.fx.push(
      createQuake({
        x: h.x,
        y: h.y,
        reach: FALL.reach[level - 1] * 0.6,
        damage: blow * v.after,
        delay: i * FALL.quakeEvery,
        launch: -200,
        height: FALL.height,
        source: "ultimate",
      }),
    );
}

/** Crimson Fall waits for its clip's hit frame and for her feet, then falls */
function createFall(level: number): Effect {
  const hit = BRYNN_HELD_CLIPS.ultimate.hit;
  return {
    update() {
      if (hero.state !== "ultimate") return false;
      if (hero.st < hit || (!hero.ground && hero.st < BRYNN_HELD_CLIPS.ultimate.dur - 0.1)) return true;
      fall(level, hero.face, 0);
      followUp(level);
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
