import { GROUND } from "../../../../constants/stage";
import { eachStanding } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, particles } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { FOE_SPARKS } from "../colors";
import { createInkSplash } from "../inkling/splash";
import { QUILLSHRIKE, QUILLSHRIKE_HITS } from "./moves";

export function splashDown(e: Enemy): void {
  const reach = QUILLSHRIKE.splash;
  eachStanding(() => {
    if (boxHit([e.x - reach, GROUND - 8, e.x + reach, GROUND], heroBox()))
      hurtHero(QUILLSHRIKE_HITS.splash * e.power, e.x);
  });
  game.fx.push(createInkSplash(e.x));
  for (let i = 0; i < 12; i++)
    particles.spawn(PK.SPARK, e.x, GROUND - 2, fxRng.range(-100, 100), -fxRng.range(60, 160), fxRng.range(0.3, 0.5), {
      sparks: FOE_SPARKS.ink,
      size: fxRng.range(1, 1.6),
    });
  sfx.hit(false, 0.8);
}
