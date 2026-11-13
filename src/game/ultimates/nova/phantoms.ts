import { NOVA_PHANTOM } from "../../../constants/kael/nova";
import { W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { clamp } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { createSlash } from "../../effects/slash";
import { createWarpLine } from "../../effects/warpLine";
import { enemyBox, enemyCenter, walks } from "../../enemies/enemy";
import { showPhantom } from "../../hero/phantom";
import { game, hero } from "../../state";

const PHANTOM_SLASH = { cx: 2, cy: -20, R: 22, sy: 0.55, rot: -0.4, a0: -2.5, a1: 0.9, W: 8 };

interface Phantom {
  foe: Enemy;
  at: number;
  x: number;
  y: number;
  face: number;
  shown: boolean;
  cuts: number;
}

/** a phantom stands at the foe's back, on the side it is not facing */
function behind(foe: Enemy, at: number): Phantom {
  const box = enemyBox(foe);
  const side = -foe.face || 1;
  const x = clamp(side > 0 ? box[2] + 8 : box[0] - 8, 8, W - 8);
  const y = walks(foe) ? foe.y : enemyCenter(foe)[1] + 18;
  return { foe, at, x, y, face: -side, shown: false, cuts: 0 };
}

/** Crystal Nova's phantoms: a phantom of Kael steps out behind each of the nearest struck foes and cuts it three times */
export function createNovaPhantoms(foes: readonly Enemy[], count: number, damage: number): Effect {
  const phantoms = [...foes]
    .filter((e) => e.hp > 0)
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x))
    .slice(0, count)
    .map((foe, i) => behind(foe, i * NOVA_PHANTOM.first));
  const cut = (p: Phantom) => {
    p.cuts++;
    const last = p.cuts === NOVA_PHANTOM.cuts;
    const [ex, ey] = enemyCenter(p.foe);
    game.fx.push(createSlash(p.x, p.y, p.face, { ...PHANTOM_SLASH, rot: PHANTOM_SLASH.rot + p.cuts * 0.5 }));
    game.fx.push(createImpact(ex, ey, p.face, last));
    dealDamage(p.foe, damage, { fromX: p.x, kx: p.face * 40, ky: -30, heavy: true, source: "ultimate" });
    sfx.hit(last);
  };
  let t = 0;
  return {
    update(dt) {
      t += dt;
      for (const p of phantoms) {
        if (t < p.at || p.foe.hp <= 0) continue;
        if (!p.shown) {
          p.shown = true;
          game.fx.push(createWarpLine(hero.x, hero.y - 18, p.x, p.y - 18));
          showPhantom(p.x, p.y, p.face, NOVA_PHANTOM.life);
          sfx.warp();
        }
        const due = Math.min(NOVA_PHANTOM.cuts, Math.floor((t - p.at) / NOVA_PHANTOM.gap) + 1);
        while (p.cuts < due && p.foe.hp > 0) cut(p);
      }
      return phantoms.some((p) => p.cuts < NOVA_PHANTOM.cuts && p.foe.hp > 0);
    },
    draw() {},
  };
}
