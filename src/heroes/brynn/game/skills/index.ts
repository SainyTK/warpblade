import type { SkillBehavior } from "../../../../types/skillBehavior";
import { crushingWeight } from "./crushingWeight";
import { echoSwing } from "./echoSwing";
import { fallingBlade } from "./fallingBlade";
import { faultLines } from "./faultLines";
import { redShard } from "./redShard";
import { searingEdge } from "./searingEdge";
import { skywardHeave } from "./skywardHeave";
import { spinningThrow } from "./spinningThrow";
import { wideArc } from "./wideArc";

/** the code of Brynn's skills that act on their own or answer events, by skill id; the rest reshape her kit */
export const BRYNN_SKILLS: Readonly<Record<string, SkillBehavior>> = {
  br_cleave: wideArc,
  br_launch: skywardHeave,
  br_embers: searingEdge,
  br_fault: faultLines,
  br_crush: crushingWeight,
  br_falling: fallingBlade,
  br_echo: echoSwing,
  br_shard: redShard,
  br_spin: spinningThrow,
};
