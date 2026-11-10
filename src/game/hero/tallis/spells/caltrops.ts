import { PAL } from "../../../../constants/palette";
import { place, px } from "../../../../engine/frame";
import { dealDamage } from "../../../damage";
import { enemyBox } from "../../../enemies/enemy";
import { kindOf } from "../../../enemies/kinds";
import { skillValues, withCharms } from "../../../skills/query";
import { game, hero, progress, rng } from "../../../state";
import { surfaceBelow } from "../../../world";
import { nightshade } from "../blowSkills";

const ID = "t_caltrops";
/** seconds between a strip's cuts on a foe standing on it */
const EVERY = 0.5;
/** Thorn Road's strips stand this long */
const ROAD = 3;

/**
 * A strip of caltrops on the floor from x0 to x1: every half second it cuts each ground foe standing on it, and with
 * its levels slows them, holds their facing and poisons them with Nightshade.
 */
export function scatterCaltrops(x0: number, x1: number, y: number, seconds: number): void {
  const lo = Math.min(x0, x1);
  const hi = Math.max(x0, x1);
  const spikes = Array.from({ length: Math.max(3, Math.round((hi - lo) / 5)) }, () => ({
    x: rng.range(lo, hi),
    tip: rng.chance(0.5) ? 1 : 0,
  }));
  let t = 0;
  let cut = 0;
  const tripped = new Set<object>();
  game.fx.push({
    update(dt) {
      t += dt;
      cut -= dt;
      const v = skillValues(ID);
      for (const e of game.enemies) {
        if (e.hp <= 0 || kindOf(e.type).flies) continue;
        const b = enemyBox(e);
        if (b[2] < lo || b[0] > hi || Math.abs(b[3] - y) > 4) continue;
        if (v.slow) e.chill = Math.max(e.chill, 0.3);
        if (v.still) e.turn = 0;
        if (v.trip && !tripped.has(e)) {
          tripped.add(e);
          e.stun = Math.max(e.stun, v.trip);
        }
        if (cut > 0) continue;
        dealDamage(e, progress.stats.ap * (v.power ?? 0.3), { fromX: e.x, source: ID });
        if (v.ignite) nightshade(e);
      }
      if (cut <= 0) cut = EVERY;
      return t < seconds;
    },
    drawBack() {
      place();
      const fade = Math.min(1, (seconds - t) * 2);
      for (const s of spikes) {
        px(Math.round(s.x), y - 1, PAL.gloam[2], fade);
        px(Math.round(s.x) + s.tip, y - 2, PAL.gloam[4], fade);
      }
    },
    draw() {},
  });
}

/** Caltrops: a strip on the floor ahead of him */
export function castCaltrops(): void {
  const v = skillValues(ID);
  const half = withCharms("area", v.width) / 2;
  const at = hero.x + hero.face * (half * 0.6);
  scatterCaltrops(at - half, at + half, surfaceBelow(at, hero.y - 1), withCharms("duration", v.life));
}

/** Thorn Road: a Sink path leaves caltrops along it */
export function thornRoad(from: number, to: number): void {
  if (!skillValues(ID).thornRoad) return;
  scatterCaltrops(from, to, hero.y, withCharms("duration", ROAD));
}
