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
import { STRIKE_POSE } from "../hero/phantom";
import { skillEvolved, skillValues } from "../skills/query";
import { game, hero, progress } from "../state";
import { ultTargets } from "./targets";

const PHANTOMS = [2, 4, 8, Number.POSITIVE_INFINITY] as const;
const STRIKES = 3;
const STRIKE_GAP = 0.11;
const PHANTOM_SLASH = { cx: 2, cy: -20, R: 22, sy: 0.55, rot: -0.4, a0: -2.5, a1: 0.9, W: 8 };
const SKILL = "k_legion";
/** Phantom Legion's last cut throws the foe up this fast */
const LAUNCH = -300;

interface Phantom {
  foe: Enemy;
  at: number;
  x: number;
  y: number;
  face: number;
  shown: boolean;
  strikes: number;
}

/** stand a phantom behind a foe */
function behind(p: Phantom, foe: Enemy): void {
  const box = enemyBox(foe);
  const side = -foe.face || 1;
  p.foe = foe;
  p.x = clamp(side > 0 ? box[2] + 8 : box[0] - 8, 8, W - 8);
  p.y = walks(foe) ? foe.y : enemyCenter(foe)[1] + 18;
  p.face = -side;
}

/** the next foe with no phantom of its own, nearest the fallen one */
function nextFoe(phantoms: readonly Phantom[], from: Enemy): Enemy | null {
  return (
    game.enemies
      .filter((e) => e.hp > 0 && !phantoms.some((p) => p.foe === e))
      .sort((a, b) => Math.abs(a.x - from.x) - Math.abs(b.x - from.x))[0] ?? null
  );
}

/**
 * Phantom Legion: a phantom of Kael steps out behind each foe in reach and cuts it three times from its blind side. Its
 * levels add phantoms, repeat the cuts, launch, keep foes from turning and send a phantom on when its foe falls; as
 * Phantom Army the legion stays and keeps cutting.
 */
export function castPhantomLegion(level: number): void {
  const v = skillValues(SKILL);
  const evolved = skillEvolved(SKILL);
  const foes = ultTargets(level).slice(0, PHANTOMS[level - 1] + (v.extra ?? 0));
  const damage = (ULT_LEVELS[level - 1].power * progress.stats.ad * (v.power ?? 1)) / STRIKES;
  const gap = evolved ? v.armyEvery : STRIKE_GAP;
  const cuts = evolved ? Math.ceil(v.army / v.armyEvery) : STRIKES * (v.repeat ? 2 : 1);
  const cutDamage = (i: number): number => (!evolved && i >= STRIKES ? damage * v.repeat : damage);
  drawHero(ghostCanvas, STRIKE_POSE, heroLook(4));
  const snap = ghostCanvas.snapshot();
  const phantoms: Phantom[] = foes.map((foe, i) => {
    const p: Phantom = { foe, at: i * 0.07, x: 0, y: 0, face: 1, shown: false, strikes: 0 };
    behind(p, foe);
    return p;
  });
  const show = (p: Phantom) => {
    game.fx.push(createWarpLine(hero.x, hero.y - 18, p.x, p.y - 18));
    const life = Math.min(cuts * gap, 5) + 0.3;
    game.ghosts.push({ s: snap, x: p.x, y: p.y, flip: p.face < 0, life, max: life });
    sfx.warp();
  };
  const cut = (p: Phantom) => {
    const [ex, ey] = enemyCenter(p.foe);
    const last = p.strikes === cuts;
    game.fx.push(createSlash(p.x, p.y, p.face, { ...PHANTOM_SLASH, rot: PHANTOM_SLASH.rot + p.strikes * 0.5 }));
    game.fx.push(createImpact(ex, ey, p.face, last));
    dealDamage(p.foe, cutDamage(p.strikes - 1), {
      fromX: p.x,
      kx: p.face * 40,
      ky: -30,
      heavy: true,
      launch: last && v.launch ? LAUNCH : undefined,
      source: "ultimate",
    });
    if (v.lock) p.foe.turn = -v.lock;
    sfx.hit(last);
  };
  let t = 0;
  const effect: Effect = {
    update(dt) {
      t += dt;
      for (const p of phantoms) {
        if (t < p.at) continue;
        if (p.foe.hp <= 0 && (v.hop || evolved) && p.strikes < cuts) {
          const next = nextFoe(phantoms, p.foe);
          if (next) {
            behind(p, next);
            p.shown = false;
          }
        }
        if (!p.shown) {
          p.shown = true;
          show(p);
        }
        const due = Math.floor((t - p.at) / gap) + 1;
        while (p.strikes < Math.min(cuts, due) && p.foe.hp > 0) {
          p.strikes++;
          cut(p);
        }
      }
      return phantoms.some((p) => p.strikes < cuts && p.foe.hp > 0) && t < cuts * gap + 1;
    },
    draw() {},
  };
  game.fx.push(effect);
}
