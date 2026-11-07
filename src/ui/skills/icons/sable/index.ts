import { JADE } from "../../../../constants/characters/sable/look";
import { COIN_GOLD } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { hex, WHITE } from "../../../../utils/color";
import { arc, drop, figure, fill, ring, sparkle, speedLines } from "../parts";
import { foe, seg } from "../ysra/parts";
import { bolt, boot, crossbow, decoy, hawk, hound, keg, net, SC, snare } from "./parts";

const VENOM = hex("#9ad84a");
const VENOM_LIGHT = hex("#e4ffb0");
const BLOOD = hex("#b02a2a");
const BLOOD_LIGHT = hex("#ff7a6a");
const FIRE = hex("#ffb04a");
const GOLD = COIN_GOLD[4];

/** the floor line most icons stand on */
const ground = (s: SpriteCanvas, y = 15) => fill(s, () => seg(s, 0, y, 15, y, SC.trim));

/** Sable's skill icons and their evolved forms (`<id>_evo`) */
export const SABLE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** one bolt through two foes */
  s_pierce: (s) => {
    foe(s, 5, 8, 2.6);
    foe(s, 10, 8, 2.6);
    bolt(s, 0, 8, 15, 8, true);
  },
  /** a rail of light through three foes */
  s_pierce_evo: (s) => {
    fill(s, () => s.stroke(0, 8, 15, 8, 0.9, JADE[4]));
    for (const x of [3, 8, 13]) foe(s, x, 8, 2.2);
    bolt(s, 0, 8, 15, 8, true);
    sparkle(s, 14, 8, 2, GOLD);
  },
  /** three bolts in a fan */
  s_scatter: (s) => {
    bolt(s, 1, 8, 14, 2, true);
    bolt(s, 1, 8, 15, 8, true);
    bolt(s, 1, 8, 14, 14, true);
  },
  /** a hail of bolts slanting down onto the floor */
  s_scatter_evo: (s) => {
    ground(s);
    for (const x of [1, 5, 9, 13]) bolt(s, x - 2, 2 + (x % 3), x + 2, 12 + (x % 2), true);
    sparkle(s, 13, 3, 2, GOLD);
  },
  /** a bolt bouncing from one foe to another */
  s_ricochet: (s) => {
    foe(s, 4, 11, 2.6);
    foe(s, 12, 5, 2.6);
    bolt(s, 0, 4, 4, 9);
    bolt(s, 5, 10, 11, 6, true);
    sparkle(s, 4.5, 9.5, 2, JADE[5]);
  },
  /** a bolt splintering into many off a foe */
  s_ricochet_evo: (s) => {
    foe(s, 6, 9, 3);
    bolt(s, 7, 8, 14, 2, true);
    bolt(s, 7, 9, 15, 9, true);
    bolt(s, 7, 10, 14, 15, true);
    bolt(s, 5, 8, 1, 2, true);
    sparkle(s, 6, 9, 2, GOLD);
  },
  /** a heavy bolt bursting on a foe */
  s_breach: (s) => {
    foe(s, 11, 8, 3);
    fill(s, () => s.stroke(0, 8, 8, 8, 1.1, SC.hilt));
    bolt(s, 0, 8, 9, 8, true);
    ring(s, 11, 8, 5, JADE[4]);
  },
  /** foes pinned to the floor along a line */
  s_breach_evo: (s) => {
    ground(s, 14);
    for (const x of [4, 9, 14]) {
      foe(s, x, 11, 2.4);
      bolt(s, x - 2, 5, x, 12, true);
    }
    sparkle(s, 2, 3, 2, GOLD);
  },
  /** a long bolt with a crosshair at its end */
  s_longshot: (s) => {
    bolt(s, 0, 12, 11, 6, true);
    ring(s, 12, 5, 3, JADE[5]);
    fill(s, () => s.set(12, 5, WHITE));
  },
  /** a bolt to the horizon, splitting at the end */
  s_longshot_evo: (s) => {
    fill(s, () => seg(s, 0, 13, 15, 13, SC.trim));
    bolt(s, 0, 10, 10, 8, true);
    bolt(s, 10, 8, 15, 4, true);
    bolt(s, 10, 8, 15, 11, true);
    sparkle(s, 10, 8, 2, GOLD);
  },
  /** the reload's bright window on a bar */
  s_rhythm: (s) => {
    fill(s, () =>
      s.poly(
        [
          [1, 6],
          [15, 6],
          [15, 10],
          [1, 10],
        ],
        SC.coatDeep,
      ),
    );
    fill(s, () => {
      seg(s, 7, 7, 10, 7, JADE[5]);
      seg(s, 7, 8, 10, 8, JADE[4]);
      seg(s, 7, 9, 10, 9, JADE[4]);
    });
    fill(s, () => seg(s, 8, 4, 8, 12, WHITE));
  },
  /** a clock face of primed bolts */
  s_rhythm_evo: (s) => {
    ring(s, 8, 8, 6, JADE[4]);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      fill(s, () => s.set(Math.round(8 + Math.cos(a) * 6), Math.round(8 + Math.sin(a) * 6), WHITE));
    }
    bolt(s, 8, 8, 8, 3, true);
    sparkle(s, 8, 8, 2, GOLD);
  },
  /** the boot driving a foe off */
  s_heavyBoot: (s) => {
    boot(s, 1, 9);
    foe(s, 12, 8, 3);
    speedLines(s, 15, [3, 13], 3, WHITE);
  },
  /** the boot with a shockwave ring */
  s_heavyBoot_evo: (s) => {
    ring(s, 9, 9, 6, JADE[4]);
    ring(s, 9, 9, 3.5, JADE[5]);
    boot(s, 2, 10);
    sparkle(s, 13, 3, 2, GOLD);
  },
  /** a hop back over three bolts flying ahead */
  s_hopVolley: (s) => {
    arc(s, 6, 9, 5, Math.PI, Math.PI * 2, JADE[4]);
    bolt(s, 6, 9, 15, 5, true);
    bolt(s, 6, 10, 15, 10, true);
    bolt(s, 6, 11, 15, 15, true);
  },
  /** a ring of bolts around a turning figure */
  s_hopVolley_evo: (s) => {
    figure(s, 8, 11, SC.coatLight, SC.coatDark);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      bolt(s, 8 + Math.cos(a) * 4, 7 + Math.sin(a) * 4, 8 + Math.cos(a) * 7, 7 + Math.sin(a) * 7, true);
    }
    sparkle(s, 14, 2, 2, GOLD);
  },
  /** a low slide under a foe thrown up */
  s_slideKick: (s) => {
    ground(s);
    boot(s, 3, 13);
    foe(s, 12, 6, 3);
    speedLines(s, 3, [11, 13], 3, JADE[4]);
  },
  /** a foe tangled in a net in the air over the slide */
  s_slideKick_evo: (s) => {
    ground(s);
    boot(s, 2, 13);
    foe(s, 11, 5, 3);
    net(s, 7, 15, 9, 8);
    sparkle(s, 2, 3, 2, GOLD);
  },
  /** a feather over a jump arc with bolts slanting down */
  s_featherdraw: (s) => {
    arc(s, 8, 12, 6, Math.PI, Math.PI * 2, SC.trim);
    bolt(s, 6, 4, 13, 10, true);
    bolt(s, 9, 4, 15, 8, true);
    fill(s, () => s.stroke(2, 6, 5, 2, 0.6, SC.trimLight));
  },
  /** a hovering figure with a hawk above */
  s_featherdraw_evo: (s) => {
    figure(s, 6, 12, SC.coatLight, SC.coatDark);
    hawk(s, 11, 3);
    bolt(s, 7, 7, 14, 12, true);
    sparkle(s, 2, 2, 2, GOLD);
  },
  /** a net thrown over a foe */
  s_net: (s) => {
    ground(s);
    foe(s, 8, 11, 3);
    net(s, 2, 14, 14, 9);
  },
  /** a burning net */
  s_net_evo: (s) => {
    ground(s);
    foe(s, 8, 11, 3);
    net(s, 2, 14, 14, 9);
    fill(s, () => {
      s.set(4, 7, FIRE);
      s.set(11, 6, FIRE);
      s.set(8, 4, WHITE);
    });
    sparkle(s, 14, 2, 2, GOLD);
  },
  /** a straw decoy luring a foe */
  s_decoy: (s) => {
    ground(s);
    decoy(s, 6, 15);
    foe(s, 13, 12, 2.4, -1);
    speedLines(s, 15, [9], 2, JADE[4]);
  },
  /** the decoy in a ring of snares */
  s_decoy_evo: (s) => {
    ground(s);
    decoy(s, 8, 14);
    snare(s, 2, 14);
    snare(s, 14, 14);
    sparkle(s, 14, 3, 2, GOLD);
  },
  /** a keg with a bolt flying at it */
  s_keg: (s) => {
    ground(s);
    keg(s, 11, 15);
    bolt(s, 0, 9, 7, 11, true);
    fill(s, () => s.set(12, 7, FIRE));
  },
  /** a keg in a hood, bursting */
  s_keg_evo: (s) => {
    ground(s);
    keg(s, 8, 15);
    fill(s, () =>
      s.poly(
        [
          [5, 8],
          [11, 8],
          [8, 3],
        ],
        SC.coat,
      ),
    );
    sparkle(s, 3, 4, 2, FIRE);
    sparkle(s, 13, 5, 2, GOLD);
  },
  /** a dripping bolt head */
  s_venom: (s) => {
    bolt(s, 0, 4, 11, 9, true);
    drop(s, 11, 13, 1.6, VENOM, VENOM_LIGHT);
  },
  /** a poison cloud over a fallen foe */
  s_venom_evo: (s) => {
    foe(s, 8, 11, 3);
    for (const [x, y] of [
      [4, 6],
      [8, 4],
      [12, 6],
      [6, 8],
      [10, 8],
    ])
      fill(s, () => s.dot(x, y, 1.6, VENOM));
    sparkle(s, 14, 2, 2, GOLD);
  },
  /** barbed jaws biting, a drop of blood */
  s_barbed: (s) => {
    snare(s, 8, 13, SC.scarf);
    fill(s, () => {
      seg(s, 2, 13, 8, 5, SC.steelLight);
      seg(s, 14, 13, 8, 5, SC.steelLight);
    });
    drop(s, 8, 9, 1.4, BLOOD, BLOOD_LIGHT);
  },
  /** a bramble net over a snare */
  s_barbed_evo: (s) => {
    snare(s, 8, 14, SC.scarf);
    fill(s, () => {
      for (let x = 2; x <= 12; x += 5) {
        seg(s, x, 13, x + 2, 5, hex("#5c3a2a"));
        seg(s, x + 2, 5, x + 4, 13, hex("#5c3a2a"));
      }
    });
    drop(s, 8, 9, 1.4, BLOOD, BLOOD_LIGHT);
    sparkle(s, 14, 2, 2, GOLD);
  },
  /** a foe with bolts lodged in it */
  s_lodged: (s) => {
    foe(s, 8, 9, 4);
    bolt(s, 2, 4, 6, 8);
    bolt(s, 14, 5, 10, 8);
    bolt(s, 3, 14, 7, 11);
  },
  /** bolts bursting out of a foe in every direction */
  s_lodged_evo: (s) => {
    foe(s, 8, 8, 3);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + 0.3;
      bolt(s, 8 + Math.cos(a) * 4, 8 + Math.sin(a) * 4, 8 + Math.cos(a) * 7.5, 8 + Math.sin(a) * 7.5, true);
    }
    sparkle(s, 14, 2, 2, GOLD);
  },
  /** a hawk diving on a foe */
  s_hawk: (s) => {
    hawk(s, 6, 4);
    foe(s, 11, 12, 3);
    speedLines(s, 9, [7, 9], 2, WHITE);
  },
  /** four hawks circling */
  s_hawk_evo: (s) => {
    for (const [x, y] of [
      [4, 4],
      [12, 4],
      [4, 11],
      [12, 11],
    ])
      hawk(s, x, y);
    drop(s, 8, 9, 1.3, VENOM, VENOM_LIGHT);
    sparkle(s, 8, 2, 2, GOLD);
  },
  /** a hound biting a foe */
  s_hound: (s) => {
    ground(s);
    hound(s, 7, 15);
    foe(s, 13, 11, 2.6);
  },
  /** three hounds and a drop of blood */
  s_hound_evo: (s) => {
    ground(s);
    hound(s, 5, 15);
    hound(s, 11, 11);
    drop(s, 13, 4, 1.4, BLOOD, BLOOD_LIGHT);
    sparkle(s, 2, 3, 2, GOLD);
  },
  /** a pale shade of her shooting */
  s_shade: (s) => {
    figure(s, 5, 14, JADE[4], JADE[3]);
    bolt(s, 7, 8, 15, 8, true);
  },
  /** two shades, back to back */
  s_shade_evo: (s) => {
    figure(s, 5, 14, JADE[4], JADE[3]);
    figure(s, 11, 14, JADE[5], JADE[4]);
    sparkle(s, 8, 3, 2, GOLD);
  },
  /** one heavy bolt across the whole icon with a glint at the eye */
  s_deadeye: (s) => {
    fill(s, () => s.stroke(0, 8, 13, 8, 0.8, JADE[4]));
    bolt(s, 0, 8, 15, 8, true);
    sparkle(s, 12, 8, 3, WHITE);
  },
  /** a crosshair over a heart, bolts from both sides */
  s_deadeye_evo: (s) => {
    ring(s, 8, 8, 5, JADE[4]);
    bolt(s, 0, 8, 6, 8, true);
    bolt(s, 15, 8, 10, 8, true);
    fill(s, () => s.dot(8, 8, 1.4, BLOOD));
    sparkle(s, 8, 2, 2, GOLD);
  },
  /** her base kit on the end of run screen: the crossbow with the string drawn */
  sable_bolts: (s) => {
    crossbow(s, 12, 8);
    bolt(s, 1, 8, 9, 8, true);
  },
  /** an open snare */
  sable_snare: (s) => {
    snare(s, 8, 12);
    arc(s, 8, 12, 5, Math.PI * 1.1, Math.PI * 1.9, JADE[4]);
  },
  /** bolts raining down: Bolt Storm */
  sable_storm: (s) => {
    for (const [x, y] of [
      [2, 1],
      [7, 3],
      [12, 0],
      [5, 8],
      [11, 7],
    ])
      bolt(s, x - 1, y, x + 2, y + 6, true);
    ground(s);
  },
};
