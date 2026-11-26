import { clipAt, clipStart } from "../../motionClips";
import type { DrillClips, Fighter } from "../../types/drill";
import type { Pose } from "../../types/pose";
import { SPELL_RELEASE_RECOVERY } from "../constants";

export function spellReleasePose(h: Fighter, clips: DrillClips): Pose {
  return h.spellRelease ? clipAt(clips.spell, SPELL_RELEASE_RECOVERY - h.spellRelease.life) : clipStart(clips.idle);
}
