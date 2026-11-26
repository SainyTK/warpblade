import { STAGE_MUSIC } from "../constants/audio";
import type { MusicTrack } from "../types/audio";
import { currentStage, stageBoss } from "./adventure";
import { game, hero } from "./state";

export function musicTrack(onTitle: boolean): MusicTrack | null {
  if (onTitle || game.mode === "map") return "map";
  if (hero.state === "dead") return null;
  const boss = stageBoss();
  if ((boss && boss.hp > 0) || game.enemies.some((e) => e.rank === "boss" && e.hp > 0)) return "boss";
  return STAGE_MUSIC[currentStage()?.id ?? "prologue"];
}
