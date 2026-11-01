import { PAL, WORLD_COLORS } from "../../constants/palette";
import { PK } from "../../types/particle";
import { meleeHit } from "../combat";
import { createFloorRing } from "../effects/floorRing";
import { createSlash } from "../effects/slash";
import { game, hero, particles, rng } from "../state";
import { boxAhead, dust, shake } from "../world";

/** the cross cut: a crescent from over the shoulder down to the front */
export function crossCut(): void {
  game.fx.push(
    createSlash(hero.x, hero.y, hero.face, { cx: 4, cy: -21, R: 21, sy: 0.62, rot: -0.35, a0: -2.5, a1: 0.95, W: 8 }),
  );
  meleeHit(boxAhead(-2, -38, 30, -2), 12, 90, -30, false);
}
/** the rising cut: sweeps up the front and lifts wisps */
export function risingCut(): void {
  game.fx.push(
    createSlash(hero.x, hero.y, hero.face, { cx: 6, cy: -20, R: 20, sy: 0.7, rot: 0.25, a0: 1.4, a1: -1.9, W: 7 }),
  );
  meleeHit(boxAhead(-4, -46, 26, -4), 12, 40, -170, false);
}
/** the falling smash: a wide crescent with an echo, and on the ground a ring, dust and rubble */
export function fallingSmash(): void {
  const shape = { cx: 6, cy: -22, sy: 0.55, rot: -0.15 };
  game.fx.push(
    createSlash(hero.x, hero.y, hero.face, {
      ...shape,
      R: 27,
      a0: -2.3,
      a1: 1.25,
      W: 12,
      sweep: 0.06,
      hold: 0.07,
      trail: 0.28,
    }),
  );
  game.fx.push(
    createSlash(hero.x, hero.y, hero.face, {
      ...shape,
      R: 21,
      a0: -2.0,
      a1: 1.15,
      W: 5,
      t0: 0.017,
      sweep: 0.06,
      hold: 0.03,
      trail: 0.2,
      ramp: PAL.crystal.slice(0, 6),
    }),
  );
  meleeHit(boxAhead(-2, -40, 38, 2), 22, 220, -60, true);
  if (!hero.ground) return;
  const gx = hero.x + hero.face * 22;
  game.fx.push(createFloorRing(gx, hero.y, 30, PAL.crystal, 0.35));
  dust(gx, hero.y, 7, hero.face);
  for (let i = 0; i < 6; i++)
    particles.spawn(
      PK.SHARD,
      gx,
      hero.y - 1,
      hero.face * rng.range(20, 120),
      rng.range(-180, -60),
      rng.range(0.5, 0.9),
      {
        col: WORLD_COLORS.rubble,
        size: rng.range(1.5, 3),
      },
    );
  shake(0.2, 2);
}
