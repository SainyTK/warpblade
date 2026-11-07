import { PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { TAU } from "../../../../utils/math";
import { evolvedStar } from "../evolution";
import { fill, gem } from "../parts";

const C = PAL.crystal;

/** a tilted orbit around (cx, cy) as a ring of fine dots */
function orbit(s: SpriteCanvas, cx: number, cy: number, rx: number, ry: number, bright = 0): void {
  fill(s, () => {
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * TAU;
      s.dot(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, 0.55, Math.sin(a) > 0 ? C[3 + bright] : C[2 + bright]);
    }
  });
}

/** Orbit Shards: two crystal shards on a tilted orbit, the near one large; Shard Halo: a bright ring of five */
export const SHARDS_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  relic_shards: (s) => {
    gem(s, 8 + Math.cos(-0.7) * 6, 8.5 + Math.sin(-0.7) * 4.5, 1.5, 2.5);
    orbit(s, 8, 8.5, 6, 4.5);
    gem(s, 8 + Math.cos(2.3) * 6, 8.5 + Math.sin(2.3) * 4.5, 2.5, 4);
  },
  relic_shards_evo: (s) => {
    orbit(s, 7.5, 9, 6, 5, 1);
    for (const a of [0.3, 1.9, 3.4, 4.6]) {
      const near = Math.sin(a) > 0;
      gem(s, 7.5 + Math.cos(a) * 6, 9 + Math.sin(a) * 5, near ? 2 : 1.6, near ? 3.2 : 2.6);
    }
    fill(s, () => s.dot(7.5, 9, 1, WHITE));
    evolvedStar(s);
  },
};
