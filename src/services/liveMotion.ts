import {
  CLIP_CHANGED,
  type ClipChange,
  DRAFT_CHANGED,
  DRAFTS_WANTED,
  DRILL_CLIP_IDS,
  type DraftsWanted,
  EVERY_DRAFT,
  isDrillClipId,
  parseClip,
  replaceClip,
} from "../motionClips";
import type { DrillClips } from "../types/motionClip";

/** the clips a dev page plays from the studio's drafts of the hero in play, named with `?drafts=run,strikes/first` */
function draftClips(): Set<string> {
  const named = new URLSearchParams(location.search).get("drafts") ?? "";
  return new Set(named === EVERY_DRAFT ? DRILL_CLIP_IDS : named.split(",").filter(Boolean));
}

/**
 * Dev builds only: a hero's clip is swapped in place when its file changes, so the page keeps running, and the clips
 * named by `?drafts=` play the studio's drafts and follow each save
 */
export function followMotion(hero: string, clips: DrillClips): void {
  const hot = import.meta.hot;
  if (!hot) {
    return;
  }
  const drafts = draftClips();
  const swap = (change: ClipChange) => {
    if (change.hero !== hero || !isDrillClipId(change.clip)) {
      return;
    }
    try {
      replaceClip(clips, change.clip, parseClip(change.clip, change.data));
    } catch (problem) {
      console.warn(problem);
    }
  };
  hot.on(CLIP_CHANGED, (change: ClipChange) => {
    if (!drafts.has(change.clip)) {
      swap(change);
    }
  });
  hot.on(DRAFT_CHANGED, (change: ClipChange) => {
    if (drafts.has(change.clip)) {
      swap(change);
    }
  });
  if (drafts.size) {
    hot.send(DRAFTS_WANTED, { hero, clips: [...drafts] } satisfies DraftsWanted);
  }
}
