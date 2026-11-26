import { HERO_CANVAS } from "../../../../constants/hero";
import { blit, detailCanvas } from "../../../../engine/sprite";
import { dealDamage } from "../../../../game/damage";
import { createSlash } from "../../../../game/effects/slash";
import { drawHeroSprite } from "../../../../game/hero/look";
import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { foesOnScreen } from "../../../../game/skills/targets";
import { game, progress } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import type { SpriteImage } from "../../../../types/sprite";
import { STRING_CLIPS } from "../../constants/clips/string";
import { SAND_RAMP } from "../../constants/palette";
import { RING_CUT } from "../moves/slashes";
import { openWounds } from "../wounds";

const ID = "za_mirage";
/** a dancer spins this often, cutting this far round it */
const DANCE = { every: 0.35, reach: 24 } as const;

/** the two figures a dancer turns between: the coil and the cut, taken from his sweep turn */
const FIGURES = [STRING_CLIPS.turn1.keys[2][1], STRING_CLIPS.turn1.keys[3][1]] as const;
const canvases = FIGURES.map(() => detailCanvas(HERO_CANVAS.w, HERO_CANVAS.h, HERO_CANVAS.ox, HERO_CANVAS.oy));

/** the dancer's two figures in his look, drawn once when it is called */
function snapshots(): SpriteImage[] {
  return FIGURES.map((pose, i) => {
    drawHeroSprite(canvases[i], pose, 2);
    return canvases[i].snapshot();
  });
}

/** one spin of a dancer at (x, y): the attacker takes the payoff, every other foe round it the plain cut */
function spin(x: number, y: number, target: Enemy, last: boolean): void {
  const v = skillValues(ID);
  const reach = withBuild("area", DANCE.reach);
  game.fx.push(createSlash(x, y, 1, { ...RING_CUT, R: reach, ramp: SAND_RAMP }));
  for (const e of foesOnScreen()) {
    if (Math.abs(e.x - x) > reach || Math.abs(e.y - y) > 30) continue;
    const power = e === target ? v.power : v.plain;
    dealDamage(e, progress.stats.ad * power, { fromX: x, kx: Math.sign(e.x - x) * 30, source: ID });
    openWounds(e, v.wounds ?? 0);
    if (v.blind && e.rank === "minion") e.blind = Math.max(e.blind, DANCE.every * 2);
  }
  if (last && skillEvolved(ID) && target.hp > 0)
    dealDamage(target, progress.stats.ad * v.burst, { fromX: x, ky: -50, source: ID });
}

/** a mirage dancer beside `target`, on the side `side`, spinning through it and the foes round it for its life */
export function callDancer(target: Enemy, side: number): void {
  const v = skillValues(ID);
  const images = snapshots();
  const life = withBuild("duration", v.life);
  const x = target.x + side * 14;
  const y = target.y;
  let t = 0;
  let next = 0;
  const fx: Effect = {
    update(dt) {
      t += dt;
      if (t >= next) {
        next += DANCE.every;
        spin(x, y, target, next > life);
      }
      return t < life;
    },
    draw() {
      const turn = Math.floor(t / (DANCE.every / 2)) % 2;
      const fade = Math.min(1, (life - t) / 0.3, t / 0.1);
      blit(images[turn], x, y, (turn === 0) === side > 0, { alpha: 0.6 * fade, tint: SAND_RAMP[4], tintAmount: 0.4 });
    },
  };
  game.fx.push(fx);
}
