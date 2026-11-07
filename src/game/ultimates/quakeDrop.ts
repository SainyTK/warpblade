import { ENEMIES } from "../../constants/enemies";
import { QUAKE } from "../../constants/hulda/ultimates";
import { W } from "../../constants/stage";
import { ULT_LEVELS, ULT_REACH } from "../../constants/ultimate";
import { sfx } from "../../services/audio";
import { clamp } from "../../utils/math";
import { dealDamage } from "../damage";
import { createImpact } from "../effects/impact";
import { createQuakeLine } from "../effects/quakeLine";
import { enemyCenter } from "../enemies/enemy";
import { skin } from "../hero/skin";
import { game, hero, progress } from "../state";
import { shake, surfaceBelow } from "../world";

/**
 * Quake Drop, Hulda's special: she hops with both fists raised and slams them into the floor, and a crack runs out to
 * the level's reach (ahead at 1 and 2, both ways at 3, wall to wall at 4). Each foe on the floor it passes takes the
 * level's power once; minions are thrown up, bigger foes reel.
 */
export function castQuakeDrop(level: number): void {
  const floor = hero.ground ? hero.y : surfaceBelow(hero.x, hero.y);
  const x = clamp(hero.x + hero.face * 6, 6, W - 6);
  const reach = ULT_REACH[level - 1];
  const ends =
    level >= 4
      ? [6, W - 6]
      : level === 3
        ? [clamp(x - reach, 6, W - 6), clamp(x + reach, 6, W - 6)]
        : [clamp(x + hero.face * reach, 6, W - 6)];
  const damage = ULT_LEVELS[level - 1].power * progress.stats.ad;
  game.fx.push(
    createQuakeLine({
      x,
      floor,
      ends,
      ramp: skin.ramp,
      delay: QUAKE.slam,
      slam() {
        shake(QUAKE.shake[0], QUAKE.shake[1]);
        sfx.boom();
      },
      strike(e) {
        const [cx, cy] = enemyCenter(e);
        const minion = ENEMIES[e.type].launchable;
        dealDamage(e, damage, {
          fromX: x,
          kx: 0,
          launch: minion ? QUAKE.launch : undefined,
          heavy: true,
          source: "ultimate",
        });
        // the stun of a blow only holds minions; the quake makes bigger foes reel too
        if (!minion) e.stun = Math.max(e.stun, QUAKE.bigStun);
        game.fx.push(createImpact(cx, cy, Math.sign(cx - x) || 1, true));
        sfx.hit(true, 0.6);
      },
    }),
  );
}
