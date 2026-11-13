import { DIAL } from "../../../../constants/mirel/look";
import { PAL } from "../../../../constants/palette";
import { W } from "../../../../constants/stage";
import { fleck, glow, hairline, place, polygon } from "../../../../engine/frame";
import type { Effect } from "../../../../types/effect";
import { clamp } from "../../../../utils/math";
import { dealDamage } from "../../../damage";
import { enemyBox } from "../../../enemies/enemy";
import { skillValues, withCharms } from "../../../skills/query";
import { game, hero, progress } from "../../../state";
import { surfaceBelow } from "../../../world";
import { mirel } from "../memory";

const ID = "m_sundial";
/** seconds between the dial's ticks, and between the gnomon's sweeps */
const TICK = 0.5;
const SWEEP = 1;

/** a dial on the floor: foes on it are slowed and ground by its ticks; the gnomon's shadow sweeps across it hard */
function createDial(x0: number): Effect {
  const v = skillValues(ID);
  const court = !!v.court;
  const width = withCharms("area", v.width);
  const life = withCharms("duration", v.life);
  let x = x0;
  let t = 0;
  let tick = 0;
  let sweep = 0;
  mirel.dials++;
  const floor = (): number => surfaceBelow(x, hero.y - 2);
  return {
    update(dt) {
      t += dt;
      if (court) x = hero.x;
      const y = floor();
      const on = game.enemies.filter((e) => {
        if (e.hp <= 0) return false;
        const b = enemyBox(e);
        return b[2] > x - width / 2 && b[0] < x + width / 2 && b[3] > y - 6 && b[3] <= y + 2;
      });
      for (const e of on) e.chill = Math.max(e.chill, 0.2);
      tick += dt;
      if (tick >= TICK) {
        tick -= TICK;
        for (const e of on) dealDamage(e, progress.stats.ap * v.power, { source: ID, dot: true });
      }
      sweep += dt;
      if (v.gnomon && sweep >= SWEEP) {
        sweep -= SWEEP;
        for (const e of on) dealDamage(e, progress.stats.ap * v.gnomon, { fromX: x, source: ID });
      }
      if (t < life) return true;
      // run with its owner swapped in, so this is her own count
      mirel.dials = Math.max(0, mirel.dials - 1);
      return false;
    },
    draw() {},
    drawBack() {
      place();
      const y = floor() - 1;
      const k = Math.min(1, t * 6) * Math.min(1, (life - t) * 3);
      const half = width / 2;
      // the dial's plate lies on the floor: two fine lines, hour marks standing on it, the quarters taller
      hairline(x - half, y + 0.5, x + half, y + 0.5, DIAL.bezel, k);
      hairline(x - half, y, x + half, y, DIAL.hour, 0.8 * k);
      for (let i = 0; i <= 12; i++) {
        const tx = x - half + (width * i) / 12;
        hairline(tx, y - (i % 3 ? 1 : 2), tx, y - 0.5, i % 3 ? DIAL.minute : DIAL.quarter, k);
      }
      const shadow = (sweep / SWEEP) * 2 - 1;
      hairline(x, y - 0.5, x + shadow * half, y - 0.5, DIAL.sandShade, 0.8 * k);
      // the gnomon: a brass blade leaning the way its shadow falls, lit along its upright edge
      polygon(
        [
          [x - 0.5, y],
          [x + 3, y],
          [x, y - 8],
        ],
        DIAL.sandShade,
        k,
      );
      hairline(x, y - 0.5, x, y - 8, DIAL.sand, k);
      fleck(x, y - 8.5, DIAL.quarter, k);
      glow(x, y - 2, half * 0.6, PAL.hour[3], 0.12 * k);
    },
  };
}

/** the dial lands on the floor ahead of her, or under her once it follows her, while fewer than its count stand */
export function castSundial(): void {
  const v = skillValues(ID);
  if (mirel.dials >= (v.count ?? 1)) return;
  const x = v.court ? hero.x : hero.x + hero.face * 30;
  game.fx.push(createDial(clamp(x, 10, W - 10)));
}
