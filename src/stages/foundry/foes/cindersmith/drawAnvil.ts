import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { FORGE } from "../../colors";
import type { SmithPose } from "./pose";

const I = FORGE.iron;
const M = FORGE.molten;
const X = -32;

export function drawAnvil(s: SpriteCanvas, p: SmithPose, time: number): void {
  const bob = Math.round(Math.sin(time * 3) * 0.5 * 2) / 2 - p.anvil * Math.abs(Math.sin(time * 26)) * 0.8;
  const y = (v: number): number => v + bob;
  s.begin();
  for (const lx of [-9, -3, 3, 8]) s.stroke(X + lx, y(-5), X + lx + (lx < 0 ? -1 : 1), -0.6, 1.3, I[1]);
  s.shadeEdges(I[1], I[2], I[0]);
  s.commit();
  s.begin();
  s.poly(
    [
      [X - 11, y(-8)],
      [X + 10, y(-8)],
      [X + 11, y(-4)],
      [X - 12, y(-4)],
    ],
    I[2],
  );
  s.poly(
    [
      [X - 6, y(-13)],
      [X + 6, y(-13)],
      [X + 7, y(-8)],
      [X - 7, y(-8)],
    ],
    I[2],
  );
  s.shadeEdges(I[2], I[3], I[0], 2);
  s.commit();
  s.begin();
  s.poly(
    [
      [X - 22, y(-17)],
      [X - 12, y(-19)],
      [X + 11, y(-19)],
      [X + 12, y(-14)],
      [X - 10, y(-13)],
      [X - 14, y(-15)],
    ],
    I[3],
  );
  s.shadeEdges(I[3], I[4], I[1], 2);
  s.commit();
  s.begin();
  s.hairline(X - 12, y(-19), X + 11, y(-19), FORGE.ironGlint);
  s.hairline(X - 21, y(-17), X - 12, y(-18.6), I[4]);
  const glare = p.anvil > 0.5 ? M[5] : M[4];
  s.block(X + 3, y(-12), M[2], 2, 1.5);
  s.block(X - 4, y(-12), M[2], 2, 1.5);
  s.set(X + 3.5, y(-12), glare);
  s.set(X - 3.5, y(-12), glare);
  const open = p.anvil > 0.55 ? 1.5 + Math.sin(time * 30) * 0.4 : 0.5;
  s.block(X - 5, y(-7.5), M[p.anvil > 0.55 ? 4 : 2], 10, open);
  if (p.anvil > 0.55) s.hairline(X - 4, y(-7.5), X + 4, y(-7.5), WHITE);
  for (let i = -4; i <= 4; i += 2) s.set(X + i, y(-8.2), I[4]);
  s.commit(false);
}
