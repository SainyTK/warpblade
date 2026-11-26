import type { DrillSpell } from "../../../../types/drill";
import { drawFlurryBlast } from "./looks/flurry";
import { drawRoseBloomBlast, drawRoseBloomBolt } from "./looks/roseBloom";
import { drawRoseLineBlast, drawRoseLineBolt } from "./looks/roseLine";
import { bindWithBloom, markWithRose, staggerWithFlurry } from "./statuses";

export const CERISE_SPELLS: readonly DrillSpell[] = [
  {
    id: "line",
    art: "spell1",
    name: "Rose Line",
    color: 0xff8fb0,
    core: 0xffe1eb,
    damage: 30,
    speed: 300,
    delay: 0,
    range: 160,
    radius: 14,
    look: "shard",
    freeze: 0,
    status: markWithRose,
    drawBolt: drawRoseLineBolt,
    drawImpact: drawRoseLineBlast,
  },
  {
    id: "flurry",
    art: "spell2",
    name: "Flurry",
    color: 0xff5f8f,
    core: 0xffc2d6,
    damage: 44,
    speed: null,
    delay: 0.08,
    range: 70,
    radius: 24,
    look: "flame",
    freeze: 0,
    status: staggerWithFlurry,
    drawImpact: drawFlurryBlast,
  },
  {
    id: "bloom",
    art: "spell3",
    name: "Rose Bloom",
    color: 0xc23a6e,
    core: 0xffa9c6,
    damage: 38,
    speed: 150,
    delay: 0,
    range: 120,
    radius: 26,
    look: "flame",
    freeze: 0,
    status: bindWithBloom,
    drawBolt: drawRoseBloomBolt,
    drawImpact: drawRoseBloomBlast,
  },
];
