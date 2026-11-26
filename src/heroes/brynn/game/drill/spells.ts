import { ignite } from "../../../../game/enemies/burn";
import { addStacks } from "../../../../game/enemies/skillStatus";
import { staggerFoe } from "../../../../game/enemies/stagger";
import { progress } from "../../../../game/state";
import type { DrillSpell } from "../../../../types/drill";
import type { Enemy } from "../../../../types/enemy";

const BLEED = { stacks: 1, max: 4, damage: 0.12, every: 0.5, duration: 3 };
const QUAKE_STAGGER = 0.55;
const QUAKE_LIFT = -120;
const EMBER_BURN = 2.2;

function bleed(foe: Enemy): void {
  addStacks(foe, "abilities", { ...BLEED, damage: progress.stats.ap * BLEED.damage });
}

function shake(foe: Enemy): void {
  staggerFoe(foe, QUAKE_STAGGER);
  foe.vy = Math.min(foe.vy, QUAKE_LIFT);
}

function brand(foe: Enemy): void {
  ignite(foe, EMBER_BURN);
}

export const BRYNN_SPELLS: readonly DrillSpell[] = [
  {
    id: "rend",
    art: "spell1",
    name: "Rend",
    color: 0xdc3442,
    core: 0xffc2ae,
    damage: 30,
    speed: 250,
    delay: 0,
    range: 150,
    radius: 16,
    look: "shard",
    freeze: 0,
    status: bleed,
  },
  {
    id: "quake",
    art: "spell2",
    name: "Quake",
    color: 0xb0603a,
    core: 0xffd2a0,
    damage: 44,
    speed: null,
    delay: 0.12,
    range: 110,
    radius: 26,
    look: "spark",
    freeze: 0,
    status: shake,
  },
  {
    id: "arc",
    art: "spell3",
    name: "Ember Arc",
    color: 0xff7a2e,
    core: 0xfff0b8,
    damage: 34,
    speed: 200,
    delay: 0,
    range: 130,
    radius: 22,
    look: "flame",
    freeze: 0,
    status: brand,
  },
];
