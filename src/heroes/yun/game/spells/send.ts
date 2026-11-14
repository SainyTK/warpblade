import { game, progress } from "../../../../game/state";
import { LOTUS, STREAM } from "../../constants/abilities";
import { createLotus } from "../effects/lotus";
import { createStreamSword } from "../effects/stream";
import type { SwordPlace } from "../hover";
import { lotusEnded } from "../skills/thousandCuts";

/** Sword Stream: every sword flies the line ahead and back; held, they fan out at three heights and fly further */
export function sendStream(places: readonly SwordPlace[], wide: boolean): void {
  const damage = progress.stats.ap * STREAM.power;
  places.forEach((from, i) => {
    const rise = wide ? STREAM.rises[i % STREAM.rises.length] : 0;
    const reach = wide ? STREAM.wideReach : STREAM.reach;
    game.fx.push(
      createStreamSword({ from, delay: i * STREAM.gap, reach, rise, damage, source: "abilities", returns: true }),
    );
  });
}

/** Sword Lotus: the swords spin in a ring ahead; held, round Yun himself */
export function sendLotus(swords: number, wide: boolean): void {
  game.fx.push(
    createLotus({
      swords,
      radius: wide ? LOTUS.wideRadius : LOTUS.radius,
      life: wide ? LOTUS.wideLife : LOTUS.life,
      damage: progress.stats.ap * LOTUS.power,
      follow: wide,
      source: "abilities",
      ended: lotusEnded,
    }),
  );
}
