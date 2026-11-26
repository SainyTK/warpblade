import { withBuild } from "../../../../game/skills/query";
import type { DrillSpell } from "../../../../types/drill";
import type { Enemy } from "../../../../types/enemy";
import { SPELL_STATUS } from "../../constants/drill/spells";
import { openWounds } from "../wounds";
import { blindMinion } from "./strike";

function sink(foe: Enemy): void {
  foe.chill = Math.max(foe.chill, withBuild("duration", SPELL_STATUS.spout.slow));
  openWounds(foe, SPELL_STATUS.spout.wounds);
}

function bleed(foe: Enemy): void {
  openWounds(foe, SPELL_STATUS.crescent.wounds);
}

function scour(foe: Enemy): void {
  blindMinion(foe, withBuild("duration", SPELL_STATUS.glass.blind));
  foe.halt = Math.max(foe.halt, SPELL_STATUS.glass.halt);
}

export const ZAFIR_SPELLS: readonly DrillSpell[] = [
  {
    id: "spout",
    art: "spell1",
    name: "Sandspout",
    color: 0xe0a84a,
    core: 0xfff0c8,
    damage: 30,
    speed: 150,
    delay: 0,
    range: 130,
    radius: 18,
    look: "flame",
    freeze: 0,
    status: sink,
  },
  {
    id: "crescent",
    art: "spell2",
    name: "Crescent",
    color: 0xf8b84a,
    core: 0xfffbe8,
    damage: 28,
    speed: 250,
    delay: 0,
    range: 115,
    radius: 13,
    look: "shard",
    freeze: 0,
    status: bleed,
  },
  {
    id: "glass",
    art: "spell3",
    name: "Glass Rain",
    color: 0x9ee0d8,
    core: 0xeafffb,
    damage: 42,
    speed: null,
    delay: 0.1,
    range: 135,
    radius: 22,
    look: "spark",
    freeze: 0,
    status: scour,
  },
];
