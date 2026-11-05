import { EMBER } from "../../../../constants/characters/ysra/look";
import { ENEMY_COLORS as EC, SPARKS } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { arc, chevron, fill, sparkle, speedLines } from "../parts";
import { brace, ember, floor, foe, glaive, heart, seg, vaultArc, YC } from "./parts";

/** Bastion path icons: the brace, the parry, the vault and the weight behind them */
export const BASTION_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** the glaive planted upright on the floor, a brace held out in front */
  s_stance: (s) => {
    floor(s, 1, 15, 15);
    glaive(s, 5, 15, 5, 1);
    brace(s, 5, 9, 8);
  },
  /** a claw caught on the haft in a burst of embers */
  s_parry: (s) => {
    glaive(s, 2, 14, 14, 2);
    fill(s, () => {
      s.stroke(14, 14, 9.5, 9.5, 0.6, EC.claw);
      s.stroke(15, 11, 11, 9, 0.6, EC.claw);
      s.set(12, 12, EC.eye);
    });
    sparkle(s, 8, 8, 3, EMBER[5]);
    ember(s, 4, 7, 4);
  },
  /** a blow turned back into a thrust: a hook round to the front, and the glaive driving through */
  s_counter: (s) => {
    arc(s, 7, 6, 4, Math.PI * 0.5, Math.PI * 1.9, EMBER[4]);
    chevron(s, 11, 4, 1, -0.2, 2, EMBER[5]);
    glaive(s, 1, 12, 15, 12);
    foe(s, 13, 8, 2);
  },
  /** over the top in a vault, then the glaive driven down where she lands */
  s_vaultStrike: (s) => {
    vaultArc(s, 1, 11, 14, 11);
    floor(s, 1, 15, 15);
    glaive(s, 12, 2, 12, 14);
    fill(s, () => {
      seg(s, 9, 14, 8, 12, EMBER[5]);
      seg(s, 15, 14, 15.5, 12, EMBER[5]);
    });
  },
  /** a charge: the glaive levelled ahead, speed lines and a foe thrown aside */
  s_warpath: (s) => {
    speedLines(s, 6, [6, 9, 12], 5, EMBER[3]);
    glaive(s, 4, 10, 15, 10);
    foe(s, 12, 4, 2.6, 1);
  },
  /** the butt struck on the floor, a wave running out both ways */
  s_quake: (s) => {
    glaive(s, 8, 12, 8, 1);
    floor(s, 0, 16, 14);
    arc(s, 8, 13, 4, Math.PI * 1.1, Math.PI * 1.4, EMBER[4]);
    arc(s, 8, 13, 4, Math.PI * 1.6, Math.PI * 1.9, EMBER[4]);
    arc(s, 8, 13, 7, Math.PI * 1.08, Math.PI * 1.3, EMBER[3]);
    arc(s, 8, 13, 7, Math.PI * 1.7, Math.PI * 1.92, EMBER[3]);
  },
  /** a tall crimson tower shield with the glaive crossed behind */
  s_bulwark: (s) => {
    glaive(s, 1, 15, 15, 1);
    fill(s, () =>
      s.poly(
        [
          [4, 3],
          [12, 3],
          [12, 11],
          [8, 15],
          [4, 11],
        ],
        YC.coat,
      ),
    );
    fill(s, () => {
      seg(s, 4.5, 3.5, 11.5, 3.5, YC.trim);
      seg(s, 8, 4, 8, 13, YC.trim);
      s.set(5, 5, YC.coatLight);
      s.dot(8, 8, 1, EMBER[4]);
    });
  },
  /** a cracked heart still burning */
  s_unbroken: (s) => {
    heart(s, 8, 9, 5.5, SPARKS.blood[2], SPARKS.blood[1]);
    fill(s, () => {
      seg(s, 8, 5, 7, 8, SPARKS.blood[3]);
      seg(s, 7, 8, 9, 10, SPARKS.blood[3]);
    });
    ember(s, 8, 8, 6);
  },
  /** Phoenix Dive: a bird of fire stooping onto the floor */
  s_ult: (s) => {
    floor(s, 1, 15, 15, EMBER[2]);
    fill(s, () => {
      s.poly(
        [
          [8, 13],
          [1, 3],
          [4, 3],
          [7, 6],
        ],
        EMBER[3],
      );
      s.poly(
        [
          [8, 13],
          [15, 3],
          [12, 3],
          [9, 6],
        ],
        EMBER[3],
      );
    });
    fill(s, () => {
      s.stroke(8, 1, 8, 6, 0.5, EMBER[4]);
      seg(s, 6, 1, 7, 5, EMBER[4]);
      seg(s, 10, 1, 9, 5, EMBER[4]);
    });
    fill(s, () => {
      s.poly(
        [
          [8, 6],
          [9.6, 10],
          [8, 14],
          [6.4, 10],
        ],
        EMBER[5],
      );
      s.set(8, 13, WHITE);
      for (const x of [2, 5, 11, 14]) s.set(x, 4, EMBER[5]);
    });
  },
};
