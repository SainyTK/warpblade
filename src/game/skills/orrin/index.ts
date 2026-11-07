import type { SkillBehavior } from "../../../types/skillBehavior";
import { brassKite } from "./brassKite";
import { frictionBurn } from "./frictionBurn";
import { pendulumKick } from "./pendulumKick";
import { pendulumPump } from "./pendulumPump";
import { riftBell } from "./riftBell";
import { rustBite } from "./rustBite";
import { twinChain } from "./twinChain";

/** the code of each of Orrin's skills that acts on its own or answers events, by skill id */
export const ORRIN_SKILLS: Readonly<Record<string, SkillBehavior>> = {
  o_kite: brassKite,
  o_bell: riftBell,
  o_twin: twinChain,
  o_rust: rustBite,
  o_friction: frictionBurn,
  o_pendulumkick: pendulumKick,
  o_pump: pendulumPump,
};
