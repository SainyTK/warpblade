import type { HeroSkin } from '@game/types/character';
import type { Pose } from '@game/types/pose';
import { useEffect, useState } from 'react';
import type { ClipFrames } from '@/types/studio';
import { framePicture, hasFramePicture } from '@/utils/frameThumbnail';

/** Drawing pauses for the page after this long, so the first load of every preview never stalls it. */
const SLICE_MS = 8;

let queue: Promise<void> = Promise.resolve();

const nextTask = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

/** Draws the poses not drawn yet, a few at a time, one clip after another. */
function drawAll(skin: HeroSkin, frames: readonly Pose[]): Promise<HTMLCanvasElement[]> {
  const done = queue.then(async () => {
    let slice = performance.now();
    for (const pose of frames) {
      if (performance.now() - slice > SLICE_MS) {
        await nextTask();
        slice = performance.now();
      }
      framePicture(skin, pose);
    }
    return frames.map((pose) => framePicture(skin, pose));
  });
  queue = done.then(() => undefined);
  return done;
}

/** The frames of a clip as pictures; an edit redraws only the frames it changed. */
export function usePreview(skin: HeroSkin, clip: ClipFrames): HTMLCanvasElement[] | null {
  const [pictures, setPictures] = useState<HTMLCanvasElement[] | null>(null);
  useEffect(() => {
    if (clip.frames.every((pose) => hasFramePicture(skin, pose))) {
      setPictures(clip.frames.map((pose) => framePicture(skin, pose)));
      return;
    }
    let live = true;
    drawAll(skin, clip.frames).then((next) => live && setPictures(next));
    return () => {
      live = false;
    };
  }, [skin, clip]);
  return pictures;
}
