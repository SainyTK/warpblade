import type { SkillDef } from "../../../../types/skill";
import { ANCESTORS_FIST } from "./ancestorFist";
import { BRUISING_KNUCKLES } from "./bruise";
import { BULL_HORNS } from "./bullHorns";
import { IRON_COUNTER } from "./counterGrab";
import { CRUSHING_GRIP } from "./fracture";
import { GIANT_SWING } from "./giantSwing";
import { WRECKING_HAYMAKER } from "./haymaker";
import { IRON_CHAIN } from "./ironChain";
import { IRON_HIDE } from "./ironHide";
import { IRON_WALL } from "./ironWall";
import { KNUCKLE_WAVE } from "./knuckleWave";
import { RUST_SHARDS } from "./rustShards";
import { SHIELD_SISTER } from "./shieldSister";
import { SKYFALL_BREAKER } from "./skyfall";
import { SPIRIT_BEAR } from "./spiritBear";
import { STAMPEDE } from "./stampede";
import { TITAN_THROW } from "./titanThrow";
import { TREMOR_STOMP } from "./tremorStomp";
import { UNBROKEN } from "./unbroken";
import { WRECKING_THROW } from "./wreckingThrow";

/** Hulda's 20 skills, in the order the Codex lists them. Design: docs/skills/hulda.md */
export const HULDA_SKILL_DEFS: readonly SkillDef[] = [
  KNUCKLE_WAVE,
  WRECKING_HAYMAKER,
  IRON_COUNTER,
  WRECKING_THROW,
  GIANT_SWING,
  BULL_HORNS,
  STAMPEDE,
  SKYFALL_BREAKER,
  IRON_HIDE,
  IRON_CHAIN,
  TREMOR_STOMP,
  IRON_WALL,
  BRUISING_KNUCKLES,
  CRUSHING_GRIP,
  RUST_SHARDS,
  SHIELD_SISTER,
  SPIRIT_BEAR,
  ANCESTORS_FIST,
  TITAN_THROW,
  UNBROKEN,
];
