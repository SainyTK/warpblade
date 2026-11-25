import { glow, glowLine, hairline, place } from "../../engine/frame";
import type { Color } from "../../types/color";
import type { Effect } from "../../types/effect";
import { fxRng, game, lights } from "../state";

const ARC_LIFE = 0.24;
const ECHO_LIFE = 0.28;
const ARC_STEPS = 5;
const ARC_JAG = 5;

export function pushArc(x0: number, y0: number, x1: number, y1: number, color: Color, core: Color): void {
  const points: [number, number][] = [[x0, y0]];
  for (let i = 1; i < ARC_STEPS; i++) {
    const u = i / ARC_STEPS;
    points.push([
      x0 + (x1 - x0) * u + fxRng.range(-ARC_JAG, ARC_JAG),
      y0 + (y1 - y0) * u + fxRng.range(-ARC_JAG, ARC_JAG),
    ]);
  }
  points.push([x1, y1]);
  let life = ARC_LIFE;
  lights.add(x1, y1, 22, color, 0.7, ARC_LIFE);
  const arc: Effect = {
    update(dt) {
      life -= dt;
      return life > 0;
    },
    draw() {
      place();
      const a = life / ARC_LIFE;
      for (let i = 1; i < points.length; i++) {
        const [ax, ay] = points[i - 1];
        const [bx, by] = points[i];
        glowLine(ax, ay, bx, by, 5, color, 0.5 * a);
        hairline(ax, ay, bx, by, color, a);
        hairline(ax, ay - 0.5, bx, by - 0.5, core, a);
      }
    },
  };
  game.fx.push(arc);
}

export function pushEcho(x: number, y: number, color: Color): void {
  let life = ECHO_LIFE;
  const echo: Effect = {
    update(dt) {
      life -= dt;
      return life > 0;
    },
    draw() {
      place();
      const u = 1 - life / ECHO_LIFE;
      const r = 4 + u * 10;
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + u * 2;
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r * 0.7;
        hairline(px, py, px + Math.cos(angle) * 2, py + Math.sin(angle) * 1.4, color, 1 - u);
      }
      glow(x, y, 10 + u * 8, color, 0.35 * (1 - u));
    },
  };
  game.fx.push(echo);
}
