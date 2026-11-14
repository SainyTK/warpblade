import { BASE_HERO_COLORS as HC, PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { arc, arrow, chevron, crescent, fill, ring, sparkle, speedLines } from "../../../../ui/skills/icons/parts";
import { WHITE } from "../../../../utils/color";
import { DAWN_RAMP as D } from "../../constants/light";
import { beam, dome, floor, foe, kite, lightKnight, steelSword } from "./parts";

const MEND = PAL.heal;

/** Aldric's 20 skill icons */
export const ALDRIC_SKILL_BASE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** the sword with a wave of light leaving its edge */
  al_oath: (s) => {
    steelSword(s, 2, 14, 11, 5);
    crescent(s, 10, 9, 5, -1.2, 1.2, D[4]);
  },
  /** the shield driven into a foe, a crack of light between */
  al_breaker: (s) => {
    kite(s, 6, 8, 11);
    foe(s, 12.5, 8, 2.6);
    sparkle(s, 10, 6, 2, D[5]);
  },
  /** the shield, an arrow turning back off it */
  al_retort: (s) => {
    kite(s, 5, 8, 11);
    arrow(s, 15, 4, 10, 7, PAL.shadow[4], 2);
    arrow(s, 10, 10, 15, 13, D[4], 2);
  },
  /** a sword of light falling point first on a foe */
  al_verdict: (s) => {
    foe(s, 8, 12, 2.6);
    steelSword(s, 8, 1, 8, 8);
    sparkle(s, 8, 9, 1.5);
  },
  /** an overhead into the floor, rings running from it */
  al_crest: (s) => {
    steelSword(s, 4, 3, 9, 13);
    arc(s, 9, 14, 4, Math.PI, Math.PI * 2, D[4]);
    arc(s, 9, 14, 6.5, Math.PI, Math.PI * 2, D[3]);
  },
  /** the shield moving fast through a foe */
  al_step: (s) => {
    foe(s, 4, 8, 2.4);
    speedLines(s, 7, [5, 8, 11], 4, D[4]);
    kite(s, 11, 8, 10);
  },
  /** the thrown sword and a shell of light where it lands */
  al_bulwark: (s) => {
    speedLines(s, 4, [5, 7], 3, D[3]);
    steelSword(s, 3, 6, 12, 6);
    arc(s, 11, 11, 4.5, Math.PI, Math.PI * 2, D[5]);
  },
  /** the shield falling point down on the floor */
  al_skyfall: (s) => {
    kite(s, 8, 6, 9);
    fill(s, () => s.stroke(8, 1, 8, 0, 0.4, D[4]));
    arc(s, 8, 14, 6, Math.PI, Math.PI * 2, D[4]);
    floor(s);
  },
  /** a lance of light flying right */
  al_lance: (s) => {
    fill(s, () => s.stroke(2, 8, 12, 8, 0.9, D[4]));
    fill(s, () => s.stroke(5, 8, 14, 8, 0.4, WHITE));
    chevron(s, 15, 8, 1, 0, 3, D[5]);
  },
  /** a green cross of light in a ring */
  al_mend: (s) => {
    ring(s, 8, 8, 6, D[3]);
    fill(s, () => {
      s.stroke(8, 4, 8, 12, 0.9, MEND[3]);
      s.stroke(4, 8, 12, 8, 0.9, MEND[3]);
    });
    sparkle(s, 8, 8, 1.2, MEND[4]);
  },
  /** rings rolling out from a shout */
  al_rally: (s) => {
    arc(s, 4, 8, 4, -1, 1, D[5]);
    arc(s, 4, 8, 7, -0.9, 0.9, D[4]);
    arc(s, 4, 8, 10, -0.8, 0.8, D[3]);
  },
  /** a foe marked with a burning sun */
  al_brand: (s) => {
    foe(s, 7, 9, 4);
    ring(s, 11, 5, 2.2, D[4]);
    fill(s, () => s.set(11, 5, WHITE));
  },
  /** the shield, the foe behind it burning */
  al_penance: (s) => {
    foe(s, 12, 8, 2.8);
    fill(s, () => {
      s.stroke(11, 3, 12, 1, 0.5, D[4]);
      s.stroke(13, 3, 14, 1.5, 0.5, D[3]);
    });
    kite(s, 5, 8, 11);
  },
  /** a pillar's light left on the floor, motes rising */
  al_dawn: (s) => {
    beam(s, 8, 10, 1.2);
    fill(s, () => s.stroke(2, 14, 14, 14, 0.8, D[4]));
    sparkle(s, 4, 11, 1, D[5]);
    sparkle(s, 12, 10, 1, D[5]);
  },
  /** a knight of light, sword raised */
  al_oathsworn: (s) => {
    lightKnight(s, 7, 15);
    sparkle(s, 13, 3, 1.5, D[5]);
  },
  /** a lion's head of light, its mane a ring */
  al_lion: (s) => {
    ring(s, 8, 8, 5, D[3], 1);
    fill(s, () => s.dot(8, 8, 3, D[4]));
    fill(s, () => {
      s.set(7, 7, WHITE);
      s.set(10, 7, WHITE);
    });
  },
  /** a falcon of light with spread wings */
  al_falcon: (s) => {
    fill(s, () => {
      s.stroke(2, 5, 8, 9, 0.6, D[4]);
      s.stroke(14, 5, 8, 9, 0.6, D[4]);
      s.stroke(8, 9, 8, 13, 0.6, D[3]);
    });
    sparkle(s, 8, 9, 1, WHITE);
  },
  /** a sun with its rays, the source of Valor */
  al_resolve: (s) => {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      fill(s, () =>
        s.stroke(8 + Math.cos(a) * 4.5, 8 + Math.sin(a) * 4.5, 8 + Math.cos(a) * 7, 8 + Math.sin(a) * 7, 0.45, D[3]),
      );
    }
    fill(s, () => s.dot(8, 8, 3.4, D[4]));
    sparkle(s, 7, 7, 1, WHITE);
  },
  /** the shield with steel bands crossed over it */
  al_vow: (s) => {
    kite(s, 8, 8, 13);
    fill(s, () => {
      s.stroke(3, 4, 13, 12, 0.5, HC.steel);
      s.stroke(13, 4, 3, 12, 0.5, HC.steel);
    });
  },
  /** the dome of light over the planted shield */
  al_sanctuary: (s) => {
    dome(s, 8, 14, 7);
    kite(s, 8, 11, 6);
  },
};
