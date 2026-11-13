import { NOVA_ECHO, NOVA_FOLLOW, NOVA_RADIUS, NOVA_SHARE } from "../../constants/kael/nova";
import { ULT_LEVELS } from "../../constants/ultimate";
import type { Enemy } from "../../types/enemy";
import { ultimateValues } from "../hero/ultimate";
import { game, hero, progress } from "../state";
import { createNovaEdges } from "./nova/edges";
import { createNovaPhantoms } from "./nova/phantoms";
import { createNovaRing } from "./nova/ring";
import { novaStars } from "./nova/stars";
import { createNovaStorm } from "./nova/storm";

/** what Crystal Nova's skill adds once the first ring has struck: phantoms, stars and the storm of edges on its foes */
function followUp(struck: readonly Enemy[], blow: number, v: Readonly<Record<string, number>>): void {
  if (v.phantoms) game.fx.push(createNovaPhantoms(struck, v.phantoms, blow * v.phantom));
  if (v.stars) novaStars(struck, v.stars, blow * v.star);
  if (v.edges) game.fx.push(createNovaEdges(struck, v.edges, blow * v.edge));
}

/**
 * Crystal Nova, Kael's ultimate: a ring of crystal bursts out around him and throws foes up. Its skill (`k_nova`) draws
 * foes in, sends phantoms, crystal stars and a storm of edges after the foes it struck, bursts again wider, and as
 * Supernova bursts three times and keeps the storm round Kael.
 */
export function castCrystalNova(level: number): void {
  const v = ultimateValues();
  const x = hero.x;
  const y = hero.y - 16;
  const reach = NOVA_RADIUS[level - 1];
  const blow = ULT_LEVELS[level - 1].power * progress.stats.ad * NOVA_SHARE;
  const pull = !!v.pull;
  const first = { x, y, reach, damage: blow * (v.power ?? 1), level, pull, delay: 0 };
  game.fx.push(createNovaRing({ ...first, done: (struck) => followUp(struck, blow, v) }));
  for (let i = 1; i <= (v.echoes ?? 0); i++)
    game.fx.push(
      createNovaRing({
        ...first,
        reach: reach * NOVA_ECHO.grow ** i,
        damage: first.damage * v.echo,
        delay: NOVA_ECHO.delay * i,
      }),
    );
  if (v.follow) game.fx.push(createNovaStorm(v.follow, blow * NOVA_FOLLOW.share));
}
