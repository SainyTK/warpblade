import { COIN_GOLD } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { evolvedStar, ring, sparkle } from "../../../../ui/skills/icons/parts";
import { qi, sage, spirit, swirl } from "./parts";
import { YUN_SKILL_BASE_ICONS } from "./skills";

const GOLD = COIN_GOLD[3];

/** an evolved icon: what the evolution adds, drawn over the skill's own icon, under the gold star of an evolution */
const evolve =
  (id: string, more: (s: SpriteCanvas) => void) =>
  (s: SpriteCanvas): void => {
    YUN_SKILL_BASE_ICONS[id](s);
    more(s);
    evolvedStar(s);
  };

/** the art of each of Yun's evolutions, by `<skill id>_evo` */
export const YUN_EVOLVED_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** Myriad Echo: a second rank of swords */
  yu_echo_evo: evolve("yu_echo", (s) => spirit(s, 6, 13, 15, 13, GOLD)),
  /** Still Water: three waves */
  yu_flow_evo: evolve("yu_flow", (s) => {
    qi(s, 2, 5, 2, GOLD);
    qi(s, 5, 9, 2, GOLD);
  }),
  /** Spring Tide: a crescent the other way */
  yu_tide_evo: evolve("yu_tide", (s) => qi(s, 13, 10, 3, GOLD)),
  /** White Crane: the cut comes round behind */
  yu_crane_evo: evolve("yu_crane", (s) => swirl(s, 8, 9, 4, 0.3, 2.6, GOLD)),
  /** Blossom Fall: a gold petal */
  yu_petal_evo: evolve("yu_petal", (s) => sparkle(s, 4, 4, 2, GOLD)),
  /** Cloud Walker: the ring draws in */
  yu_cloud_evo: evolve("yu_cloud", (s) => ring(s, 8, 12, 3, GOLD)),
  /** Riding the Wind: the swords ride along */
  yu_ride_evo: evolve("yu_ride", (s) => spirit(s, 1, 5, 9, 5, GOLD)),
  /** Leaf on the Wind: a second cut */
  yu_drift_evo: evolve("yu_drift", (s) => spirit(s, 12, 3, 4, 11, GOLD)),
  /** Peacock Fan: the fan opens behind too */
  yu_fan_evo: evolve("yu_fan", (s) => {
    spirit(s, 8, 8, 1, 3, GOLD);
    spirit(s, 8, 8, 1, 13, GOLD);
  }),
  /** Jade Prison: a gold seal on the foe */
  yu_cage_evo: evolve("yu_cage", (s) => ring(s, 8, 10, 3.5, GOLD)),
  /** Moon Crescent: a moon */
  yu_crescent_evo: evolve("yu_crescent", (s) => swirl(s, 4, 4, 2.5, 0.8, 4.4, GOLD)),
  /** Qi Burst: the wounds burst */
  yu_wound_evo: evolve("yu_wound", (s) => sparkle(s, 8, 8, 3, GOLD)),
  /** Thousand Petals: the wounds open at once */
  yu_bleed_evo: evolve("yu_bleed", (s) => sparkle(s, 8, 8, 3, GOLD)),
  /** Acupuncture: the needles burst */
  yu_needle_evo: evolve("yu_needle", (s) => sparkle(s, 7, 9, 2.5, GOLD)),
  /** Heavenly Guard: three swords circle */
  yu_guardian_evo: evolve("yu_guardian", (s) => {
    spirit(s, 2, 12, 2, 4, GOLD);
    spirit(s, 8, 6, 8, 0, GOLD);
  }),
  /** Heron Flight: three herons */
  yu_heron_evo: evolve("yu_heron", (s) => {
    swirl(s, 6, 4, 2.5, Math.PI, Math.PI * 2, GOLD);
    swirl(s, 6, 14, 2.5, Math.PI, Math.PI * 2, GOLD);
  }),
  /** Many Shades: a second shade */
  yu_shade_evo: evolve("yu_shade", (s) => sage(s, 3, 15, GOLD)),
  /** Sword Sea: a second fan */
  yu_breath_evo: evolve("yu_breath", (s) => {
    spirit(s, 2, 14, 2, 6, GOLD);
    spirit(s, 14, 14, 14, 6, GOLD);
  }),
  /** Perfect Harmony: the heart in gold */
  yu_harmony_evo: evolve("yu_harmony", (s) => sparkle(s, 8, 9, 2, GOLD)),
  /** Endless Rain: more swords keep falling */
  yu_rain_evo: evolve("yu_rain", (s) => {
    spirit(s, 1, 4, 3, 11, GOLD);
    spirit(s, 15, 4, 13, 11, GOLD);
  }),
};
