import type { HeroModule } from "../types/heroModule";
import { ALDRIC_MODULE } from "./aldric";
import { BRYNN_MODULE } from "./brynn";
import { CALDER_MODULE } from "./calder";
import { CERISE_MODULE } from "./cerise";
import { KAEL_MODULE } from "./kael";
import type { HeroId } from "./roster";
import { SAYA_MODULE } from "./saya";
import { VESPER_MODULE } from "./vesper";
import { YUN_MODULE } from "./yun";
import { ZAFIR_MODULE } from "./zafir";

/**
 * The hero registry's code half: every hero's module (kit, moves, skill code, ultimate, icons, touch art, meter) by
 * id. Shared code reaches a hero's code only through `heroModule`, and only inside functions, never while a module
 * loads, so the order modules load in never matters. The data half is `src/heroes/roster.ts`.
 */
const HERO_MODULES: Readonly<Record<HeroId, HeroModule>> = {
  kael: KAEL_MODULE,
  cerise: CERISE_MODULE,
  aldric: ALDRIC_MODULE,
  vesper: VESPER_MODULE,
  saya: SAYA_MODULE,
  yun: YUN_MODULE,
  brynn: BRYNN_MODULE,
  zafir: ZAFIR_MODULE,
  calder: CALDER_MODULE,
};

/** the code of the hero with this id */
export const heroModule = (id: string): HeroModule => HERO_MODULES[id as HeroId];
