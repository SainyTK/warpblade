import type { SpriteCanvas } from "../../../../engine/sprite";
import { COLOSSUS_COLORS } from "./colors";
import { plate } from "./plate";
import type { ColossusPose } from "./pose";

const St = COLOSSUS_COLORS.stone;
const Ic = COLOSSUS_COLORS.ice;

export function drawHead(s: SpriteCanvas, p: ColossusPose): void {
  const y = p.lift + p.hunch * 1.4;
  s.begin();
  s.poly(
    [
      [14, -46 + y],
      [23, -45 + y],
      [26, -39 + y],
      [24, -33 + y],
      [16, -33 + y],
      [13, -39 + y],
    ],
    St[2],
  );
  s.shadeEdges(St[2], St[4], St[0], 2);
  s.hairline(17, -35 + y, 24, -35.5 + y, St[0]);
  s.commit();
  plate(
    s,
    [
      [13, -45 + y],
      [24, -47 + y],
      [28, -42 + y],
      [15, -40 + y],
    ],
    [
      [14, -44 + y],
      [24, -46 + y],
    ],
    { dark: Ic[1], base: Ic[2], lit: Ic[3], rim: Ic[5] },
  );
  s.begin();
  s.block(17, -39.5 + y, COLOSSUS_COLORS.socket, 9, 2);
  s.commit(false);
  s.begin();
  const eye = p.glare ? COLOSSUS_COLORS.emberHot : COLOSSUS_COLORS.ember;
  s.block(18, -39 + y, eye, 2.5, 1);
  s.block(23, -39 + y, eye, 2, 1);
  s.commit(false);
}

export function drawPauldron(s: SpriteCanvas, p: ColossusPose, near: boolean): void {
  const y = p.lift + p.hunch;
  const x = near ? 4 : -10;
  const cy = -46 + y;
  plate(
    s,
    [
      [x - 8, cy + 1],
      [x - 4, cy - 7],
      [x + 5, cy - 8],
      [x + 10, cy - 1],
      [x + 7, cy + 5],
      [x - 5, cy + 6],
    ],
    [
      [x - 6, cy - 2],
      [x + 6, cy - 6],
    ],
    near ? { dark: Ic[1], base: Ic[2], lit: Ic[3], rim: Ic[5] } : { dark: Ic[0], base: Ic[1], lit: Ic[2], rim: Ic[3] },
  );
  s.begin();
  s.poly(
    [
      [x - 5, cy - 6],
      [x - 2, cy - 9],
      [x + 5, cy - 9.5],
      [x + 8, cy - 6],
      [x + 3, cy - 7],
    ],
    COLOSSUS_COLORS.snow[2],
  );
  s.shadeEdges(COLOSSUS_COLORS.snow[2], COLOSSUS_COLORS.snow[3], COLOSSUS_COLORS.snow[0]);
  s.commit();
}
