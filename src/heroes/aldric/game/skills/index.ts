import type { SkillBehavior } from "../../../../types/skillBehavior";
import { drillGuardEvents } from "../drill/guardEvents";
import { dawnFalcon } from "./dawnFalcon";
import { oathsworn } from "./oathsworn";
import { penance } from "./penance";
import { sunbrand } from "./sunbrand";
import { sunLion } from "./sunLion";
import { verdict } from "./verdict";

/** the code of each of Aldric's skills that acts on its own or answers events, by skill id; the rest live in his kit */
export const ALDRIC_SKILLS: Readonly<Record<string, SkillBehavior>> = {
  al_verdict: verdict,
  al_brand: sunbrand,
  al_penance: penance,
  al_oathsworn: oathsworn,
  al_lion: sunLion,
  al_falcon: dawnFalcon,
  al_retort: drillGuardEvents,
};
