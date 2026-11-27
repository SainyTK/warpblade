import type { SkillBehavior } from "../../../../types/skillBehavior";
import { cinderEdge } from "./cinderEdge";
import { crushingWeight } from "./crushingWeight";
import { echoSwing } from "./echoSwing";
import { fallingBlade } from "./fallingBlade";
import { faultLines } from "./faultLines";
import { heartSplinter } from "./heartSplinter";
import { skywardHeave } from "./skywardHeave";
import { spinningThrow } from "./spinningThrow";
import { wideArc } from "./wideArc";

/** the code of Brynn's skills that act on their own or answer events, by skill id; the rest reshape her kit */
export const BRYNN_SKILLS: Readonly<Record<string, SkillBehavior>> = {
  br_cleave: wideArc,
  br_launch: skywardHeave,
  br_cinder: cinderEdge,
  br_fault: faultLines,
  br_crush: crushingWeight,
  br_falling: fallingBlade,
  br_echo: echoSwing,
  br_splinter: heartSplinter,
  br_spin: spinningThrow,
};
