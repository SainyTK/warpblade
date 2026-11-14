import type { SpriteCanvas } from "../../../../engine/sprite";
import { evolvedStar, fill } from "../../../../ui/skills/icons/parts";
import { WHITE } from "../../../../utils/color";
import { CRIMSON } from "../../constants/colors";
import { crack, crest, heavyArc } from "./parts";
import { BRYNN_SKILL_BASE_ICONS as BASE } from "./skills";

/** what each evolution adds over its skill's icon, before the gold star */
const EXTRA: Record<string, (s: SpriteCanvas) => void> = {
  br_heavy: (s) => crack(s, 6, 15),
  br_cleave: (s) => heavyArc(s, 8, 9, 7, -0.5, 0.5, 1),
  br_launch: (s) => crack(s, 2, 15),
  br_slam: (s) => crack(s, 1, 15, CRIMSON[5]),
  br_counter: (s) => fill(s, () => s.stroke(2, 13, 6, 13, 0.6, CRIMSON[5])),
  br_spin: (s) => heavyArc(s, 8, 8, 6, 0, 6.2, 0.4),
  br_crater: (s) => {
    crack(s, 1, 6);
    crack(s, 10, 15);
  },
  br_charge: (s) => crack(s, 1, 9),
  br_arc: (s) => heavyArc(s, 11, 8, 4, 1.8, 4.4, 0.8),
  br_pillars: (s) => crest(s, 15, 12, 2),
  br_cry: (s) => heavyArc(s, 8, 8, 7.5, 0, 6.2, 0.3),
  br_embers: (s) => heavyArc(s, 12, 10, 3, 0, 6.2, 0.5),
  br_fault: (s) => crest(s, 9, 10, 3),
  br_crush: (s) => fill(s, () => s.stroke(3, 12, 13, 12, 0.5, CRIMSON[5])),
  br_falling: (s) =>
    fill(s, () => {
      s.stroke(3, 2, 3, 7, 0.6, CRIMSON[3]);
      s.stroke(13, 4, 13, 9, 0.6, CRIMSON[3]);
    }),
  br_echo: (s) => fill(s, () => s.dot(2, 7, 1.6, CRIMSON[2])),
  br_shard: (s) => heavyArc(s, 8, 9, 6, 0, 6.2, 0.25),
  br_ironskin: (s) => fill(s, () => s.set(10, 8, CRIMSON[5])),
  br_bellows: (s) => fill(s, () => s.block(11, 4, WHITE, 3, 3)),
  br_fall: (s) => heavyArc(s, 8, 10, 4.5, -2.9, 0.4, 1),
};

/** each evolution's icon: its skill's, with what the evolution adds and the gold star */
export const BRYNN_EVOLVED_ICONS: Record<string, (s: SpriteCanvas) => void> = Object.fromEntries(
  Object.entries(BASE).map(([id, draw]) => [
    `${id}_evo`,
    (s: SpriteCanvas) => {
      draw(s);
      EXTRA[id]?.(s);
      evolvedStar(s);
    },
  ]),
);
