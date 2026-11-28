import type { EnemyDef } from "../../../constants/enemies";
import type { PrologueFoe } from "./ids";

export const PROLOGUE_DEFS = {
  slime: { rank: "minion", hp: 10, xp: 4, weight: 0, launchable: true, name: "Moss Slime" },
  bat: { rank: "minion", hp: 8, xp: 5, weight: 0, launchable: true, name: "Belfry Bat" },
  vinelash: { rank: "minion", hp: 60, xp: 11, weight: 0.4, launchable: true, name: "Vine Lasher" },
  amberwasp: { rank: "minion", hp: 36, xp: 14, weight: 0, launchable: true, name: "Amber Wasp" },
  ruinsentinel: { rank: "minion", hp: 90, xp: 18, weight: 0.8, launchable: false, name: "Moss Sentinel" },
  ivygargoyle: { rank: "minion", hp: 50, xp: 22, weight: 0.5, launchable: true, name: "Ivy Gargoyle" },
  rootcaller: { rank: "minion", hp: 80, xp: 26, weight: 0.6, launchable: true, name: "Rootcaller" },
  sunbasilisk: { rank: "minion", hp: 120, xp: 30, weight: 0.9, launchable: false, name: "Sunscale Basilisk" },
} satisfies Record<PrologueFoe, EnemyDef>;
