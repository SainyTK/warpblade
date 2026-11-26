import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { DUNE_WALK_DRILL } from "./duneWalk";
import { FALLING_DUNE_DRILL } from "./fallingDune";
import { GLASS_RAIN_DRILL } from "./glassRain";
import { HOT_GALE_DRILL } from "./hotGale";
import { OPENED_VEINS_DRILL } from "./openedVeins";
import { QUICKSAND_DRILL } from "./quicksand";
import { SAND_SLIP_DRILL } from "./sandSlip";
import { SANDSTORM_DRILL } from "./sandstorm";
import { SAND_VEIL_DRILL } from "./sandVeil";
import { SAND_WRAITH_DRILL } from "./sandWraith";
import { SCOURING_SAND_DRILL } from "./scouringSand";
import { SIROCCO_DESCENT_DRILL } from "./siroccoDescent";
import { TWO_FACED_CUT_DRILL } from "./twoFacedCut";
import { UNBROKEN_WHIRL_DRILL } from "./unbrokenWhirl";
import { WHIRLING_EDGE_DRILL } from "./whirlingEdge";
import { WHIRLWIND_ARRIVAL_DRILL } from "./whirlwindArrival";

export const ZAFIR_DRILL_SKILLS: readonly ZafirDrillSkill[] = [
  WHIRLING_EDGE_DRILL,
  TWO_FACED_CUT_DRILL,
  OPENED_VEINS_DRILL,
  SIROCCO_DESCENT_DRILL,
  SAND_VEIL_DRILL,
  WHIRLWIND_ARRIVAL_DRILL,
  SAND_SLIP_DRILL,
  DUNE_WALK_DRILL,
  UNBROKEN_WHIRL_DRILL,
  FALLING_DUNE_DRILL,
  QUICKSAND_DRILL,
  HOT_GALE_DRILL,
  GLASS_RAIN_DRILL,
  SCOURING_SAND_DRILL,
  SAND_WRAITH_DRILL,
  SANDSTORM_DRILL,
];
