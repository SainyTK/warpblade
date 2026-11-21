import { markFoe } from "../../../../game/enemies/skillStatus";
import { staggerFoe } from "../../../../game/enemies/stagger";
import { withCharms } from "../../../../game/skills/query";
import type { DrillSpell } from "../../../../types/drill";
import type { Enemy } from "../../../../types/enemy";
import { SKILL } from "../../constants/skillIds";
import { drawCrescentBolt, drawLotusImpact, drawStreamBolt } from "./spellArt";

const STREAM_STAGGER = 0.3;
const LOTUS_HALT = 1.2;
const QI_MARK = { seconds: 3, bonus: 0.2 };

const cutDown = (foe: Enemy): void => staggerFoe(foe, STREAM_STAGGER);
const holdFeet = (foe: Enemy): void => {
  foe.halt = Math.max(foe.halt, withCharms("duration", LOTUS_HALT));
};
const markQi = (foe: Enemy): void =>
  markFoe(foe, SKILL.crescent, withCharms("duration", QI_MARK.seconds), QI_MARK.bonus);

export const YUN_SPELLS: readonly DrillSpell[] = [
  {
    id: "stream",
    name: "Sword Stream",
    color: 0x5fd6a4,
    core: 0xdcfff0,
    damage: 30,
    speed: 300,
    delay: 0,
    range: 150,
    radius: 15,
    look: "shard",
    freeze: 0,
    status: cutDown,
    drawBolt: drawStreamBolt,
  },
  {
    id: "lotus",
    name: "Sword Lotus",
    color: 0x9af0c8,
    core: 0xffffff,
    damage: 40,
    speed: null,
    delay: 0.12,
    range: 90,
    radius: 26,
    look: "spark",
    freeze: 0,
    status: holdFeet,
    drawImpact: drawLotusImpact,
  },
  {
    id: "crescent",
    name: "Qi Crescent",
    color: 0x3fc493,
    core: 0xdcfff0,
    damage: 34,
    speed: 250,
    delay: 0,
    range: 175,
    radius: 18,
    look: "flame",
    freeze: 0,
    status: markQi,
    drawBolt: drawCrescentBolt,
  },
];
