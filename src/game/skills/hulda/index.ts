import type { SkillBehavior } from "../../../types/skillBehavior";
import { ancestorFist } from "./ancestorFist";
import { bruisingKnuckles } from "./bruise";
import { crushingGrip } from "./crushingGrip";
import { ironHide } from "./ironHide";
import { quakeDrop } from "./quakeDrop";
import { rustShards } from "./rustShards";
import { shieldSister } from "./shieldSister";
import { spiritBear } from "./spiritBear";

/** the code of each of Hulda's skills that acts on its own or answers events, by skill id */
export const HULDA_SKILLS: Readonly<Record<string, SkillBehavior>> = {
  h_ancestorFist: ancestorFist,
  h_shieldSister: shieldSister,
  h_spiritBear: spiritBear,
  h_quakeDrop: quakeDrop,
  h_bruise: bruisingKnuckles,
  h_fracture: crushingGrip,
  h_ironHide: ironHide,
  h_rustShards: rustShards,
};
