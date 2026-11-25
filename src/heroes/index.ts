import type { HeroModule } from "../types/heroModule";
import { ALDRIC_MODULE } from "./aldric";
import { BRYNN_MODULE } from "./brynn";
import { CALDER_MODULE } from "./calder";
import { CERISE_MODULE } from "./cerise";
import { KAEL_MODULE } from "./kael";
import { registerHeroes } from "./registry";
import type { HeroId } from "./roster";
import { SAYA_MODULE } from "./saya";
import { VESPER_MODULE } from "./vesper";
import { YUN_MODULE } from "./yun";
import { ZAFIR_MODULE } from "./zafir";

/**
 * Every hero's module (kit, moves, skill code, ultimate, icons, touch art, meter) by id, placed in the registry
 * (`src/heroes/registry.ts`) as this file loads. Shared code reads a hero's code only through `heroModule` from the
 * registry, and only inside functions. The data half is `src/heroes/roster.ts`.
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

registerHeroes(HERO_MODULES);

export { heroModule } from "./registry";
