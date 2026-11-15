import { haze, place } from "../../../engine/frame";
import { hero, particles, rng } from "../../../game/state";
import { PK } from "../../../types/particle";
import { SCREEN_LOOK, SPIRIT_LOOK } from "../constants/guard";
import { SCREEN } from "../constants/swords";
import { JADE } from "../look";
import type { SpiritLook } from "../types/look";
import { yun } from "./state";

/** the middle of the Sword Screen, before him */
const screenMiddle = (): [number, number] => [hero.x + hero.face * SCREEN.x, hero.y + SCREEN.y + SCREEN_LOOK.plateDy];

/** the soft plate of jade light the screen stands on, drawn before its swords so the guard reads with none held */
export function drawScreenPlate(): void {
  place();
  haze(...screenMiddle(), SCREEN_LOOK.plateRx, SCREEN_LOOK.plateRy, JADE[3], SCREEN_LOOK.plateA);
}

/** how the screen's swords draw now: white for a moment after a block */
export const screenLook = (): SpiritLook => (yun.screenFlash > 0 ? SPIRIT_LOOK.struck : SPIRIT_LOOK.screen);

/** a blow from the front met the screen: its swords flash white and jade flecks fly back toward the attacker */
export function screenBlocked(fromX: number): void {
  yun.screenFlash = SCREEN_LOOK.flash;
  const [x, y] = screenMiddle();
  const dir = Math.sign(fromX - hero.x) || hero.face;
  for (let i = 0; i < SCREEN_LOOK.flecks; i++)
    particles.spawn(
      PK.SPARK,
      x,
      y + rng.range(-8, 8),
      dir * rng.range(60, 140),
      rng.range(-90, -20),
      rng.range(0.15, 0.3),
      {
        col: JADE[4 + (i % 2)],
      },
    );
}

/** the flash fades */
export function tickScreen(dt: number): void {
  yun.screenFlash = Math.max(0, yun.screenFlash - dt);
}
