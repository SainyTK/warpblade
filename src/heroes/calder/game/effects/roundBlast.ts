import { createBlastCore } from "../../../../game/effects/flash";
import { fxRng, game, lights, particles } from "../../../../game/state";
import { shake } from "../../../../game/world";
import { PK } from "../../../../types/particle";
import { GUNSMOKE, HOT_RAMP, PHOSPHOR } from "../../constants/colors";
import { calderSound } from "../sound";

/** how a round's blast looks: a heavy one is bigger and shakes more */
const LOOK = {
  light: { sparks: 7, smoke: 2, glow: 22, shake: [0.06, 1] },
  heavy: { sparks: 14, smoke: 4, glow: 34, shake: [0.14, 2.2] },
} as const;

/**
 * A round goes off at (x, y): a white heart in a green shell (gold for a hot round), sparks thrown away from Calder
 * along `dir`, a puff of gunsmoke, a flash of light and the crack of the shot. It draws and sounds; it deals nothing.
 */
export function roundBlast(x: number, y: number, dir: number, hot: boolean, heavy: boolean): void {
  const ramp = hot ? HOT_RAMP : PHOSPHOR;
  const look = heavy ? LOOK.heavy : LOOK.light;
  game.fx.push(createBlastCore(x, y, ramp[4]));
  for (let i = 0; i < look.sparks; i++)
    particles.spawn(PK.SPARK, x, y, dir * fxRng.range(40, 180), fxRng.range(-120, 60), fxRng.range(0.12, 0.3), {
      col: ramp[fxRng.int(4, 6)],
    });
  for (let i = 0; i < look.smoke; i++)
    particles.spawn(
      PK.SMOKE,
      x + fxRng.range(-3, 3),
      y + fxRng.range(-3, 3),
      dir * fxRng.range(5, 20),
      fxRng.range(-25, -8),
      fxRng.range(0.4, 0.7),
      {
        col: GUNSMOKE,
      },
    );
  lights.add(x, y, look.glow, ramp[4], 0.7, 0.18);
  shake(look.shake[0], look.shake[1]);
  calderSound.shot(heavy);
}
