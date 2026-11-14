import type { SkillDef } from "../../../../types/skill";
import { DEEP_WOUNDS } from "./deepWounds";
import { DESERT_HAWK } from "./desertHawk";
import { DESERT_THIRST } from "./desertThirst";
import { DUNE_WALK } from "./duneWalk";
import { FALLING_DUNE } from "./fallingDune";
import { GLASS_RAIN } from "./glassRain";
import { HOT_GALE } from "./hotGale";
import { MIRAGE_DANCER } from "./mirageDancer";
import { OPENED_VEINS } from "./openedVeins";
import { QUICKSAND_SKILL } from "./quicksand";
import { SAND_SLIP } from "./sandSlip";
import { SANDSTORM } from "./sandstorm";
import { SAND_VEIL_SKILL } from "./sandVeil";
import { SAND_WRAITH } from "./sandWraith";
import { SCOURING_SAND } from "./scouringSand";
import { SIROCCO_TIMING } from "./siroccoTiming";
import { TWO_FACED_CUT } from "./twoFacedCut";
import { UNBROKEN_WHIRL } from "./unbrokenWhirl";
import { WHIRLING_EDGE } from "./whirlingEdge";
import { WHIRLWIND_ARRIVAL } from "./whirlwindArrival";

/** Zafir's 20 skills. Design: docs/skills/zafir.md */
export const ZAFIR_SKILL_DEFS: readonly SkillDef[] = [
  WHIRLING_EDGE,
  SIROCCO_TIMING,
  OPENED_VEINS,
  TWO_FACED_CUT,
  FALLING_DUNE,
  DUNE_WALK,
  WHIRLWIND_ARRIVAL,
  SAND_SLIP,
  HOT_GALE,
  GLASS_RAIN,
  QUICKSAND_SKILL,
  DEEP_WOUNDS,
  SCOURING_SAND,
  DESERT_THIRST,
  SAND_WRAITH,
  MIRAGE_DANCER,
  DESERT_HAWK,
  UNBROKEN_WHIRL,
  SAND_VEIL_SKILL,
  SANDSTORM,
];
