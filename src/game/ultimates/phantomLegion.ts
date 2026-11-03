import { CLIPS } from "../../constants/clips";
import { W } from "../../constants/stage";
import { ULT_LEVELS } from "../../constants/ultimate";
import { sfx } from "../../services/audio";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { clamp } from "../../utils/math";
import { dealDamage } from "../damage";
import { createImpact } from "../effects/impact";
import { createSlash } from "../effects/slash";
import { createWarpLine } from "../effects/warpLine";
import { enemyBox, enemyCenter, walks } from "../enemies/enemy";
import { ghostCanvas } from "../hero/afterimages";
import { drawHero } from "../hero/drawHero";
import { heroLook } from "../hero/look";
import { game, hero, progress } from "../state";
import { ultTargets } from "./targets";

const PHANTOMS = [2, 4, 8, Number.POSITIVE_INFINITY] as const;
const STRIKES = 3;
const STRIKE_GAP = 0.11;
const PHANTOM_SLASH = { cx: 2, cy: -20, R: 22, sy: 0.55, rot: -0.4, a0: -2.5, a1: 0.9, W: 8 };
/** the strike pose, taken from the cross cut's hit frame */
const STRIKE_POSE = CLIPS.atk1.keys[2][1];

interface Phantom {
  foe: Enemy;
  at: number;
  x: number;
  y: number;
  face: number;
  shown: boolean;
  strikes: number;
}

/** Phantom Legion: a phantom of Kael steps out behind each foe in reach and cuts it three times from its blind side */
export function castPhantomLegion(level: number): void {
  const foes = ultTargets(level).slice(0, PHANTOMS[level - 1]);
  const damage = (ULT_LEVELS[level - 1].power * progress.stats.ad) / STRIKES;
  drawHero(ghostCanvas, STRIKE_POSE, heroLook(4));
  const snap = ghostCanvas.snapshot();
  const phantoms: Phantom[] = foes.map((foe, i) => {
    const box = enemyBox(foe);
    const behind = -foe.face || 1;
    const x = clamp(behind > 0 ? box[2] + 8 : box[0] - 8, 8, W - 8);
    return {
      foe,
      at: i * 0.07,
      x,
      y: walks(foe) ? foe.y : enemyCenter(foe)[1] + 18,
      face: -behind,
      shown: false,
      strikes: 0,
    };
  });
  let t = 0;
  const effect: Effect = {
    update(dt) {
      t += dt;
      for (const p of phantoms) {
        if (t < p.at) continue;
        if (!p.shown) {
          p.shown = true;
          game.fx.push(createWarpLine(hero.x, hero.y - 18, p.x, p.y - 18));
          game.ghosts.push({
            s: snap,
            x: p.x,
            y: p.y,
            flip: p.face < 0,
            life: STRIKES * STRIKE_GAP + 0.3,
            max: STRIKES * STRIKE_GAP + 0.3,
          });
          sfx.warp();
        }
        const due = Math.floor((t - p.at) / STRIKE_GAP) + 1;
        while (p.strikes < Math.min(STRIKES, due) && p.foe.hp > 0) {
          p.strikes++;
          const [ex, ey] = enemyCenter(p.foe);
          game.fx.push(createSlash(p.x, p.y, p.face, { ...PHANTOM_SLASH, rot: PHANTOM_SLASH.rot + p.strikes * 0.5 }));
          game.fx.push(createImpact(ex, ey, p.face, p.strikes === STRIKES));
          dealDamage(p.foe, damage, { fromX: p.x, kx: p.face * 40, ky: -30, heavy: true });
          sfx.hit(p.strikes === STRIKES);
        }
      }
      return phantoms.some((p) => p.strikes < STRIKES && p.foe.hp > 0) && t < 3;
    },
    draw() {},
  };
  game.fx.push(effect);
}
