import { SHARD_COLORS } from "../constants/effectColors";
import { PAL } from "../constants/palette";
import { SHARD_LIFT, SHARD_PIXELS } from "../constants/pickupPixels";
import { glow, place } from "../engine/frame";
import { stampArt } from "../game/effects/fine";
import { game } from "../game/state";

const GLOW = { heart: PAL.heart[3], mana: PAL.crystal[3] } as const;

export function drawShards(): void {
  place();
  for (const s of game.shards) {
    const bob = s.rest ? Math.sin(game.t * 4 + s.x) * 1.5 : 0;
    const y = s.y - SHARD_LIFT + bob;
    const twinkle = Math.sin(game.t * 7 + s.x * 0.3) > 0.6;
    glow(s.x, y, 14, GLOW[s.kind], twinkle ? 0.7 : 0.5);
    stampArt(
      `shard_${s.kind}${twinkle ? "_lit" : ""}`,
      SHARD_PIXELS[s.kind],
      s.x,
      y,
      SHARD_COLORS[s.kind][twinkle ? 1 : 0],
    );
  }
}
