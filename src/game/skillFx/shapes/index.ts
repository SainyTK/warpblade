import type { FxShape, FxShapeDraw } from "../../../types/skillFx";
import { drawBolt } from "./bolt";
import { drawBurst } from "./burst";
import { drawMark } from "./mark";
import { drawNova } from "./nova";
import { drawPillar } from "./pillar";
import { drawSlash } from "./slash";
import { drawSpikes } from "./spikes";
import { drawTrail } from "./trail";
import { drawWave } from "./wave";

export const SHAPES: Readonly<Record<FxShape, FxShapeDraw>> = {
  burst: drawBurst,
  slash: drawSlash,
  pillar: drawPillar,
  wave: drawWave,
  trail: drawTrail,
  bolt: drawBolt,
  nova: drawNova,
  spikes: drawSpikes,
  mark: drawMark,
};

export const SHAPE_LIFE: Readonly<Record<FxShape, number>> = {
  burst: 1,
  slash: 0.9,
  pillar: 1.2,
  wave: 1.5,
  trail: 0.9,
  bolt: 0.8,
  nova: 1.3,
  spikes: 1.4,
  mark: 1.1,
};

export const MOVING_SHAPES: ReadonlySet<FxShape> = new Set(["slash", "trail", "wave"]);

export const GROUNDED_SHAPES: ReadonlySet<FxShape> = new Set(["pillar", "wave", "nova", "spikes"]);
