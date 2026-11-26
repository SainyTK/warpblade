import { pageStorm } from "../../stages/archive/foes/pagewyrm/behavior";
import { WYRM } from "../../stages/archive/foes/pagewyrm/moves";
import { HEART_ENRAGE } from "../../stages/blight/foes/sporeheart/moves";
import { lobBombs } from "../../stages/blight/foes/sporeheart/sporeheart";
import { ingotVolley, SMITH_ENRAGE } from "../../stages/foundry/foes/cindersmith/behavior";
import { CLAW } from "../../stages/glacier/foes/rimeclaw/constants";
import { roar } from "../../stages/glacier/foes/rimeclaw/moves";
import { ROC_ENRAGE } from "../../stages/skyway/foes/tempestroc/moves";
import { releaseFeathers } from "../../stages/skyway/foes/tempestroc/update";
import type { BossProfile } from "../../types/bossFight";
import type { EnemyType } from "../../types/enemy";
import { MAW_ENRAGE, spit } from "../enemies/abyss/maw";
import { callPillars, SOVEREIGN_ENRAGE } from "../enemies/abyss/sovereign";
import { lobAcorns, OAK_ENRAGE } from "../enemies/day/oakheart";
import { moonfall } from "../enemies/night/shepherd";
import { KNEEL } from "../enemies/night/shepherdMoves";
import { lob } from "../enemies/rain/boghulk";
import { SINKING } from "../enemies/rain/hulkMoves";
import { fireVolley, WARDEN_ENRAGE } from "../enemies/warden";

type ProfileTable = Partial<Record<EnemyType, BossProfile>>;

const buildTable = (): ProfileTable => ({
  oakheart: {
    epithet: "Old Root of the Sunlit Ruins",
    hp: 7.5,
    power: 1.8,
    phaseAt: OAK_ENRAGE,
    light: 0xffc861,
    adds: ["thornback", "moth"],
    combo: { states: ["wind"], chance: 0.5, cast: (e) => lobAcorns(e, true) },
  },
  boghulk: {
    epithet: "The Drowned Brute",
    hp: 4.5,
    power: 1.2,
    phaseAt: SINKING.at,
    light: 0x7fd0ff,
    adds: ["mire", "mire"],
    combo: { states: ["wind"], chance: 0.55, cast: lob },
  },
  cindersmith: {
    epithet: "Master of the Black Forge",
    hp: 1.4,
    power: 1.15,
    phaseAt: SMITH_ENRAGE,
    light: 0xff8a2a,
    adds: [],
    combo: { states: ["charge"], chance: 0.55, cast: ingotVolley },
  },
  rimeclaw: {
    epithet: "Fang of the Frozen Deep",
    hp: 1.4,
    power: 1.15,
    phaseAt: CLAW.enrage,
    light: 0x8fd3f2,
    adds: ["shardling", "shardling"],
    combo: { states: ["wind"], chance: 0.5, cast: roar },
  },
  tempestroc: {
    epithet: "Lord of the Thunderhead",
    hp: 0.65,
    power: 1.15,
    phaseAt: ROC_ENRAGE,
    light: 0xffe066,
    adds: ["sparkjelly", "sparkjelly"],
    combo: { states: ["dive"], chance: 0.6, cast: releaseFeathers },
  },
  pagewyrm: {
    epithet: "Devourer of Lost Pages",
    hp: 1,
    power: 1.15,
    phaseAt: WYRM.enrage,
    light: 0x7ab0ff,
    adds: ["inkling", "inkling"],
    combo: { states: ["hop"], chance: 0.55, cast: pageStorm },
  },
  shepherd: {
    epithet: "Keeper of the Gloam Flock",
    hp: 8,
    power: 1.15,
    phaseAt: KNEEL.at,
    light: 0xc8d4ff,
    adds: [],
    combo: { states: ["wind"], chance: 0.5, cast: moonfall },
  },
  warden: {
    epithet: "Jailer of the Veil",
    hp: 1.7,
    power: 1.15,
    phaseAt: WARDEN_ENRAGE,
    light: 0xb673e8,
    adds: [],
    combo: { states: ["wind"], chance: 0.6, cast: fireVolley },
  },
  sporeheart: {
    epithet: "The Rot Below the Roots",
    hp: 2.3,
    power: 1.15,
    phaseAt: HEART_ENRAGE,
    light: 0x9fe05a,
    adds: [],
    combo: { states: ["wind"], chance: 0.55, cast: lobBombs },
  },
  maw: {
    epithet: "Hunger at the Gate",
    hp: 5.5,
    power: 1.15,
    phaseAt: MAW_ENRAGE,
    light: 0x9a6cff,
    adds: ["stalker", "eye"],
    combo: { states: ["wind"], chance: 0.55, cast: (e) => spit(e, true) },
  },
  sovereign: {
    epithet: "Crown of the Abyss",
    hp: 1.2,
    power: 1.1,
    phaseAt: SOVEREIGN_ENRAGE,
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
