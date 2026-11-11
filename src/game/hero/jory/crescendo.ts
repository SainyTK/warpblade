import { SPARKS } from "../../../constants/palette";
import { PK } from "../../../types/particle";
import { bladeAngle } from "../../../utils/poseFrame";
import { hero, particles, rng } from "../../state";
import { tier } from "./beat";

/** a mallet's felt head sits this far from the hand along the shaft */
const MALLET_TIP = 9.4;

/** at Crescendo his mallet heads leave cobalt smears behind them, from where the near hand was last drawn */
export function trailMallets(): void {
  if (tier() < 4 || hero.state === "dead" || !rng.chance(0.6)) return;
  const a = bladeAngle(hero.pose);
  const [hx, hy] = hero.hand;
  const lx = hx + Math.cos(a) * MALLET_TIP;
  const ly = hy + Math.sin(a) * MALLET_TIP;
  particles.spawn(PK.EMBER, hero.x + hero.face * lx, hero.y + ly, 0, -4, rng.range(0.12, 0.22), {
    sparks: SPARKS.beat,
  });
}
