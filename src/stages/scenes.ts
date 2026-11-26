import type { SceneDef } from "../scene/eras/sceneDef";
import { archiveScene } from "./archive/scene";
import { blightScene } from "./blight/scene";
import { foundryScene } from "./foundry/scene";
import { glacierScene } from "./glacier/scene";
import { skywayScene } from "./skyway/scene";

export const STAGE_SCENES = {
  foundry: foundryScene,
  glacier: glacierScene,
  skyway: skywayScene,
  blight: blightScene,
  archive: archiveScene,
} satisfies Record<string, SceneDef>;
