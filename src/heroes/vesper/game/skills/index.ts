import type { SkillBehavior } from "../../../../types/skillBehavior";
import { afterglow } from "./afterglow";
import { ascendingStep } from "./ascendingStep";
import { duskShade } from "./duskShade";
import { duskSigil } from "./duskSigil";
import { fallingNight } from "./fallingNight";
import { wanderersGrace } from "./grace";
import { nightSwallows } from "./nightSwallows";
import { unbrokenRhythm } from "./rhythm";
import { twinPhantom } from "./twinPhantom";

/** the code of each of Vesper's skills that acts on its own or answers events, by skill id; the rest live in her kit */
export const VESPER_SKILLS: Readonly<Record<string, SkillBehavior>> = {
  ve_ascend: ascendingStep,
  ve_hex: duskSigil,
  ve_night: fallingNight,
  ve_glow: afterglow,
  ve_shade: duskShade,
  ve_swallow: nightSwallows,
  ve_twin: twinPhantom,
  ve_rhythm: unbrokenRhythm,
  ve_grace: wanderersGrace,
};
