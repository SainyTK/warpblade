import { PAL, WAX } from "../../../../constants/palette";
import { glow, place, px } from "../../../../engine/frame";
import type { Effect } from "../../../../types/effect";
import type { BiteZone } from "../../../../types/wenna";
import { dealDamage } from "../../../damage";
import { enemyBox } from "../../../enemies/enemy";
import { skillValues, withCharms } from "../../../skills/query";
import { game, hero, progress } from "../../../state";
import { surfaceBelow } from "../../../world";
import { wennaHost } from "../memory";
import { liveWicks } from "../wicks";

const ID = "w_waxPool";
/** seconds between the pool's ticks on foes, and how far ahead of her it spreads */
const TICK = 0.5;
const AHEAD = 40;
/** Hearth's pool, which follows her */
const HEARTH = 140;

/** a pool of warm wax on the floor: foes on it are chilled and scalded, her Wicks on it heal and bite faster */
function createPool(x0: number): Effect {
  const v = skillValues(ID);
  const hearth = !!v.hearth;
  const width = withCharms("area", hearth ? HEARTH : v.width);
  const life = withCharms("duration", v.life);
  let x = x0;
  let t = 0;
  let tick = 0;
  const zone: BiteZone = { x, y: hero.y, half: width / 2, rate: 1 + (v.bite ?? 0), left: life };
  if (zone.rate > 1) wennaHost.zones.push(zone);
  const floor = (): number => surfaceBelow(x, hero.y - 2);
  return {
    update(dt) {
      t += dt;
      if (hearth) x = hero.x;
      const y = floor();
      zone.x = x;
      zone.y = y;
      tick -= dt;
      const scald = tick <= 0;
      if (scald) tick = TICK;
      for (const e of game.enemies) {
        if (e.hp <= 0) continue;
        const b = enemyBox(e);
        if (b[2] < x - width / 2 || b[0] > x + width / 2 || b[3] < y - 6 || b[3] > y + 2) continue;
        e.chill = Math.max(e.chill, 0.3);
        if (scald && v.power) dealDamage(e, progress.stats.ap * v.power, { fromX: x, source: ID, dot: true });
      }
      for (const w of liveWicks())
        if (Math.abs(w.x - x) <= width / 2 && Math.abs(w.y - y) < 4) w.hp = Math.min(w.max, w.hp + v.heal * dt);
      return t < life;
    },
    drawBack() {
      place();
      const y = floor();
      const k = Math.min(1, t * 6, (life - t) * 2);
      const half = (width / 2) * Math.min(1, t * 5);
      for (let dx = -half; dx <= half; dx++) {
        const edge = 1 - Math.abs(dx) / Math.max(1, half);
        const ripple = Math.sin(dx * 0.5 + t * 4) > 0.6;
        px(Math.round(x + dx), y, ripple ? WAX[3] : WAX[2], k * (0.5 + edge * 0.5));
        if (edge > 0.2) px(Math.round(x + dx), y - 1, WAX[1], k * edge * 0.6);
      }
      glow(x, y - 2, width * 0.4, PAL.wick[3], 0.12 * k);
    },
    draw() {},
  };
}

/** Wax Pool: a pool ahead of her, a second behind her with its level; Hearth's follows her */
export function castWaxPool(): void {
  const v = skillValues(ID);
  const h = hero;
  game.fx.push(createPool(h.x + h.face * AHEAD));
  if ((v.pools ?? 1) >= 2 && !v.hearth) game.fx.push(createPool(h.x - h.face * AHEAD));
}
