import { fleck, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { skillValues, withCharms } from "../../../../game/skills/query";
import { foesOnScreen } from "../../../../game/skills/targets";
import { game, progress } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { hex } from "../../../../utils/color";
import { GRAIN } from "../../constants/palette";
import { openWounds } from "../wounds";

const ID = "za_wraith";
/** a wraith whirls this fast along the floor, this far out, and cuts what it touches within this reach */
export const WRAITH = { speed: 150, range: 90, reach: 9, height: 26 } as const;
const EYE = hex("#3a1c08");

/** a sand wraith's figure at (x, y): a whirling column that thickens into a hooded head with two dark eyes */
export function drawWraith(x: number, y: number, t: number, dir: number, fade: number): void {
  place();
  for (let i = 0; i < 22; i++) {
    const h = (i / 22) * WRAITH.height;
    const r = 1.5 + (h / WRAITH.height) * 4 - (h > WRAITH.height * 0.8 ? 2 : 0);
    const a = t * 16 + i * 1.9;
    fleck(x + Math.cos(a) * r, y - h, GRAIN[i % GRAIN.length], fade);
  }
  fleck(x + dir, y - WRAITH.height + 4, EYE, fade);
  fleck(x + dir * 2.5, y - WRAITH.height + 4, EYE, fade);
}

/** cut every foe a wraith at (x, y) touches that it has not cut on this pass */
export function wraithCut(x: number, y: number, dir: number, struck: Set<Enemy>, power: number): void {
  const v = skillValues(ID);
  const reach = withCharms("area", WRAITH.reach);
  for (const e of foesOnScreen()) {
    if (struck.has(e) || Math.abs(e.x - x) > reach || e.y < y - WRAITH.height - 8 || e.y > y + 4) continue;
    struck.add(e);
    dealDamage(e, progress.stats.ad * power, { fromX: x - dir * 4, kx: dir * (v.drag ? 120 : 30), source: ID });
    openWounds(e, v.wounds ?? 0);
  }
}

/** a sand wraith whirls along the floor from (x, y) toward `dir`, and from level 4 turns back and cuts again */
export function sendWraith(x0: number, y: number, dir: number): void {
  const v = skillValues(ID);
  let x = x0;
  let t = 0;
  let way = dir;
  let back = !!v.back;
  let gone = 0;
  let struck = new Set<Enemy>();
  const range = withCharms("area", WRAITH.range);
  const fx: Effect = {
    update(dt) {
      t += dt;
      const step = WRAITH.speed * dt;
      x += way * step;
      gone += step;
      wraithCut(x, y, way, struck, v.power);
      if (gone < range) return true;
      if (!back) return false;
      back = false;
      way = -way;
      gone = 0;
      struck = new Set();
      return true;
    },
    draw() {
      drawWraith(x, y, t, way, Math.min(1, t / 0.1, (range - gone) / 20 + (back ? 1 : 0)));
    },
  };
  game.fx.push(fx);
}
