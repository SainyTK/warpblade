import { glow, glowLine, hairline, line, place, sparkle } from "../../../engine/frame";
import { sfx } from "../../../services/audio";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { fxRng, game, hero, particles, showBanner } from "../../state";
import { shake } from "../../world";
import { VOID, VOID_SPARKS } from "./colors";

export const FINAL_GAZE = { open: 1.4, aim: 1.2, burn: 0.7 } as const;

const chest = (): readonly [number, number] => [hero.x, hero.y - 18];

function strikeDown(e: Enemy): void {
  hero.hp = 0;
  Object.assign(hero, { state: "dead", st: 0, vx: Math.sign(hero.x - e.x) * 120, vy: -150, ground: false });
  Object.assign(hero, { move: null, queued: null, chain: 0, charge: 0, chargeLevel: 0, inv: 0 });
  game.flash = Math.max(game.flash, 0.9);
  shake(0.9, 6);
  sfx.thunder();
  sfx.defeat();
  showBanner("The eye has opened", 2.2);
  const [x, y] = chest();
  for (let i = 0; i < 40; i++)
    particles.spawn(PK.SPARK, x, y, fxRng.range(-200, 200), fxRng.range(-220, 60), fxRng.range(0.3, 0.8), {
      sparks: VOID_SPARKS,
    });
}

function drawAim(e: Enemy, k: number): void {
  const [x, y] = chest();
  const flicker = Math.floor(game.t * 24) % 2 === 0;
  hairline(e.x, e.y, x, y, k > 0.7 && flicker ? WHITE : VOID[4], (u) =>
    Math.sin(u * 50 - game.t * 30) > 0.3 - k ? 0.8 : 0,
  );
  glowLine(e.x, e.y, x, y, 4 + 6 * k, VOID[3], 0.25 + 0.45 * k);
  line(e.x, e.y, x, y, VOID[4], (u) => (Math.sin(u * 50 - game.t * 30) > 0.3 - k ? 0.35 + 0.5 * k : 0));
  glow(x, y, 10 + 14 * k, VOID[3], 0.3 + 0.5 * k);
  glow(e.x, e.y, 18 + 16 * k, VOID[4], 0.3 + 0.5 * k);
  sparkle(x, y, 3 + 4 * k, VOID[5], WHITE, 0.4 + 0.5 * k);
}

function drawBurn(e: Enemy, k: number): void {
  const [x, y] = chest();
  const half = Math.max(1, Math.round(6 * k));
  for (let o = -half; o <= half; o++) line(e.x + o * 0.4, e.y, x + o, y, Math.abs(o) < 2 ? WHITE : VOID[4], k);
  glowLine(e.x, e.y, x, y, 18 * k, VOID[3], 0.8 * k);
  glow(x, y, 40 * k, VOID[5], 0.9 * k);
}

export function createFinalGaze(e: Enemy): Effect {
  let t = 0;
  return {
    update(dt) {
      const before = t;
      t += dt;
      const aimAt = FINAL_GAZE.open;
      const burnAt = FINAL_GAZE.open + FINAL_GAZE.aim;
      if (before < aimAt && t >= aimAt) sfx.chime(0);
      if (before < burnAt && t >= burnAt) strikeDown(e);
      return t < burnAt + FINAL_GAZE.burn;
    },
    draw() {
      place();
      const aim = t - FINAL_GAZE.open;
      if (aim < 0) {
        glow(e.x, e.y, 30 * clamp(t / FINAL_GAZE.open), VOID[3], 0.4);
        return;
      }
      if (aim < FINAL_GAZE.aim) drawAim(e, aim / FINAL_GAZE.aim);
      else drawBurn(e, 1 - clamp((aim - FINAL_GAZE.aim) / FINAL_GAZE.burn));
    },
  };
}
