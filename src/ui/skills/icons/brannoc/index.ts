import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { arc, chevron, crescent, fill, ring, sparkle, speedLines } from "../parts";
import {
  axe,
  BC,
  blood,
  burst,
  claws,
  crack,
  diver,
  fist,
  floor,
  GOLD,
  GOLD_DARK,
  GOLD_LIGHT,
  handAxe,
  helm,
  hide,
  hpBar,
  palm,
  pillar,
  R,
  rageDisc,
  raven,
  roar,
  scar,
  seg,
  shield,
  shieldHalf,
  slash,
  smallHelm,
  smallRaven,
  smallWolf,
  wolf,
} from "./parts";

/** each drawer with his disc behind it, its rim gold for an evolution */
const withDisc = (icons: Record<string, (s: SpriteCanvas) => void>): Record<string, (s: SpriteCanvas) => void> =>
  Object.fromEntries(
    Object.entries(icons).map(([id, draw]) => [
      id,
      (s: SpriteCanvas) => {
        rageDisc(s, id.endsWith("_evo"));
        draw(s);
      },
    ]),
  );

/** Brannoc's icons: his own sources, his 20 skills and their evolutions (`<id>_evo`, the stronger form lit gold) */
export const BRANNOC_ICONS: Record<string, (s: SpriteCanvas) => void> = withDisc({
  /** his axe string: the great axe raised across the disc */
  b_axe: (s) => axe(s, 2, 15, 7, 4),
  /** his abilities: Frenzy, a fist raised with the axe's cut across the forearm, a red burst behind it */
  b_frenzy: (s) => {
    burst(s, 8, 5, 7, R[3], 10);
    fist(s, 3, 3);
    slash(s, 4, 13, 11, 10, R[3], false);
  },
  /** his special Berserk: two great axes crossed in a crimson ring */
  b_berserk: (s) => {
    ring(s, 8, 8.5, 6.2, R[3], 0.6);
    axe(s, 13, 15, 6, 4, { bloody: true, side: -1, size: 0.7 });
    axe(s, 3, 15, 10, 4, { bloody: true, size: 0.7 });
  },
  /** Red Edge: the axe raised, its edge running red and dripping */
  b_redEdge: (s) => {
    axe(s, 2, 14, 6, 4, { bloody: true, size: 0.85 });
    blood(s, 10.5, 14, 0.9);
    blood(s, 13.5, 12.5, 0.9);
  },
  /** Crimson Moon: the gold axe before a crimson moon */
  b_redEdge_evo: (s) => {
    crescent(s, 8, 8.5, 5.5, Math.PI * 0.5, Math.PI * 1.5, R[3]);
    arc(s, 8, 8.5, 5.5, Math.PI * 0.75, Math.PI * 1.25, R[5], 0.4);
    axe(s, 5, 15, 9, 5, { gold: true, bloody: true, size: 0.75 });
  },
  /** Heavy Hew: the axe come down and bitten into the floor, cracks running out from it */
  b_heavyHew: (s) => {
    axe(s, 1, 3, 8, 6, { size: 0.9 });
    fill(s, () => {
      s.block(1, 12, R[1], 15, 4);
      seg(s, 1, 12, 15, 12, R[3]);
    });
    crack(s, [
      [2, 15],
      [5, 13],
      [8, 14],
    ]);
    crack(s, [
      [11, 14],
      [13, 13],
      [15, 15],
    ]);
  },
  /** Earthsplitter: the gold axe in the floor, spikes erupting along the crack it sends off */
  b_heavyHew_evo: (s) => {
    axe(s, -1, 3, 5, 6, { gold: true, size: 0.8 });
    fill(s, () => {
      for (const [x, h] of [
        [10, 6],
        [14, 4],
      ] as const) {
        s.poly(
          [
            [x - 1.8, 12],
            [x + 1.8, 12],
            [x, 12 - h],
          ],
          R[4],
        );
        seg(s, x - 0.5, 12 - h + 1, x - 1, 11, R[5]);
      }
    });
    fill(s, () => {
      s.block(1, 12, R[1], 15, 4);
      seg(s, 1, 12, 15, 12, GOLD_DARK);
    });
    crack(
      s,
      [
        [5, 14],
        [8, 13],
        [11, 14],
        [15, 13],
      ],
      R[0],
      GOLD_LIGHT,
    );
  },
  /** Reaver: a hooked sweep curling round behind the axe */
  b_reaver: (s) => {
    crescent(s, 8, 8.5, 5.3, Math.PI * 0.35, Math.PI * 1.5, R[3]);
    chevron(s, 9, 3.2, 1, 0, 2, R[4]);
    axe(s, 9, 15, 11, 5, { size: 0.7 });
  },
  /** Reaping Hook: the hooked sweep in gold, dragging foes in toward the axe */
  b_reaver_evo: (s) => {
    crescent(s, 8, 8.5, 5.5, Math.PI * 0.3, Math.PI * 1.65, GOLD);
    chevron(s, 5, 9, 1, 0, 1.6, R[4]);
    chevron(s, 8, 9, 1, 0, 1.6, R[3]);
    axe(s, 9, 15, 11, 5, { gold: true, size: 0.7 });
  },
  /** Executioner: the axe raised over a foe's HP bar run down to a red sliver */
  b_executioner: (s) => {
    hpBar(s, 2, 11, 12, 2);
    axe(s, 15, 2, 7, 3, { side: -1, size: 0.75 });
  },
  /** Headsman: the gold axe come down through the bar, splitting it */
  b_executioner_evo: (s) => {
    hpBar(s, 1, 11, 5, 2, true);
    hpBar(s, 11, 11, 4, 0, true);
    axe(s, 15, 4, 7, 7, { gold: true, bloody: true, side: -1, size: 0.75 });
  },
  /** Spinning Reap: a ring of crimson spun round the axe */
  b_spinningReap: (s) => {
    arc(s, 8, 8.5, 6, -0.6, Math.PI * 1.25, R[3], 0.7);
    chevron(s, 13, 5, -0.4, -0.9, 2, R[4]);
    axe(s, 4, 13, 7, 5, { size: 0.75 });
  },
  /** Red Tempest: a whirl of crimson and gold, ring inside ring */
  b_spinningReap_evo: (s) => {
    arc(s, 8, 8.5, 6.2, 0, Math.PI * 1.6, R[3], 0.7);
    arc(s, 8, 8.5, 4.2, Math.PI, Math.PI * 2.7, GOLD, 0.55);
    arc(s, 8, 8.5, 2.2, 0, Math.PI * 1.4, R[4], 0.45);
  },
  /** Sunder: a round shield split down its middle, a stun star over it */
  b_sunder: (s) => {
    shieldHalf(s, 7, 11, 4.2, -1);
    shieldHalf(s, 9, 10, 4.2, 1);
    sparkle(s, 8, 3.5, 2.2, R[4]);
  },
  /** Shatterblow: the stunned foe's shield burst into shards round a gold star */
  b_sunder_evo: (s) => {
    burst(s, 8, 8.5, 6.5, R[4], 8);
    shield(s, 8, 8.5, 3.5);
    sparkle(s, 8, 8.5, 2.5, GOLD_LIGHT);
  },
  /** Long Hunt: the axe flying forward on a long lunge, speed lines behind */
  b_hunt: (s) => {
    speedLines(s, 6, [5, 8, 11], 5, R[4]);
    axe(s, 3, 11, 11, 6, { side: -1, size: 0.8 });
  },
  /** Wolf's Road: a red wolf running down the lane, a gold road under it */
  b_hunt_evo: (s) => {
    speedLines(s, 4, [5, 8, 11], 3, GOLD_LIGHT);
    wolf(s, 3, 2, true);
    floor(s, 1, 15, 13, GOLD);
  },
  /** Headlong: his body diving head first at 45 degrees, speed lines behind and a burst where he strikes */
  b_headlong: (s) => {
    speedLines(s, 6, [8, 10], 3, R[4]);
    diver(s, 2, 2);
    chevron(s, 14, 6, 0.7, -0.7, 2, R[4]);
    chevron(s, 6, 14, -0.7, 0.7, 2, R[4]);
  },
  /** Juggernaut: the gold diver driving through a row of foes, all of them thrown */
  b_headlong_evo: (s) => {
    fill(s, () => {
      for (const [x, y] of [
        [2, 13],
        [13, 3],
        [14, 9],
      ] as const)
        s.block(x - 1, y - 1, R[3], 2, 3);
    });
    diver(s, 2, 2, true);
    burst(s, 14, 14, 2.5, GOLD_LIGHT, 5, -0.6);
  },
  /** Blood Trail: drops left in a line along the floor, growing to the fresh one */
  b_bloodTrail: (s) => {
    floor(s, 1, 15, 13);
    blood(s, 3, 11, 0.8);
    blood(s, 7, 10.5, 1.2);
    blood(s, 12, 9.5, 1.8);
  },
  /** River of Red: the trail run into a river along the floor, its whole length bursting */
  b_bloodTrail_evo: (s) => {
    fill(s, () => {
      s.poly(
        [
          [1, 12],
          [15, 10],
          [15, 14],
          [1, 15],
        ],
        R[3],
      );
      seg(s, 1, 12, 15, 10, R[5]);
    });
    blood(s, 4, 8, 1);
    blood(s, 11, 6, 1);
    sparkle(s, 7, 5, 1.5, GOLD_LIGHT);
    sparkle(s, 13, 2.5, 1.5, GOLD_LIGHT);
    sparkle(s, 2, 4, 1, GOLD);
  },
  /** Blood Geyser: a pillar of blood bursting up out of the floor */
  b_geyser: (s) => {
    pillar(s, 8, 3, 3);
    floor(s, 1, 15, 14);
  },
  /** Blood Fountain: three pillars of blood, the middle tallest, gold thrown off their crowns */
  b_geyser_evo: (s) => {
    pillar(s, 3, 7, 2, true);
    pillar(s, 13, 7, 2, true);
    pillar(s, 8, 2, 3, true);
    floor(s, 1, 15, 14, GOLD_DARK);
  },
  /** Hurled Axe: a hand axe spinning through the air, arcs of its turn behind it */
  b_axeThrow: (s) => {
    arc(s, 8, 8.5, 6.2, Math.PI * 0.7, Math.PI * 1.3, R[4], 0.45);
    arc(s, 8, 8.5, 6.2, -0.3, Math.PI * 0.3, R[4], 0.45);
    handAxe(s, 7, 10, -1.1, 11, false, 0.8);
  },
  /** Twin Fangs: two gold hand axes orbiting him, each chasing the other round the ring */
  b_axeThrow_evo: (s) => {
    arc(s, 8, 8.5, 5.8, Math.PI * 0.7, Math.PI * 1.25, R[4], 0.45);
    arc(s, 8, 8.5, 5.8, Math.PI * 1.7, Math.PI * 2.25, R[4], 0.45);
    axe(s, 2, 5, 9, 6.5, { gold: true, size: 0.6, side: -1 });
    axe(s, 14, 12.5, 7, 11, { gold: true, size: 0.6, side: -1 });
  },
  /** Blood Pact: an open palm cut across, a drop falling from it */
  b_pact: (s) => {
    palm(s, 2, 3);
    fill(s, () => seg(s, 3, 10, 9, 6, R[3]));
    blood(s, 12, 13, 1.1);
  },
  /** Oathbound: the cut palm sealed with a gold oath ring, the drop lit gold */
  b_pact_evo: (s) => {
    palm(s, 2, 3, true);
    fill(s, () => seg(s, 3, 10, 9, 6, R[3]));
    ring(s, 6, 8.5, 1.8, GOLD_LIGHT, 0.4);
    blood(s, 12, 13, 1.1, R[3], GOLD_LIGHT);
  },
  /** Open Wounds: three clean slashes side by side, dripping */
  b_bleed: (s) => {
    slash(s, 6, 2, 2, 9);
    slash(s, 10, 2, 6, 9);
    slash(s, 14, 3, 10, 10);
  },
  /** Bleed Dry: the wounds drawn into one great drop, cut through by a gold edge */
  b_bleed_evo: (s) => {
    blood(s, 8, 10, 3.5);
    fill(s, () => {
      seg(s, 2, 4, 13, 15, GOLD_LIGHT);
      seg(s, 3, 4, 14, 15, GOLD);
    });
    blood(s, 3, 12, 0.8);
    blood(s, 13, 6, 0.8);
  },
  /** Rend: ragged claw tears raked down through the flesh */
  b_rend: (s) => claws(s, [3, 7, 11], 3, 13),
  /** Flay: the tears torn wide open under the gold axe */
  b_rend_evo: (s) => {
    claws(s, [2, 6, 10], 5, 15);
    axe(s, 15, 1, 8, 2, { gold: true, side: -1, size: 0.65 });
  },
  /** Haemorrhage: a drop of blood with a lit fuse */
  b_hemorrhage: (s) => {
    blood(s, 7, 11, 3.2);
    fill(s, () => {
      seg(s, 7, 4, 9, 3, BC.trim);
      seg(s, 9, 3, 11, 4, BC.trim);
    });
    burst(s, 12, 3.5, 2.2, R[5], 6);
    fill(s, () => s.set(12, 3.5, WHITE));
  },
  /** Red Bloom: the drop burst open into a bloom, the burst chaining on to a second mark */
  b_hemorrhage_evo: (s) => {
    burst(s, 6, 10, 5, R[4], 8);
    fill(s, () => s.dot(6, 10, 2.2, R[3]));
    fill(s, () => s.dot(6, 10, 1, GOLD_LIGHT));
    fill(s, () => seg(s, 8, 7, 11, 5, GOLD));
    blood(s, 12, 6, 1.3, R[3], GOLD_LIGHT);
  },
  /** Blood Wolves: a red wolf's head, its jaws open */
  b_wolves: (s) => wolf(s, 2, 4),
  /** Blood Pack: three red wolves' heads, the pack */
  b_wolves_evo: (s) => {
    smallWolf(s, 2, 3, true);
    smallWolf(s, 7, 6, true);
    smallWolf(s, 1, 9, true);
  },
  /** Forebear: a forebear's ghostly horned helm */
  b_ancestor: (s) => helm(s, 3, 3),
  /** Host of Forebears: three gold ghost helms standing together */
  b_ancestor_evo: (s) => {
    smallHelm(s, 1, 8, true);
    smallHelm(s, 9, 8, true);
    smallHelm(s, 5, 3, true);
  },
  /** Carrion Ravens: two ravens diving */
  b_ravens: (s) => {
    raven(s, 1, 2);
    smallRaven(s, 8, 10);
  },
  /** Carrion Storm: ravens circling round him in a gold ring */
  b_ravens_evo: (s) => {
    ring(s, 8, 8.5, 5.5, GOLD, 0.45);
    smallRaven(s, 3, 1, true);
    smallRaven(s, 9, 6, true);
    smallRaven(s, 2, 10, true);
  },
  /** Scarred Hide: a hide crossed with scars stitched in bone */
  b_scarred: (s) => {
    hide(s, 8, 8.5);
    scar(s, 4, 5, 11, 12, 3, BC.trim);
    scar(s, 11, 5, 8, 8, 1, BC.trim);
  },
  /** Thousand Scars: the hide crossed every way with scars, stitched in gold */
  b_scarred_evo: (s) => {
    hide(s, 8, 8.5, true);
    scar(s, 4, 5, 12, 12, 3, GOLD_LIGHT);
    scar(s, 12, 5, 4, 12, 3, GOLD_LIGHT);
    scar(s, 6, 4, 9, 4, 1, GOLD_LIGHT);
    scar(s, 6, 13, 10, 13, 1, GOLD_LIGHT);
  },
  /** Unending Rage: his face roaring in a ring of crimson fire */
  b_unending: (s) => {
    ring(s, 8, 8.5, 6.2, R[3], 0.6);
    burst(s, 8, 8.5, 7.6, R[4], 12, 0);
    roar(s, 3, 3);
  },
  /** World Ender: the gold axe come down and the floor split from one edge of the stage to the other */
  b_unending_evo: (s) => {
    axe(s, 15, 1, 7, 4, { gold: true, side: -1, size: 0.75 });
    fill(s, () => s.block(0, 11, R[1], 16, 5));
    crack(
      s,
      [
        [0, 13],
        [3, 15],
        [6, 12],
        [9, 15],
        [12, 12],
        [15, 14],
      ],
      R[3],
      R[5],
    );
  },
});
