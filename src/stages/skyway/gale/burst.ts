import { ENEMIES } from "../../../constants/enemies";
import { launchEnemy } from "../../../game/enemies/airborne";
import { kindOf } from "../../../game/enemies/kinds";
import { fxRng, game, hero, particles } from "../../../game/state";
import { dust, shake } from "../../../game/world";
import { PK } from "../../../types/particle";
import { TAU } from "../../../utils/math";
import { GALE_COLORS } from "./colors";

const REACH = { base: 30, perLevel: 6, tall: 50 } as const;
const SHOVE = { base: 110, perLevel: 24 } as const;
const LIFT = { base: 90, perLevel: 12 } as const;

export function galeBurst(x: number, y: number, level: number): void {
  const reach = REACH.base + REACH.perLevel * level;
  for (const e of game.enemies) {
    if (e.hp <= 0 || Math.abs(e.x - x) > reach || Math.abs(e.y - y) > REACH.tall) continue;
    const dir = Math.sign(e.x - x) || Math.sign(e.x - hero.x) || 1;
    const def = ENEMIES[e.type];
    const shove = (SHOVE.base + SHOVE.perLevel * level) * (1 - def.weight * 0.85);
    e.vx = dir * shove;
    if (def.launchable && e.rank === "minion")
      launchEnemy(e, -(LIFT.base + LIFT.perLevel * level) * (kindOf(e.type).flies ? 0.5 : 1));
  }
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * TAU;
    particles.spawn(PK.STREAK, x, y - 4, Math.cos(a) * 170, Math.sin(a) * 60 - 20, 0.3, {
      col: fxRng.pick(GALE_COLORS.wind),
      size: 1,
    });
  }
  dust(x - 8, y, 5, -1);
  dust(x + 8, y, 5, 1);
  shake(0.18, 2);
}
