import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import { FAN, STREAM } from "../../constants/abilities";
import { SKILL } from "../../constants/skillIds";
import { createStreamSword } from "../effects/stream";
import { FAN as FAN_FX, yunFx } from "../fx";
import type { SwordPlace } from "../hover";

/** where a conjured sword appears: at his sword fingers */
function conjured(): SwordPlace {
  return { x: hero.x + hero.face * hero.pose.bx, y: hero.y + hero.pose.by, angle: hero.face > 0 ? 0 : Math.PI };
}

/**
 * Sword Fan: the held swords and those the skill conjures fly out in a fan of heights ahead, each cutting the foes it
 * passes; held, the fan opens wider. Peacock Fan sends every other sword behind him.
 */
export function castFan(places: readonly SwordPlace[], wide: boolean): void {
  const v = skillValues(SKILL.fan);
  const swords = [...places, ...Array.from({ length: withBuild("amount", v.extra ?? 0) }, conjured)];
  const around = skillEvolved(SKILL.fan);
  const at = { x: hero.x + hero.face * 22, y: hero.y - 22, face: hero.face, reach: 10 };
  yunFx(SKILL.fan, "burst", at, { damage: progress.stats.ap * v.power * swords.length, signature: FAN_FX });
  swords.forEach((from, i) => {
    const rise = FAN.rises[i % FAN.rises.length] * (wide ? FAN.wide : 1);
    game.fx.push(
      createStreamSword({
        from,
        delay: i * STREAM.gap * 0.5,
        reach: withBuild("area", v.reach),
        rise,
        damage: progress.stats.ap * v.power,
        source: "abilities",
        returns: !!v.back,
        stun: v.stun,
        face: around && i % 2 ? -hero.face : hero.face,
      }),
    );
  });
}
