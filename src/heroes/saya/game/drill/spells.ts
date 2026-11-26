import { progress } from "../../../../game/state";
import type { DrillSpell } from "../../../../types/drill";
import type { Enemy } from "../../../../types/enemy";
import { DRILL_STORE } from "../../constants/drill/store";
import { storeCut } from "../store";
import { drawCrescentBolt, drawCrescentImpact } from "./effects/crescentWave";
import { drawInkRainImpact } from "./effects/inkRain";
import { drawStillWaterImpact } from "./effects/stillWater";
import { cutAngle } from "./targets";

const RAIN_HOLD = 0.9;
const STILL_CHILL = 2;

function crescentCut(foe: Enemy): void {
  storeCut(foe, progress.stats.ap * DRILL_STORE.spell, cutAngle(foe), "abilities");
}

function rainHold(foe: Enemy): void {
  foe.halt = Math.max(foe.halt, RAIN_HOLD);
}

function stillChill(foe: Enemy): void {
  foe.chill = Math.max(foe.chill, STILL_CHILL);
}

export const SAYA_SPELLS: readonly DrillSpell[] = [
  {
    id: "crescent",
    name: "Crescent Wave",
    color: 0xb4c0ff,
    core: 0xf4f6ff,
    damage: 30,
    speed: 270,
    delay: 0,
    range: 160,
    radius: 16,
    look: "shard",
    freeze: 0,
    cooldown: 1.6,
    mp: 8,
    status: crescentCut,
    drawBolt: drawCrescentBolt,
    drawImpact: drawCrescentImpact,
  },
  {
    id: "rain",
    name: "Ink Rain",
    color: 0x6a78d8,
    core: 0xdfe5ff,
    damage: 40,
    speed: null,
    delay: 0.16,
    range: 150,
    radius: 26,
    look: "spark",
    freeze: 0,
    cooldown: 2.6,
    mp: 11,
    status: rainHold,
    drawImpact: drawInkRainImpact,
  },
  {
    id: "still",
    name: "Still Water",
    color: 0xe8ecff,
    core: 0xffffff,
    damage: 22,
    speed: null,
    delay: 0.06,
    range: 70,
    radius: 34,
    look: "flame",
    freeze: 1.1,
    cooldown: 2.8,
    mp: 9,
    status: stillChill,
    drawImpact: drawStillWaterImpact,
  },
];
