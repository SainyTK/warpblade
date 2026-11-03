import type { EraId } from "../../constants/eras";
import { abyss } from "./abyss";
import { day } from "./day";
import { night } from "./night";
import { rain } from "./rain";
import type { SceneDef } from "./sceneDef";
import { twilight } from "./twilight";

export const SCENES: Record<EraId, SceneDef> = { day, rain, night, twilight, abyss };
