import type { SkillDef } from "../../../../types/skill";
import { ANCHOR_FALL } from "./anchorFall";
import { BARBED_LINKS } from "./barbedLinks";
import { BRASS_KITE } from "./brassKite";
import { CHAIN_FENCE } from "./chainFence";
import { FRICTION_BURN } from "./frictionBurn";
import { GAFF } from "./gaff";
import { GRAND_PENDULUM_SKILL } from "./grandPendulum";
import { IRON_WEIGHT } from "./ironWeight";
import { PENDULUM_KICK } from "./pendulumKick";
import { PERPETUAL_MOTION } from "./perpetualMotion";
import { PLUMB_DROP } from "./plumbDrop";
import { PENDULUM_PUMP } from "./pump";
import { REEL_SNAP } from "./reelSnap";
import { RIFT_BELL } from "./riftBell";
import { RUST_BITE } from "./rustBite";
import { SKY_LASH } from "./skyLash";
import { SWEET_SPOT } from "./sweetSpot";
import { TETHER } from "./tether";
import { TWIN_CHAIN } from "./twinChain";
import { UNDERTOW } from "./undertow";

/** Orrin's 20 skills, in the order the Codex lists them. Design: docs/skills/orrin.md */
export const ORRIN_SKILL_DEFS: readonly SkillDef[] = [
  SWEET_SPOT,
  IRON_WEIGHT,
  SKY_LASH,
  PENDULUM_KICK,
  GAFF,
  PENDULUM_PUMP,
  REEL_SNAP,
  UNDERTOW,
  PLUMB_DROP,
  CHAIN_FENCE,
  TETHER,
  ANCHOR_FALL,
  BARBED_LINKS,
  RUST_BITE,
  FRICTION_BURN,
  BRASS_KITE,
  RIFT_BELL,
  TWIN_CHAIN,
  PERPETUAL_MOTION,
  GRAND_PENDULUM_SKILL,
];
