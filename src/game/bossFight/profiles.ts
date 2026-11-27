import { pageStorm } from "../../stages/archive/foes/pagewyrm/behavior";
import { lobBombs } from "../../stages/blight/foes/sporeheart/sporeheart";
import { ingotVolley } from "../../stages/foundry/foes/cindersmith/behavior";
import { roar } from "../../stages/glacier/foes/rimeclaw/moves";
import { releaseFeathers } from "../../stages/skyway/foes/tempestroc/update";
import type { BossProfile } from "../../types/bossFight";
import type { EnemyType } from "../../types/enemy";
import { spit } from "../enemies/abyss/maw";
import { callPillars } from "../enemies/abyss/sovereign";
import { lobAcorns } from "../enemies/day/oakheart";
import { moonfall } from "../enemies/night/shepherd";
import { lob } from "../enemies/rain/boghulk";
import { fireVolley } from "../enemies/warden";

type ProfileTable = Partial<Record<EnemyType, BossProfile>>;

const buildTable = (): ProfileTable => ({
  oakheart: {
    epithet: "Old Root of the Sunlit Ruins",
    power: 1.2,
    light: 0xffc861,
    adds: ["thornback", "moth"],
    combo: { states: ["wind"], chance: 0.5, cast: (e) => lobAcorns(e, true) },
  },
  boghulk: {
    epithet: "The Drowned Brute",
    power: 1.2,
    light: 0x7fd0ff,
    adds: ["mire", "mire"],
    combo: { states: ["wind"], chance: 0.55, cast: lob },
  },
  cindersmith: {
    epithet: "Master of the Black Forge",
    power: 1.15,
    light: 0xff8a2a,
    adds: [],
    combo: { states: ["charge"], chance: 0.55, cast: ingotVolley },
  },
  rimeclaw: {
    epithet: "Fang of the Frozen Deep",
    power: 1.15,
    light: 0x8fd3f2,
    adds: ["shardling", "shardling"],
    combo: { states: ["wind"], chance: 0.5, cast: roar },
  },
  tempestroc: {
    epithet: "Lord of the Thunderhead",
    power: 1.15,
    light: 0xffe066,
    adds: ["sparkjelly", "sparkjelly"],
    combo: { states: ["dive"], chance: 0.6, cast: releaseFeathers },
  },
  pagewyrm: {
    epithet: "Devourer of Lost Pages",
    power: 1.15,
    light: 0x7ab0ff,
    adds: ["inkling", "inkling"],
    combo: { states: ["hop"], chance: 0.55, cast: pageStorm },
  },
  shepherd: {
    epithet: "Keeper of the Gloam Flock",
    power: 1.15,
    light: 0xc8d4ff,
    adds: [],
    combo: { states: ["wind"], chance: 0.5, cast: moonfall },
  },
  warden: {
    epithet: "Jailer of the Veil",
    power: 1.15,
    light: 0xb673e8,
    adds: [],
    combo: { states: ["wind"], chance: 0.6, cast: fireVolley },
  },
  sporeheart: {
    epithet: "The Rot Below the Roots",
    power: 1.15,
    light: 0x9fe05a,
    adds: [],
    combo: { states: ["wind"], chance: 0.55, cast: lobBombs },
  },
  maw: {
    epithet: "Hunger at the Gate",
    power: 1.15,
    light: 0x9a6cff,
    adds: ["stalker", "eye"],
    combo: { states: ["wind"], chance: 0.55, cast: (e) => spit(e, true) },
  },
  sovereign: {
    epithet: "Crown of the Abyss",
    power: 1.1,
    light: 0xd060ff,
    adds: ["eye", "eye"],
    combo: { states: ["wind"], chance: 0.5, cast: callPillars },
  },
});

let table: ProfileTable | null = null;

export function bossProfile(type: EnemyType): BossProfile | null {
  table ??= buildTable();
  return table[type] ?? null;
}
