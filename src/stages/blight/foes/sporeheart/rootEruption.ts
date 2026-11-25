import { GROUND } from "../../../../constants/stage";
import { fleck, glow, hairline, line, place, polygon, px } from "../../../../engine/frame";
import { fxRng, particles } from "../../../../game/state";
import { dust, shake } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { grain } from "../../../../utils/grain";
import { clamp } from "../../../../utils/math";
import { BLIGHT, BLIGHT_SPARKS } from "../../colors";
import { strikeOnce } from "../../spores";

const ROOT = { rise: 0.07, stand: 0.36, sink: 0.3, height: 30, half: 5 } as const;
const B = BLIGHT.bark;

function drawWarning(x: number, k: number, t: number): void {
  const reach = 2 + k * 7;
  const c = k > 0.7 ? BLIGHT.markHot : BLIGHT.mark;
  let lx = x - reach;
  let ly = GROUND;
  for (let i = 1; i <= 6; i++) {
    const nx = x - reach + (i / 6) * reach * 2;
    const ny = GROUND + (i === 6 ? 0 : (grain(i, x) - 0.5) * 2);
    line(lx, ly, nx, ny, c, 0.5 + k * 0.5);
    lx = nx;
    ly = ny;
  }
  for (let i = 0; i < 5; i++) {
    const age = (t * 2.2 + i / 5) % 1;
    fleck(x + (grain(i, x + 9) - 0.5) * reach * 1.6, GROUND - 1 - age * 10 * k, BLIGHT.spore[3], (1 - age) * k);
  }
  glow(x, GROUND, 6 + k * 8, BLIGHT.mark, 0.2 + k * 0.4);
}

function rootEdge(x: number, h: number, lean: number, side: number, inset: number): [number, number][] {
  const pts: [number, number][] = [];
  const pieces = 8;
  for (let i = 0; i <= pieces; i++) {
    const u = i / pieces;
    const half = Math.max(0, ROOT.half * (1 - u) ** 0.8 + 0.3 - inset);
    pts.push([x + side * half + lean * h * 0.2 * u + Math.sin(u * 5) * 0.8, GROUND - h * u + inset]);
  }
  return pts;
}

function drawRoot(x: number, h: number, lean: number): void {
  const left = rootEdge(x, h, lean, -1, 0);
  const right = rootEdge(x, h, lean, 1, 0);
  polygon([...left, ...right.reverse()], BLIGHT.outline);
  const innerLeft = rootEdge(x, h, lean, -1, 0.5);
  const innerRight = rootEdge(x, h, lean, 1, 0.5);
  polygon([...innerLeft, ...innerRight.slice().reverse()], B[3]);
  const middle = rootEdge(x, h, lean, -1, ROOT.half * 0.45);
  polygon([...innerLeft, ...middle.reverse()], B[2]);
  for (let i = 0; i < innerRight.length - 1; i++)
    hairline(innerRight[i][0] - 0.5, innerRight[i][1], innerRight[i + 1][0] - 0.5, innerRight[i + 1][1], B[4]);
  for (let i = 1; i < 5; i++) {
    const u = i / 5;
    const cx = x + lean * h * 0.2 * u;
    const cy = GROUND - h * u;
    hairline(cx - 1.5, cy, cx + 0.5, cy - 2, B[1]);
    const side = i % 2 ? -1 : 1;
    const half = ROOT.half * (1 - u) ** 0.8;
    hairline(cx + side * half, cy, cx + side * (half + 2.5), cy - 2, BLIGHT.bone[2]);
    fleck(cx + side * (half + 2.5), cy - 2, BLIGHT.bone[3]);
  }
  px(x + lean * h * 0.2 - 0.5, GROUND - h - 0.5, BLIGHT.bone[3]);
  px(x - 2, GROUND - h * 0.45, BLIGHT.fungus[3]);
  fleck(x - 2, GROUND - h * 0.45 - 0.5, BLIGHT.fungus[4]);
}

export function createRootEruption(x: number, mark: number, damage: number, struck: Set<number>): Effect {
  let t = 0;
  let burst = false;
  const tall = ROOT.height * (0.85 + grain(Math.floor(x), 3) * 0.3);
  const lean = (grain(Math.floor(x), 7) - 0.5) * 0.8;
  const height = (): number => {
    const u = t - mark;
    if (u < 0) return 0;
    if (u < ROOT.rise) return tall * (u / ROOT.rise);
    if (u < ROOT.rise + ROOT.stand) return tall;
    return tall * Math.max(0, 1 - (u - ROOT.rise - ROOT.stand) / ROOT.sink);
  };
  return {
    update(dt) {
      t += dt;
      if (t < mark) {
        if (fxRng.chance(0.1)) dust(x + fxRng.range(-3, 3), GROUND, 1);
        return true;
      }
      if (!burst) {
        burst = true;
        dust(x, GROUND, 5);
        shake(0.08, 1.2);
        for (let i = 0; i < 6; i++)
          particles.spawn(PK.SHARD, x, GROUND - 2, fxRng.range(-60, 60), -fxRng.range(60, 150), fxRng.range(0.3, 0.6), {
            col: fxRng.pick(BLIGHT_SPARKS.bark),
            size: fxRng.range(1, 2),
          });
      }
      if (t - mark < ROOT.rise + ROOT.stand) {
        const h = height();
        strikeOnce(struck, [x - ROOT.half, GROUND - h, x + ROOT.half, GROUND], damage, x);
      }
      return t < mark + ROOT.rise + ROOT.stand + ROOT.sink;
    },
    drawBack() {
      place();
      if (t < mark + ROOT.rise) drawWarning(x, clamp(t / mark), t);
    },
    draw() {
      const h = height();
      if (h < 1) return;
      place();
      drawRoot(x, h, lean);
    },
  };
}
