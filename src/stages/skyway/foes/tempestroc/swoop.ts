import { GROUND } from "../../../../constants/stage";
import { ellipseRing, fleck, glow, hairline, place } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { enemyBox } from "../../../../game/enemies/enemy";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles } from "../../../../game/state";
import { boxHit, dust, heroBox } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { clamp } from "../../../../utils/math";
import { SKY_FOES as C, SKY_SPARKS } from "../colors";
import { mindOf, type SwoopPath, swoopPoint } from "./mind";
import { ROC_HITS, ROC_WINDUP, SWOOP, stormWindup } from "./moves";

const DASHES = 40;
const LAST_CALL = 0.25;

export function planSwoop(): SwoopPath {
  const left = stageLeft() + SWOOP.edge;
  const right = stageRight() - SWOOP.edge;
  const xm = clamp(hero.x, left + 40, right - 40);
  const fromRight = xm < (left + right) / 2;
  const x0 = fromRight ? right : left;
  const x1 = fromRight ? left : right;
  const y0 = SWOOP.top;
  const y1 = SWOOP.top + 6;
  const cx = 2 * xm - (x0 + x1) / 2;
  const cy = 2 * SWOOP.low - (y0 + y1) / 2;
  const length = Math.abs(x1 - x0) + (SWOOP.low - y0) * 2;
  return { x0, y0, cx, cy, x1, y1, duration: length / SWOOP.speed };
}

export function flySwoop(e: Enemy, path: SwoopPath): boolean {
  const u = clamp(e.st / path.duration);
  const [x, y] = swoopPoint(path, u);
  const [nx, ny] = swoopPoint(path, Math.min(1, u + 0.02));
  e.vx = (nx - x) / (0.02 * path.duration);
  e.vy = (ny - y) / (0.02 * path.duration);
  e.x = x;
  e.y = y;
  e.face = Math.sign(path.x1 - path.x0) || e.face;
  const struck = mindOf(e).struck;
  eachStanding(() => {
    if (struck.has(heroSlot()) || !boxHit(enemyBox(e), heroBox())) return;
    struck.add(heroSlot());
    hurtHero(ROC_HITS.swoop * e.power, e.x - e.face * 10);
  });
  if (y > GROUND - 30 && fxRng.chance(0.7)) {
    dust(x, GROUND, 2, e.face);
    particles.spawn(PK.SPARK, x - e.face * 14, y + 6, -e.face * 60, -20, 0.3, { sparks: SKY_SPARKS.volt });
  }
  return u >= 1;
}

export function createSwoopMark(e: Enemy, path: SwoopPath): Effect {
  let t = 0;
  const windup = ROC_WINDUP.swoop * stormWindup(e);
  return {
    update(dt) {
      t += dt;
      return e.state === "dive" && e.hp > 0 && e.stagger <= 0;
    },
    drawBack() {
      place();
      const u = clamp(t / windup);
      const late = t >= windup - LAST_CALL;
      const tone = late ? C.volt[4] : C.volt[3];
      const crawl = (game.t * 0.6) % (1 / DASHES);
      for (let i = 0; i < DASHES; i++) {
        const k = i / DASHES + crawl;
        if (k > u * 1.3) break;
        const [x, y] = swoopPoint(path, k);
        const [x1, y1] = swoopPoint(path, k + 0.4 / DASHES);
        hairline(x, y, x1, y1, tone, late ? 1 : 0.4 + u * 0.4);
        fleck(x, y + 0.5, C.volt[2], 0.6);
      }
      const [lx, ly] = swoopPoint(path, 0.5);
      ellipseRing(lx, GROUND, 10 - u * 4, 2, tone, 0.4 + u * 0.6);
      glow(lx, ly, 14, C.volt[2], 0.1 + u * 0.2);
    },
    draw() {},
  };
}
