import type { DrillSpell } from "../../../../types/drill";
import { roseMark } from "../mark";

export const CERISE_SPELLS: readonly DrillSpell[] = [
  {
    id: "line",
    name: "Rose Line",
    color: 0xff8fb0,
    core: 0xffe1eb,
    damage: 30,
    speed: 260,
    delay: 0,
    range: 150,
    radius: 14,
    look: "shard",
    freeze: 0,
    status: roseMark,
  },
  {
    id: "flurry",
    name: "Flurry",
    color: 0xff5f8f,
    core: 0xffc2d6,
    damage: 44,
    speed: null,
    delay: 0.08,
    range: 70,
    radius: 22,
    look: "flame",
    freeze: 0,
    status: roseMark,
  },
];
