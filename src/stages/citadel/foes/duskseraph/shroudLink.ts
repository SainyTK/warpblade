import { glow, hairline, place } from "../../../../engine/frame";
import { enemyCenter } from "../../../../game/enemies/enemy";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { ECLIPSE } from "../colors";
import { shroudKeeper } from "../shroud";

export function createShroudLink(ward: Enemy, keeper: Enemy): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return shroudKeeper(ward) === keeper;
    },
    drawBack() {
      const [wx, wy] = enemyCenter(ward);
      const r = 12 + Math.sin(t * 5) * 1.2;
      place();
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2 + t * 1.6;
        const b = a + 0.22;
        hairline(
          wx + Math.cos(a) * r,
          wy + Math.sin(a) * r,
          wx + Math.cos(b) * r,
          wy + Math.sin(b) * r,
          ECLIPSE[i % 4 ? 2 : 4],
          0.8,
        );
      }
      glow(wx, wy, r + 4, ECLIPSE[2], 0.2);
    },
    draw() {
      const [wx, wy] = enemyCenter(ward);
      const [kx, ky] = enemyCenter(keeper);
      place();
      const n = 10;
      for (let i = 0; i < n; i++) {
        const u0 = i / n;
        const u1 = (i + 0.5) / n;
        const sag = (u: number) => Math.sin(u * Math.PI) * 6;
        hairline(
          kx + (wx - kx) * u0,
          ky + (wy - ky) * u0 + sag(u0),
          kx + (wx - kx) * u1,
          ky + (wy - ky) * u1 + sag(u1),
          ECLIPSE[(i + Math.floor(t * 10)) % 3 ? 3 : 5],
          0.7,
        );
      }
    },
  };
}
