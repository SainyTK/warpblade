import { GROUND } from "../../../../constants/stage";
import { glow, hairline, line, place } from "../../../../engine/frame";
import { clampStageX } from "../../../../game/adventure";
import { createRootSpike, type RootStrike } from "../../../../game/enemies/day/rootSpike";
import { fxRng, game, particles } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { WHITE } from "../../../../utils/color";
import { grain } from "../../../../utils/grain";
import { clamp } from "../../../../utils/math";
import { ROOTCALLER_COLORS as C, ROOTCALLER_SPARKS } from "./colors";
import { ROOTCALLER } from "./constants";

const JAG = 1.1;
const PIECE = 4;

function floorCrack(from: number, to: number): Effect {
  let t = 0;
  const run = ROOTCALLER.mark * 0.7;
  return {
    update(dt) {
      t += dt;
      const head = from + (to - from) * clamp(t / run);
      if (t < run && fxRng.chance(dt * 30))
        particles.spawn(PK.EMBER, head, GROUND - 1, 0, -fxRng.range(10, 24), 0.4, { sparks: ROOTCALLER_SPARKS.rift });
      return t < ROOTCALLER.mark + 0.2;
    },
    drawBack() {
      const k = clamp(t / run);
      const fade = 1 - clamp((t - ROOTCALLER.mark) / 0.2);
      const head = from + (to - from) * k;
      const n = Math.max(1, Math.ceil(Math.abs(head - from) / PIECE));
      place();
      let lx = from;
      let ly = GROUND;
      for (let i = 1; i <= n; i++) {
        const x = from + ((head - from) * i) / n;
        const y = GROUND + (i === n ? 0 : (grain(i, from) - 0.5) * 2 * JAG);
        line(lx, ly, x, y, C.crack, 0.8 * fade);
        if (k > 0.5) hairline(lx, ly, x, y, k > 0.9 ? WHITE : C.crackHot, fade);
        lx = x;
        ly = y;
      }
      glow(head, GROUND - 2, 10, C.crack, 0.4 * fade);
    },
    draw() {},
  };
}

export function eruptRoots(staffX: number, targetX: number, damage: number): void {
  const strike: RootStrike = { struck: new Set() };
  const n = ROOTCALLER.spikes;
  game.fx.push(floorCrack(staffX, targetX));
  for (let i = 0; i < n; i++) {
    const x = clampStageX(targetX + (i - (n - 1) / 2) * ROOTCALLER.spread, 6);
    const lean = (i - (n - 1) / 2) * 0.35;
    game.fx.push(createRootSpike(x, ROOTCALLER.mark + i * 0.04, damage, strike, lean));
  }
}
