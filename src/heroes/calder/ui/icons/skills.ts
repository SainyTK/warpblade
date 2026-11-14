import type { SpriteCanvas } from "../../../../engine/sprite";
import { arc, arrow, ring, speedLines } from "../../../../ui/skills/icons/parts";
import { hex, WHITE } from "../../../../utils/color";
import { PHOSPHOR } from "../../constants/colors";
import { ABILITY_COLOR } from "../../constants/shots";
import { blast, drifter, floor, foe, greenFire, gunSword, ICON, round, tracer } from "./parts";

const SMOKE = hex("#8a9488");
const RUST = hex("#a4522c");

/** Calder's 20 skill icons */
export const CALDER_SKILL_BASE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** the sword's point in a foe, a blast going off in the wound */
  ca_trigger: (s) => {
    gunSword(s, 2, 14, 10, 6);
    foe(s, 12, 5, 3);
    blast(s, 11, 6, 3.5, ICON.hot);
  },
  /** the sword driven into the floor, a shock running both ways */
  ca_breech: (s) => {
    gunSword(s, 8, 3, 8, 13);
    floor(s);
    arrow(s, 7, 13, 1, 13, ICON.green, 2);
    arrow(s, 9, 13, 15, 13, ICON.green, 2);
  },
  /** a blast venting behind a cut */
  ca_vent: (s) => {
    gunSword(s, 7, 12, 14, 5);
    blast(s, 4, 9, 3.5);
    speedLines(s, 0, [7, 11], 2, SMOKE);
  },
  /** the levelled sword firing into a foe at point-blank range */
  ca_pointblank: (s) => {
    gunSword(s, 1, 9, 10, 9);
    foe(s, 13, 9, 2.8);
    blast(s, 11, 9, 2.5, ICON.hot);
  },
  /** the cylinder swung open, rounds dropping in, a ring round it */
  ca_speedload: (s) => {
    ring(s, 8, 8, 6.5, ICON.green);
    round(s, 6, 9);
    round(s, 10, 9);
    s.begin();
    s.dot(8, 7, 2.2, ICON.gun);
    s.set(8, 7, ICON.green);
    s.commit();
  },
  /** a tracer bouncing between three foes */
  ca_ricochet: (s) => {
    foe(s, 3, 12, 2.2);
    foe(s, 8, 4, 2.2);
    foe(s, 13, 12, 2.2);
    tracer(s, 3, 12, 8, 4);
    tracer(s, 8, 4, 13, 12);
  },
  /** a blast behind a figure dodging ahead */
  ca_recoil: (s) => {
    blast(s, 3, 10, 3);
    drifter(s, 9, 14, ICON.gun);
    speedLines(s, 5, [6, 10], 3, ICON.green);
  },
  /** the thrown sword on a green tracer */
  ca_tracer: (s) => {
    tracer(s, 1, 12, 9, 7);
    gunSword(s, 7, 8, 15, 3);
  },
  /** a figure rising on a blast fired down */
  ca_blastjump: (s) => {
    drifter(s, 8, 9, ICON.gun);
    blast(s, 8, 12, 3);
    floor(s);
  },
  /** a shell falling into green fire */
  ca_flare: (s) => {
    greenFire(s, 3, 13, 5);
    round(s, 8, 5, ABILITY_COLOR.flare);
    arc(s, 8, 9, 6, -2.8, -1.6, ICON.greenDark);
  },
  /** two weights on a chain, spinning */
  ca_chainshot: (s) => {
    s.begin();
    s.stroke(3, 4, 13, 12, 0.35, ABILITY_COLOR.chain);
    s.dot(3, 4, 1.8, ABILITY_COLOR.chain);
    s.dot(13, 12, 1.8, ABILITY_COLOR.chain);
    s.commit();
    arc(s, 8, 8, 7, 0.2, 1.4, ICON.green);
    arc(s, 8, 8, 7, 3.3, 4.5, ICON.green);
  },
  /** a charge on the floor with a lit fuse */
  ca_charge: (s) => {
    floor(s);
    s.begin();
    s.block(5, 10, ABILITY_COLOR.charge, 6, 4);
    s.commit();
    s.begin();
    s.stroke(8, 10, 9, 6, 0.3, ICON.grip);
    s.set(9, 5, WHITE);
    s.commit();
  },
  /** shards flying out of a blast */
  ca_shrapnel: (s) => {
    blast(s, 6, 9, 3);
    for (const [x, y] of [
      [12, 4],
      [13, 9],
      [11, 13],
    ])
      arrow(s, 7, 9, x, y, SMOKE, 1.5);
  },
  /** a foe burning green */
  ca_scorch: (s) => {
    greenFire(s, 2, 14, 6);
    foe(s, 8, 8, 3.5);
    greenFire(s, 5, 11, 4);
  },
  /** hot casings flung in an arc */
  ca_brass: (s) => {
    arc(s, 8, 12, 6, -2.9, -0.2, PHOSPHOR[2]);
    round(s, 3, 9, ICON.hot);
    round(s, 8, 6, ICON.hot);
    round(s, 13, 9, ICON.hot);
  },
  /** a barrel on three legs, firing */
  ca_turret: (s) => {
    s.begin();
    s.stroke(8, 9, 4, 14, 0.4, ICON.gunDark);
    s.stroke(8, 9, 12, 14, 0.4, ICON.gunDark);
    s.stroke(8, 9, 8, 14, 0.4, ICON.gunDark);
    s.stroke(5, 8, 12, 8, 0.8, ICON.gun);
    s.commit();
    tracer(s, 12, 8, 15, 8);
  },
  /** a figure of gunsmoke beside Calder's own */
  ca_double: (s) => {
    drifter(s, 5, 15, SMOKE);
    drifter(s, 11, 15, ICON.gun);
    blast(s, 13, 5, 2.2);
  },
  /** a clockwork hound running */
  ca_hound: (s) => {
    s.begin();
    s.block(3, 8, ICON.gun, 9, 3);
    s.block(11, 6, ICON.gun, 3, 3);
    s.block(4, 11, ICON.gunDark, 1, 3);
    s.block(10, 11, ICON.gunDark, 1, 3);
    s.commit();
    s.begin();
    s.set(13, 6, ICON.green);
    s.set(2, 8, ICON.brass);
    s.commit();
  },
  /** a full drum of rounds */
  ca_drum: (s) => {
    s.begin();
    s.dot(8, 8, 6.5, ICON.gun);
    s.commit();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      s.begin();
      s.dot(8 + Math.cos(a) * 4, 8 + Math.sin(a) * 4, 1.1, ICON.brass);
      s.commit();
    }
    s.begin();
    s.dot(8, 8, 1.2, ICON.green);
    s.commit();
  },
  /** a ring of cuts round a hot blast */
  ca_break: (s) => {
    arc(s, 8, 8, 7, -2.6, -0.4, ICON.green);
    arc(s, 8, 8, 7, 0.6, 2.6, ICON.green);
    blast(s, 8, 8, 4, ICON.hot);
    s.begin();
    s.set(2, 13, RUST);
    s.commit();
  },
};
