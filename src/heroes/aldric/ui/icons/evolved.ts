import type { SpriteCanvas } from "../../../../engine/sprite";
import { arc, crescent, evolvedStar, fill, ring, sparkle, speedLines } from "../../../../ui/skills/icons/parts";
import { WHITE } from "../../../../utils/color";
import { DAWN_RAMP as D } from "../../constants/light";
import { beam, dome, floor, foe, kite, lightKnight, steelSword } from "./parts";
import { ALDRIC_SKILL_BASE_ICONS as BASE } from "./skills";

/** each evolved form: the skill's own marks grown */
const EVOLVED: Record<string, (s: SpriteCanvas) => void> = {
  /** Sunblade: the sword with three great waves */
  al_oath_evo: (s) => {
    steelSword(s, 2, 14, 10, 6);
    crescent(s, 9, 9, 4, -1.2, 1.2, D[4]);
    crescent(s, 11, 9, 5.5, -1.2, 1.2, D[5]);
    crescent(s, 13, 9, 7, -1.2, 1.2, D[4]);
  },
  /** Shattering Bash: the shield bursting a branded foe */
  al_breaker_evo: (s) => {
    kite(s, 5, 8, 11);
    foe(s, 12, 9, 2.6);
    ring(s, 12, 9, 4, D[5]);
  },
  /** Retribution: three waves fanning from the shield */
  al_retort_evo: (s) => {
    kite(s, 4, 8, 10);
    for (const y of [4, 8, 12]) crescent(s, 11, y, 3, -1.2, 1.2, D[4]);
  },
  /** Final Verdict: the sword of light in a pillar */
  al_verdict_evo: (s) => {
    beam(s, 8, 14, 2.2);
    steelSword(s, 8, 1, 8, 9);
    foe(s, 8, 12, 2.4);
  },
  /** Dawnbreak: three rings from the blade */
  al_crest_evo: (s) => {
    steelSword(s, 3, 2, 8, 12);
    for (const r of [3, 5.5, 8]) arc(s, 8, 14, r, Math.PI, Math.PI * 2, D[r < 5 ? 5 : 4]);
  },
  /** Phalanx Step: the shield and a ring where it stops */
  al_step_evo: (s) => {
    speedLines(s, 6, [5, 8, 11], 4, D[4]);
    kite(s, 10, 8, 10);
    ring(s, 10, 9, 6.5, D[3]);
  },
  /** Twin Bulwark: a knight beside the thrown sword */
  al_bulwark_evo: (s) => {
    steelSword(s, 2, 4, 12, 4);
    lightKnight(s, 8, 15);
  },
  /** Falling Sun: the shield falling in a pillar */
  al_skyfall_evo: (s) => {
    beam(s, 8, 14, 2);
    kite(s, 8, 7, 8);
    floor(s);
  },
  /** Spear of Morning: a great spear of light */
  al_lance_evo: (s) => {
    fill(s, () => s.stroke(1, 8, 13, 8, 1.6, D[4]));
    fill(s, () => s.stroke(3, 8, 14, 8, 0.6, WHITE));
  },
  /** Absolution: the cross with a burning foe beside it */
  al_mend_evo: (s) => {
    BASE.al_mend(s);
    foe(s, 13, 12, 2);
  },
  /** War Cry: the rings and a full sun */
  al_rally_evo: (s) => {
    BASE.al_rally(s);
    ring(s, 12, 5, 2.4, D[5]);
  },
  /** Solar Brand: brands bursting from a falling foe */
  al_brand_evo: (s) => {
    foe(s, 8, 10, 3.5);
    for (const [x, y] of [
      [3, 4],
      [13, 4],
      [8, 2],
    ])
      ring(s, x, y, 1.6, D[4]);
  },
  /** Atonement: the foe behind the shield bursting */
  al_penance_evo: (s) => {
    kite(s, 5, 8, 11);
    foe(s, 12, 8, 2.6);
    sparkle(s, 12, 8, 3, D[5]);
  },
  /** High Noon: small pillars over the burning floor */
  al_dawn_evo: (s) => {
    beam(s, 5, 13, 0.9);
    beam(s, 11, 13, 0.9);
    fill(s, () => s.stroke(2, 14, 14, 14, 0.8, D[4]));
  },
  /** Honour Guard: two knights */
  al_oathsworn_evo: (s) => {
    lightKnight(s, 4, 15);
    lightKnight(s, 10, 15);
  },
  /** Pride of Dawn: three lions' manes */
  al_lion_evo: (s) => {
    for (const [x, y] of [
      [4, 10],
      [12, 10],
      [8, 5],
    ])
      ring(s, x, y, 2.8, D[4], 0.8);
  },
  /** Sunbird: the falcon trailing fire of light */
  al_falcon_evo: (s) => {
    BASE.al_falcon(s);
    speedLines(s, 6, [11, 13], 4, D[3]);
  },
  /** Unbroken: the sun inside a dome */
  al_resolve_evo: (s) => {
    BASE.al_resolve(s);
    dome(s, 8, 15, 7.5);
  },
  /** Iron Fortress: the shield throwing a lance back */
  al_vow_evo: (s) => {
    kite(s, 5, 8, 12);
    fill(s, () => s.stroke(9, 8, 15, 8, 0.8, D[4]));
  },
  /** Dawn Citadel: a great dome over the floor */
  al_sanctuary_evo: (s) => {
    dome(s, 8, 14, 7.5);
    dome(s, 8, 14, 5);
    kite(s, 8, 11, 5);
  },
};

/** every evolved icon with the gold star drawn last */
export const ALDRIC_EVOLVED_ICONS: Record<string, (s: SpriteCanvas) => void> = Object.fromEntries(
  Object.entries(EVOLVED).map(([id, draw]) => [
    id,
    (s: SpriteCanvas) => {
      draw(s);
      evolvedStar(s);
    },
  ]),
);
